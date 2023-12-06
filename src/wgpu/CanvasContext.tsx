'use client';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  PropsWithChildren,
} from 'react';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
}

// @ts-ignore
export const CanvasContext = createContext<ICanvasContext>({});

interface Props {
  partialDescriptor?: Partial<GPURenderPipelineDescriptor>;
  partialConfiguration?: Partial<GPUCanvasConfiguration>;
  partialVertexState?: Partial<GPUVertexState>;
  partialFragmentState?: Partial<GPUFragmentState>;
  vertexCount?: number;
  vertexShader: string;
  fragmentShader: string;
}

export const CanvasProvider: React.FC<PropsWithChildren & Props> = ({
  children,
  partialDescriptor,
  partialConfiguration,
  partialFragmentState,
  partialVertexState,
  vertexCount,
  vertexShader,
  fragmentShader,
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
      const commandEncoder = device.createCommandEncoder();

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
        ...partialDescriptor,
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
