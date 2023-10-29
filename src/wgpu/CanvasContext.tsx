'use client';
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  context: GPUCanvasContext | null;
  canvasFormat: GPUTextureFormat | null;
  encoder: GPUCommandEncoder | null;
  pass: GPURenderPassEncoder | null;
}

export const CanvasContext = createContext<ICanvasContext | null>(null);

export const CanvasProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [adapter, setAdapter] = useState<GPUAdapter | null>(null);
  const [device, setDevice] = useState<GPUDevice | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<GPUCanvasContext | null>(null);
  const [canvasFormat, setCanvasFormat] = useState<GPUTextureFormat | null>(
    null,
  );
  const [encoder, setEncoder] = useState<GPUCommandEncoder | null>(null);
  const [pass, setPass] = useState<GPURenderPassEncoder | null>(null);

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
    setEncoder(newEncoder);
  }, [adapter, canvas]);

  useEffect(() => {
    if (encoder && context && device) {
      console.log(encoder);
      const newPass = encoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: { r: 1, g: 0, b: 0, a: 1 }, // New line
            storeOp: 'store',
          },
        ],
      });
      newPass.end();
      setPass(newPass);

      device.queue.submit([encoder.finish()]);
    }
  }, [encoder]);

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
    encoder,
    pass,
  };

  return navigator ? (
    <>
      <canvas ref={canvasRef}></canvas>
      <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
    </>
  ) : (
    <>Loading...</>
  );
};

export default CanvasProvider;

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  return context;
};
