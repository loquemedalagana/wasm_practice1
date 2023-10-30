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

import { convertColorIntoFloat } from '@/util/math/color';
import { useCombinedRefs } from '@/util/UI/useCombinedRef';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  context: GPUCanvasContext | null;
  canvasFormat: GPUTextureFormat | null;
  commandEncoder: GPUCommandEncoder | null;
  renderPassEncoder: GPURenderPassEncoder | null;
}

export const CanvasContext = createContext<ICanvasContext | null>(null);

export const CanvasProvider = forwardRef<HTMLCanvasElement, PropsWithChildren>(
  ({ children }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const combinedRef = useCombinedRefs<HTMLCanvasElement>(ref, canvasRef);
    const [adapter, setAdapter] = useState<GPUAdapter | null>(null);
    const [device, setDevice] = useState<GPUDevice | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<GPUCanvasContext | null>(null);
    const [canvasFormat, setCanvasFormat] = useState<GPUTextureFormat | null>(
      null,
    );
    const [commandEncoder, setCommandEncoder] =
      useState<GPUCommandEncoder | null>(null);
    const [renderPassEncoder, setRenderPassEncoder] =
      useState<GPURenderPassEncoder | null>(null);

    const initAdapter = async () => {
      if (!navigator.gpu) {
        throw new Error('WebGPU not supported on this browser.');
      }
      const newAdapter = await navigator.gpu.requestAdapter();
      setAdapter(newAdapter);
    };

    const initDevice = useCallback(async () => {
      if (!adapter) {
        throw new Error('No appropriate GPUAdapter found.');
      }
      const newDevice = await adapter.requestDevice();
      const newContext = canvas?.getContext('webgpu');
      const newCanvasFormat = navigator.gpu.getPreferredCanvasFormat();
      const newEncoder = newDevice.createCommandEncoder();

      if (newContext) {
        newContext.configure({
          device: newDevice,
          format: newCanvasFormat,
        });
        setContext(newContext);
      }

      setDevice(newDevice);
      setCanvasFormat(newCanvasFormat);
      setCommandEncoder(newEncoder);
    }, [adapter, canvas]);

    useEffect(() => {
      if (commandEncoder && context && device) {
        console.log(commandEncoder);
        const newPass = commandEncoder.beginRenderPass({
          // @ts-ignore
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),
              loadOp: 'clear',
              clearValue: convertColorIntoFloat({ r: 174, g: 222, b: 252 }), // New line
              storeOp: 'store',
            },
          ],
        });
        newPass.end();
        setRenderPassEncoder(newPass);

        device.queue.submit([commandEncoder.finish()]);
      }
    }, [commandEncoder]);

    useEffect(() => {
      if (canvasRef.current && !canvas) {
        setCanvas(canvasRef.current);
      }
    }, [canvasRef.current]);

    useEffect(() => {
      if (navigator.gpu && !adapter) {
        initAdapter();
      }

      if (adapter) {
        initDevice();
      }
    }, [navigator.gpu, adapter]);

    const value = {
      adapter,
      device,
      canvas,
      context,
      canvasFormat,
      commandEncoder,
      renderPassEncoder,
    };

    return navigator ? (
      <section className="wrapper canvas-wrapper">
        <CanvasContext.Provider value={value}>
          {children}
        </CanvasContext.Provider>
        <canvas ref={combinedRef} className="canvas"></canvas>
      </section>
    ) : (
      <section className="wrapper loading-wrapper">Loading...</section>
    );
  },
);

CanvasProvider.displayName = 'CanvasProvider';
export default CanvasProvider;

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  return context;
};
