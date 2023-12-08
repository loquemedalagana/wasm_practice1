import { useEffect } from 'react';
import { GPUDeviceInfo, PartialGPUBufferDescriptor } from '@/util/types/wgpu';

// @ts-ignore
import vertexShader from '@/samples/2d/rectangle/vertex.wgsl';
// @ts-ignore
import fragmentShader from '@/shaders/fragments/simpleColor.frag.wgsl';

import { rectVertexArray } from '@/mashes/2dRectangle';
import { convertColorIntoVec4 } from '@/util/math/color';

const use2dRectangle = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const vertexBufferDescriptor: PartialGPUBufferDescriptor = {
    label: 'Rectangle',
    size: rectVertexArray.byteLength,
    mappedAtCreation: true,
  };

  const vertexBufferInfo = {
    bufferDescriptor: vertexBufferDescriptor,
    array: rectVertexArray,
  };

  const partialRenderPipelineDescriptor: Partial<GPURenderPipelineDescriptor> =
    {
      primitive: {
        topology: 'triangle-list',
      },
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

    const vertexBuffer = device.createBuffer({
      ...vertexBufferInfo.bufferDescriptor,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
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
          clearValue: convertColorIntoVec4(208, 162, 247),
        },
      ] as Iterable<GPURenderPassColorAttachment | null>,
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);

    passEncoder.draw(rectVertexArray.length / 2);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dRectangle;
