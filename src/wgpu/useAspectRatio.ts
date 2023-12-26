'use client';
import { createContext, useContext } from 'react';

type AspectRatio = {
  aspectRatio: number;
};
export const AspectRatioContext = createContext<AspectRatio>({
  aspectRatio: 1,
});

export const useAspectRatio = (): AspectRatio => {
  const context = useContext(AspectRatioContext);
  return context;
};
