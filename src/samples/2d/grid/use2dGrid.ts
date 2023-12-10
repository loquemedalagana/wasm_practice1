import { ChangeEventHandler, useEffect, useState } from 'react';
import { GPUDeviceInfo } from '@/util/types/wgpu';

// @ts-ignore
import vertexShader from '@/samples/2d/grid/vertex.wgsl';
// @ts-ignore
import fragmentShader from '@/samples/2d/grid/fragment.wgsl';

import WGPUBuffer from '@/util/classes/WGPUBuffer';
import { convertColorIntoVec4 } from '@/util/math/color';

import { rectVertexArray } from '@/mashes/2d/2dSquare';
export const MIN__GRID_SIZE = 4;
export const MAX__GRID_SIZE = 64;

const use2dGrid = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;
  const [gridCount, setGridCount] = useState(16);

  const handleGridCountInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = parseInt(e.target.value);
    const mod = newValue % 4;
    setGridCount(newValue - mod);
  };

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

  // a uniform buffer that describes the grid

  useEffect(() => {
    if (!device) {
      return;
    }

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

    const uniformArray = new Float32Array([gridCount, gridCount]);

    const uniformBuffer = device.createBuffer({
      label: 'Grid Uniforms',
      size: uniformArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(uniformBuffer, 0, uniformArray);

    const vertexBuffer = new WGPUBuffer(device, [
      {
        label: 'Rectangle',
        size: rectVertexArray.byteLength,
        mappedAtCreation: true,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        data: rectVertexArray,
      },
    ]);

    const bindGroup = device.createBindGroup({
      label: 'Cell renderer bind group',
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: uniformBuffer },
        },
      ],
    });

    device.queue.writeBuffer(vertexBuffer.buffers[0], 0, rectVertexArray);

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: 'clear',
          storeOp: 'store',
          clearValue: convertColorIntoVec4(248, 189, 235),
        },
      ] as Iterable<GPURenderPassColorAttachment | null>,
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer.buffers[0]);
    passEncoder.setBindGroup(0, bindGroup);

    passEncoder.draw(rectVertexArray.length / 2, gridCount * gridCount);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, [gridCount]);

  return {
    gridCount,
    handleGridCountInput,
  };
};

export default use2dGrid;
