export type PartialGPUBufferDescriptor = Pick<
  GPUBufferDescriptor,
  'size' | 'mappedAtCreation' | 'label'
>;
