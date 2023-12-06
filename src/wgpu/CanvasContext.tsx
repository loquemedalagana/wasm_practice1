'use client';
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  PropsWithChildren,
} from 'react';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

import { convertColorIntoFloat } from '@/util/math/color';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
}

// @ts-ignore
export const CanvasContext = createContext<ICanvasContext>({});

interface Props {
  vertexCount?: number;
  partialDescriptor?: Partial<GPURenderPipelineDescriptor>;
  partialConfiguration?: Partial<GPUCanvasConfiguration>;
}

export const CanvasProvider: React.FC<PropsWithChildren & Props> = ({
  children,
  partialDescriptor,
  partialConfiguration,
  vertexCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const init = async () => {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        throw new Error('No appropriate GPUAdapter found.');
      }
      if (!canvasRef.current) {
        throw new Error('No appropriate canvas found.');
      }

      const device = await adapter.requestDevice();
      const context = canvasRef.current.getContext('webgpu');
      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
      const commandEncoder = device.createCommandEncoder();

      if (!context) {
        throw new Error('No appropriate context found.');
      }

      context.configure({
        device: device,
        format: canvasFormat,
        ...partialConfiguration,
      });

      const pipeline = device.createRenderPipeline({
        ...partialDescriptor,
        layout: 'auto',
        vertex: {
          module: device.createShaderModule({
            code: `
            @vertex
              fn main(
                @builtin(vertex_index) VertexIndex : u32
              ) -> @builtin(position) vec4<f32> {
                var pos = array<vec2<f32>, 3>(
                  vec2(0.0, 0.5),
                  vec2(-0.5, -0.5),
                  vec2(0.5, -0.5)
                );
              
                return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
              }

            `,
          }),
          entryPoint: 'main',
        },
        fragment: {
          module: device.createShaderModule({
            code: `
            @fragment
            fn main() -> @location(0) vec4<f32> {
              return vec4(0.0, 1.0, 0.0, 1.0);
            }
            `,
          }),
          entryPoint: 'main',
          targets: [
            {
              format: canvasFormat,
            },
          ],
        },
        primitive: {
          topology: 'triangle-list',
        },
      });

      console.log(pipeline);

      const passEncoder = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
      });

      if (vertexCount !== undefined) {
        passEncoder.setPipeline(pipeline);
        passEncoder.draw(vertexCount);
      }
      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);
    };
    init();
  }, [canvasRef.current]);

  const value = {
    canvas: canvasRef.current,
  };

  return (
    <section className="wrapper canvas-wrapper">
      {typeof window !== 'undefined' &&
        typeof navigator !== 'undefined' &&
        canvasRef.current && (
          <CanvasContext.Provider value={value}>
            {children}
          </CanvasContext.Provider>
        )}
      <canvas ref={canvasRef} className="canvas"></canvas>
    </section>
  );
};

export default CanvasProvider;

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  return context;
};
