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
