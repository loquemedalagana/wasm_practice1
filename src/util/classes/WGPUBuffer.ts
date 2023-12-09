class WGPUBuffer {
  buffer: GPUBuffer;
  constructor(device: GPUDevice, bufferDescriptor: GPUBufferDescriptor) {
    this.buffer = device.createBuffer(bufferDescriptor);
  }

}

export default WGPUBuffer;
