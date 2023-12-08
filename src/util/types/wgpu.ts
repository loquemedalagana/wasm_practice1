export type PartialGPUBufferDescriptor = Pick<
  GPUBufferDescriptor,
  'size' | 'mappedAtCreation' | 'label'
>;

export type GPUDeviceInfo = {
  device: GPUDevice | null;
  context: GPUCanvasContext;
  textureFormat: GPUTextureFormat;
};
