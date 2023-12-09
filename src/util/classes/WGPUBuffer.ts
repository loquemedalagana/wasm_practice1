class WGPUBuffer {
  buffers: GPUBuffer[];
  constructor(device: GPUDevice, bufferDescriptors: GPUBufferDescriptor[]) {
    this.buffers = bufferDescriptors.map((bufferDescriptor) =>
      device.createBuffer(bufferDescriptor),
    );
  }
}

export default WGPUBuffer;
