import { useEffect } from 'react';
import { GPUDeviceInfo } from '@/util/types/wgpu';

// @ts-ignore
import vertexShader from '@/samples/2d/grid_state/vertex.wgsl';
// @ts-ignore
import fragmentShader from '@/samples/2d/grid_state/fragment.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';

import { rectVertexArray } from '@/mashes/2dSquare';
import WGPUBuffer from '@/util/classes/WGPUBuffer';

const GRID_SIZE = 32;

const use2dGridState = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const cellStateArray = new Uint32Array(GRID_SIZE * GRID_SIZE);
  // a uniform buffer that describes the grid
  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);

  const vertexBufferLayout: GPUVertexBufferLayout = {
    arrayStride: 8,
    attributes: [
      {
        format: 'float32x2',
        offset: 0,
        shaderLocation: 0, // Position, see vertex shader
      },
    ] as Iterable<GPUVertexAttribute>,
  };

  useEffect(() => {
    if (!device) {
      return;
    }
    const commandEncoder = device.createCommandEncoder();

    const pipeline = device.createRenderPipeline({
      primitive: {
        topology: 'triangle-list',
      },
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: vertexShader,
        }),
        entryPoint: 'main',
        buffers: vertexBufferLayout ? [vertexBufferLayout] : undefined,
      },
      fragment: {
        module: device.createShaderModule({
          code: fragmentShader,
        }),
        entryPoint: 'main',
        targets: [
          {
            format: textureFormat,
          },
        ],
      },
    });

    const cellStateBuffer = new WGPUBuffer(device, [
      {
        label: 'Cell State',
        size: cellStateArray.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      },
    ]);

    for (let i = 0; i < cellStateArray.length; i += 3) {
      cellStateArray[i] = 1;
    }

    device.queue.writeBuffer(cellStateBuffer.buffers[0], 0, cellStateArray);

    // uniform buffer
    const uniformBuffer = new WGPUBuffer(device, [
      {
        label: 'Uniform Buffer',
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        size: uniformArray.byteLength,
      },
    ]);

    device.queue.writeBuffer(uniformBuffer.buffers[0], 0, uniformArray);

    // vertex buffer
    const vertexBuffer = new WGPUBuffer(device, [
      {
        label: 'Rectangle',
        size: rectVertexArray.byteLength,
        mappedAtCreation: true,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      },
    ]);

    const bindGroup = device.createBindGroup({
      label: 'Cell renderer bind group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: uniformBuffer.buffers[0] },
        },
        {
          binding: 1,
          resource: { buffer: cellStateBuffer.buffers[0] },
        },
      ],
    });

    new Float32Array(vertexBuffer.buffers[0].getMappedRange()).set(
      rectVertexArray,
    );
    vertexBuffer.buffers[0].unmap();
    device.queue.writeBuffer(vertexBuffer.buffers[0], 0, rectVertexArray);

    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: convertColorIntoVec4(182, 187, 196),
        },
      ] as Iterable<GPURenderPassColorAttachment | null>,
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer.buffers[0]);
    passEncoder.setBindGroup(0, bindGroup);

    passEncoder.draw(rectVertexArray.length / 2, GRID_SIZE * GRID_SIZE);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dGridState;
