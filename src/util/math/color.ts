export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type RGBA = RGB & {
  a: number;
};

export const convertColorIntoFloat = (intValue: RGB | RGBA): RGBA => {
  return {
    r: intValue.r / 255,
    g: intValue.g / 255,
    b: intValue.b / 255,
    a: 1,
  };
};
