'use client';
import { createContext, useContext } from 'react';

export const GPUDeviceContext = createContext<GPUDevice | null>(null);

export const useGPUDevice = (): GPUDevice | null => {
  const context = useContext(GPUDeviceContext);

  if (typeof window === 'undefined') {
    return null;
  }

  return context;
};
