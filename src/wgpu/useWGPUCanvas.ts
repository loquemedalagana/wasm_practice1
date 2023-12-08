'use client';
import { createContext, useContext } from 'react';

export const WebGPUCanvasContext = createContext<HTMLCanvasElement | null>(
  null,
);

export const useWebGPUCanvas = (): HTMLCanvasElement => {
  const canvas = useContext(WebGPUCanvasContext);

  if (!canvas) {
    throw new Error(
      'useWebGPUCanvas can only be used inside a WebGPUCanvas component',
    );
  }

  return canvas;
};
