class WGPUBuffer {
  buffers: GPUBuffer[];
  constructor(
    device: GPUDevice,
    bufferDescriptors: Array<GPUBufferDescriptor & { data?: Float32Array }>,
  ) {
    this.buffers = bufferDescriptors.map((bufferDescriptor) => {
      const buffer = device.createBuffer(bufferDescriptor);
      if (bufferDescriptor.data) {
        new Float32Array(buffer.getMappedRange()).set(bufferDescriptor.data);
        buffer.unmap();
      }
      return buffer;
    });
  }
}

export default WGPUBuffer;
