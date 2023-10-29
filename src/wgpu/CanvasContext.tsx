'use client';
import {
  useState,
  createContext,
  useContext,
  useEffect,
  useRef,
  MutableRefObject,
  useCallback,
} from 'react';

export interface ICanvasContext {
  canvas: HTMLCanvasElement | null;
  adapter: GPUAdapter | null;
  device: GPUDevice | null;
  context?: GPUCanvasContext | Error | null;
  canvasFormat: GPUTextureFormat | null;
  encoder: GPUCommandEncoder | null;
  // pass: GPURenderPassEncoder;
}

export const CanvasContext = createContext<ICanvasContext | null>(null);

interface Props {
  canvasRef?: MutableRefObject<HTMLCanvasElement>;
}

export const CanvasProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [adapter, setAdapter] = useState<GPUAdapter | null>(null);
  const [device, setDevice] = useState<GPUDevice | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<
    GPUCanvasContext | undefined | null | Error
  >(null);
  const [canvasFormat, setCanvasFormat] = useState<GPUTextureFormat | null>(
    null,
  );
  const [encoder, setEncoder] = useState<GPUCommandEncoder | null>(null);

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
    }

    setDevice(newDevice);
    setContext(newContext);
    setCanvasFormat(newCanvasFormat);
    setEncoder(newEncoder);
  }, [adapter, canvas]);

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
