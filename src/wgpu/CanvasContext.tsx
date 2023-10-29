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
  context: GPUCanvasContext | Error | null;
  // canvasFormat: GPUTextureFormat;
  // encoder: GPUCommandEncoder;
  // pass: GPURenderPassEncoder;
}

export const CanvasContext = createContext<ICanvasContext | null>(null);

interface Props {
  canvasRef?: MutableRefObject<HTMLCanvasElement>;
}

export const CanvasProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const [adapter, setAdapter] = useState<GPUAdapter | null>(null);
  const [device, setDevice] = useState<GPUDevice | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<GPUCanvasContext | null | Error>(null);

  const initAdapter = async () => {
    if (!navigator.gpu) {
      throw new Error('WebGPU not supported on this browser.');
    }
    const newAdapter = await navigator.gpu.requestAdapter();
    setAdapter(newAdapter);
  };

  const initDevice = async () => {
    if (!adapter) {
      throw new Error('No appropriate GPUAdapter found.');
    }
    console.log(adapter);
    const newDevice = await adapter.requestDevice();
    const newContext = canvas?.getContext('webgpu');
    console.log(newDevice);
    setDevice(newDevice);
  }

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
  };

  return navigator ? (
    <>
      <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
    </>
  ) : (
    <>Loading...</>
  );
};

export default CanvasProvider;
