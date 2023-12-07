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

export interface IBufferInfo {
  array: Float32Array;
  bufferDescriptor: Pick<GPUBufferDescriptor, 'size' | 'mappedAtCreation'>;
}

interface Props {
  partialRenderPipelineDescriptor?: Partial<GPURenderPipelineDescriptor>;
  partialConfiguration?: Partial<GPUCanvasConfiguration>;

  partialVertexState?: Partial<GPUVertexState>;
  vertexCount?: number;
  vertexShader: string;
  partialFragmentState?: Partial<GPUFragmentState>;
  fragmentShader: string;

  textureDescriptor?: GPUTextureDescriptor;
  instanceCount?: number | undefined;
  firstVertex?: number | undefined;
  firstInstance?: number | undefined;

  backgroundColor?: Vec4;
  vertexBufferLayout?: GPUVertexBufferLayout;

  vertexBufferInfo?: IBufferInfo;
  uniformBufferInfo?: IBufferInfo;
}

export const CanvasProvider: React.FC<PropsWithChildren & Props> = ({
  children,
  partialRenderPipelineDescriptor,
  partialConfiguration,
  partialFragmentState,
  partialVertexState,
  vertexShader,
  fragmentShader,
  vertexCount,
  instanceCount,
  firstVertex,
  firstInstance,
  backgroundColor,
  vertexBufferLayout,
  vertexBufferInfo,
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
          buffers: vertexBufferLayout ? [vertexBufferLayout] : undefined,
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

      const vertexBuffer = vertexBufferInfo
        ? device.createBuffer({
            ...vertexBufferInfo.bufferDescriptor,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          })
        : undefined;

      if (vertexBuffer && vertexBufferInfo) {
        new Float32Array(vertexBuffer.getMappedRange()).set(
          vertexBufferInfo.array,
        );
        vertexBuffer.unmap();

        device.queue.writeBuffer(vertexBuffer, 0, vertexBufferInfo.array);
      }

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: backgroundColor || [0, 0, 0, 1],
          },
        ] as Iterable<GPURenderPassColorAttachment | null>,
      });

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
