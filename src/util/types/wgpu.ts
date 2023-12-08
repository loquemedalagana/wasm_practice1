export type PartialGPUBufferDescriptor = Pick<
  GPUBufferDescriptor,
  'size' | 'mappedAtCreation' | 'label'
>;

export type GPUDeviceInfo = {
  device: GPUDevice | null;
  canvas: HTMLCanvasElement;
  context: GPUCanvasContext;
  textureFormat: GPUTextureFormat;
};
