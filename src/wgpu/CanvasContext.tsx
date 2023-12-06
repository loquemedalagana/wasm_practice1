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

export const CanvasProvider: React.FC<PropsWithChildren> = ({ children }) => {
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
      });

      const pass = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: convertColorIntoFloat(100, 153, 233), // New line
            storeOp: 'store',
          },
        ],
      });
      pass.end();
      const commandBuffer = commandEncoder.finish();
      device.queue.submit([commandBuffer]);
      console.log(pass);
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
