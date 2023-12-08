'use client';
import { createContext, useContext } from 'react';

export const WebGPUContext = createContext<GPUCanvasContext | null>(null);

export const useWebGPUContext = (): GPUCanvasContext => {
  const context = useContext(WebGPUContext);

  if (!context) {
    throw new Error(
      'useWebGPUContext can only be used inside a WebGPUCanvas component',
    );
  }

  return context;
};
