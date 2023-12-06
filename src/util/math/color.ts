import { Vec4 } from 'wgpu-matrix';

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type RGBA = RGB & {
  a: number;
};

export const convertColorIntoFloat = (
  r: number,
  g: number,
  b: number,
  a?: number,
): RGBA => {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: a === undefined ? 1 : a / 255,
  };
};

export const convertColorIntoVec4 = (
  r: number,
  g: number,
  b: number,
  a?: number,
): Vec4 => {
  return [r / 255, g / 255, b / 255, a === undefined ? 1 : a / 255];
};
