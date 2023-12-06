'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import { Vec4 } from 'wgpu-matrix';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
}

// @ts-ignore
export const CanvasContext = createContext<ICanvasContext>({});

interface Props {
  partialRenderPipelineDescriptor?: Partial<GPURenderPipelineDescriptor>;
  partialConfiguration?: Partial<GPUCanvasConfiguration>;
  partialVertexState?: Partial<GPUVertexState>;
  partialFragmentState?: Partial<GPUFragmentState>;
  vertexCount?: number;
  vertexShader: string;
  fragmentShader: string;
  partialBufferDescriptor?: Pick<
    GPUBufferDescriptor,
    'size' | 'mappedAtCreation'
  >;
  vertexArray?: ArrayLike<number> | Float32Array;
  textureDescriptor?: GPUTextureDescriptor;
  instanceCount?: number | undefined;
  firstVertex?: number | undefined;
  firstInstance?: number | undefined;
  backgroundColor?: Vec4;
}

export const CanvasProvider: React.FC<PropsWithChildren & Props> = ({
  children,
  partialRenderPipelineDescriptor,
  partialConfiguration,
  partialFragmentState,
  partialVertexState,
  vertexShader,
  fragmentShader,
  partialBufferDescriptor,
  vertexCount,
  instanceCount,
  firstVertex,
  firstInstance,
  backgroundColor,
  vertexArray = [],
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

      if (!context) {
        throw new Error('No appropriate context found.');
      }

      const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

      context.configure({
        device: device,
        format: canvasFormat,
        ...partialConfiguration,
      });

      const pipeline = device.createRenderPipeline({
        ...partialRenderPipelineDescriptor,
        layout: 'auto',
        vertex: {
          ...partialVertexState,
          module: device.createShaderModule({
            code: vertexShader,
          }),
          entryPoint: 'main',
        },
        fragment: {
          ...partialFragmentState,
          module: device.createShaderModule({
            code: fragmentShader,
          }),
          entryPoint: 'main',
          targets: [
            {
              format: canvasFormat,
            },
          ],
        },
      });

      const commandEncoder = device.createCommandEncoder();

      const passEncoder = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: backgroundColor || [0, 0, 0, 1],
          },
        ],
      });

      const vertexBuffer = partialBufferDescriptor
        ? device.createBuffer({
            ...partialBufferDescriptor,
            usage: GPUBufferUsage.VERTEX,
          })
        : undefined;

      if (vertexBuffer) {
        new Float32Array(vertexBuffer.getMappedRange()).set(vertexArray);
        vertexBuffer.unmap();
      }

      if (vertexCount !== undefined) {
        passEncoder.setPipeline(pipeline);

        if (vertexBuffer) {
          passEncoder.setVertexBuffer(0, vertexBuffer);
        }

        passEncoder.draw(
          vertexCount,
          instanceCount,
          firstVertex,
          firstInstance,
        );
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
