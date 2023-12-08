'use client';
import { createContext, useContext } from 'react';

export const TextureFormatContext = createContext<GPUTextureFormat | null>(null);

export const useTextureFormat = (): GPUTextureFormat => {
  const format = useContext(TextureFormatContext);

  if (!format) {
    throw new Error(
      'usePresentationFormat can only be used inside a WebGPUCanvas component',
    );
  }

  return format;
};
