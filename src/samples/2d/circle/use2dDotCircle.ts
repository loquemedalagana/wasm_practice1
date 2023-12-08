import { useEffect } from 'react';
import { GPUDeviceInfo, PartialGPUBufferDescriptor } from '@/util/types/wgpu';

import { create2dDotCircleMesh, VERTEX_COUNT } from '@/mashes/2dDotCircle';
import { rectVertexArray } from '@/mashes/2dRectangle';

// @ts-ignore
import vertexShader from '@/shaders/vertices/circle.vert.wgsl';
// @ts-ignore
import fragmentShader from '@/shaders/fragments/simpleColor.frag.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';

const use2dDotCircle = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const { vertices } = create2dDotCircleMesh(VERTEX_COUNT);

  const vertexBufferDescriptor: PartialGPUBufferDescriptor = {
    label: 'Circle',
    size: vertices.byteLength,
    mappedAtCreation: true,
  };

  const vertexBufferInfo = {
    bufferDescriptor: vertexBufferDescriptor,
    array: rectVertexArray,
  };

  useEffect(() => {
    if (!device) {
      return;
    }

    const commandEncoder = device.createCommandEncoder();

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
          clearValue: convertColorIntoVec4(49, 48, 77),
        },
      ] as Iterable<GPURenderPassColorAttachment | null>,
    });

    const pipeline = device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: vertexShader,
        }),
        entryPoint: 'main',
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

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer);

    passEncoder.draw(VERTEX_COUNT * 2);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dDotCircle;
