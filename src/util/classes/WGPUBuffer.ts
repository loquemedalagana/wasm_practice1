class WGPUBuffer {
  buffers: GPUBuffer[];
  constructor(
    device: GPUDevice,
    bufferDescriptors: Array<
      GPUBufferDescriptor & { data?: Float32Array; indices?: Uint32Array }
    >,
  ) {
    this.buffers = bufferDescriptors.map((bufferDescriptor) => {
      const buffer = device.createBuffer(bufferDescriptor);
      if (bufferDescriptor.data) {
        new Float32Array(buffer.getMappedRange()).set(bufferDescriptor.data);
        buffer.unmap();
      } else if (bufferDescriptor.indices) {
        new Uint32Array(buffer.getMappedRange()).set(bufferDescriptor.indices);
        buffer.unmap();
      }
      return buffer;
    });
  }
}

export default WGPUBuffer;
