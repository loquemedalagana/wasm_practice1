'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';
import { Vec4 } from 'wgpu-matrix';
import initDevice from '@/wgpu/initDevice';

export interface ICanvasContext {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

// @ts-ignore
export const CanvasContext = createContext<ICanvasContext>({});

export interface IBufferInfo {
  array: Float32Array;
  bufferDescriptor: Pick<GPUBufferDescriptor, 'size' | 'mappedAtCreation'>;
}

interface Props {
  partialRenderPipelineDescriptor?: Partial<GPURenderPipelineDescriptor>;
  canvasConfig: Partial<GPUCanvasConfiguration>;

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

  // buffer information
  vertexBufferInfo?: IBufferInfo;
  vertexBufferLayout?: GPUVertexBufferLayout;
  uniformBufferInfo?: IBufferInfo;
}

export const CanvasProvider: React.FC<PropsWithChildren & Props> = ({
  children,
  partialRenderPipelineDescriptor,
  canvasConfig,
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
  uniformBufferInfo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const init = async () => {
      const { device, context, canvasFormat } = await initDevice(
        canvasRef,
        canvasConfig,
      );

      const commandEncoder = device.createCommandEncoder();

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

      const uniformBuffer = uniformBufferInfo
        ? device.createBuffer({
            ...uniformBufferInfo.bufferDescriptor,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
          })
        : undefined;

      const vertexBuffer = vertexBufferInfo
        ? device.createBuffer({
            ...vertexBufferInfo.bufferDescriptor,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          })
        : undefined;

      if (uniformBuffer && uniformBufferInfo) {
        device.queue.writeBuffer(uniformBuffer, 0, uniformBufferInfo.array);
      }

      const bindGroup = uniformBuffer
        ? device.createBindGroup({
            label: 'Cell renderer bind group',
            layout: pipeline.getBindGroupLayout(0),
            entries: [
              {
                binding: 0,
                resource: { buffer: uniformBuffer },
              },
            ],
          })
        : undefined;

      if (vertexBuffer && vertexBufferInfo) {
        new Float32Array(vertexBuffer.getMappedRange()).set(
          vertexBufferInfo.array,
        );
        vertexBuffer.unmap();
        device.queue.writeBuffer(vertexBuffer, 0, vertexBufferInfo.array);
      }

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

        if (bindGroup) {
          passEncoder.setBindGroup(0, bindGroup);
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
    canvasRef,
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
