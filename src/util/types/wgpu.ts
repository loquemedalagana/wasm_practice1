export type GPUDeviceInfo = {
  device: GPUDevice | null;
  context: GPUCanvasContext;

  canvas: HTMLCanvasElement;
  textureFormat: GPUTextureFormat;
};
