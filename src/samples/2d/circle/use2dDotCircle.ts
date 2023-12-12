import { useEffect } from 'react';
import { GPUDeviceInfo } from '@/util/types/wgpu';

import { create2dDotCircleMesh, VERTEX_COUNT } from '@/mashes/2d/2dDotCircle';
import { rectVertexArray } from '@/mashes/2d/2dSquare';

// @ts-ignore
import vertexShader from '@/shaders/2d/vertices/circle.vert.wgsl';
// @ts-ignore
import fragmentShader from '@/shaders/2d/fragments/simpleColor.frag.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';
import WGPUBufferGroup from '@/util/classes/WGPUBufferGroup';

const use2dDotCircle = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const { vertices } = create2dDotCircleMesh(VERTEX_COUNT);

  useEffect(() => {
    if (!device) {
      return;
    }

    const vertexBuffer = new WGPUBufferGroup(
      device,
      [
        {
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          label: 'Circle',
          size: vertices.byteLength,
          mappedAtCreation: true,
          data: vertices,
        },
      ],
    );

    device.queue.writeBuffer(vertexBuffer.buffers[0], 0, rectVertexArray);

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

    const commandEncoder = device.createCommandEncoder();
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

    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, vertexBuffer.buffers[0]);

    passEncoder.draw(VERTEX_COUNT * 2);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dDotCircle;
