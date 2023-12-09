import { useEffect } from 'react';
import { GPUDeviceInfo } from '@/util/types/wgpu';

// @ts-ignore
import vertexShader from '@/samples/2d/grid/vertex.wgsl';
// @ts-ignore
import fragmentShader from '@/shaders/fragments/simpleColor.frag.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';
import { PartialGPUBufferDescriptor } from '@/util/types/wgpu';

import { rectVertexArray } from '@/mashes/2dSquare';

const GRID_SIZE = 4;

const use2dGrid = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const partialRenderPipelineDescriptor: Partial<GPURenderPipelineDescriptor> =
    {
      primitive: {
        topology: 'triangle-list',
      },
    };

  const vertexBufferDescriptor: PartialGPUBufferDescriptor = {
    label: 'Rectangle',
    size: rectVertexArray.byteLength,
    mappedAtCreation: true,
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

  const vertexBufferInfo = {
    bufferDescriptor: vertexBufferDescriptor,
    array: rectVertexArray,
  };

  // a uniform buffer that describes the grid
  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);

  const partialUniformBufferDescriptor: PartialGPUBufferDescriptor = {
    label: 'Grid Uniforms',
    size: uniformArray.byteLength,
  };

  const uniformBufferInfo = {
    array: uniformArray,
    bufferDescriptor: partialUniformBufferDescriptor,
  };

  useEffect(() => {
    if (!device) {
      return;
    }
    const commandEncoder = device.createCommandEncoder();

    const pipeline = device.createRenderPipeline({
      ...partialRenderPipelineDescriptor,
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

    const uniformBuffer = device.createBuffer({
      ...uniformBufferInfo.bufferDescriptor,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(uniformBuffer, 0, uniformBufferInfo.array);

    const vertexBuffer = device.createBuffer({
      ...vertexBufferInfo.bufferDescriptor,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

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

    new Float32Array(vertexBuffer.getMappedRange()).set(vertexBufferInfo.array);
    vertexBuffer.unmap();
    device.queue.writeBuffer(vertexBuffer, 0, vertexBufferInfo.array);

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
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.setBindGroup(0, bindGroup);

    passEncoder.draw(rectVertexArray.length / 2, GRID_SIZE * GRID_SIZE);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dGrid;
