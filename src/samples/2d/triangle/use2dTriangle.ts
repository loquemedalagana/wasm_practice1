import { useEffect } from 'react';
import { GPUDeviceInfo } from '@/util/types/wgpu';

// @ts-ignore
import vertexShader from '@/shaders/2d/vertices/triangle.vert.wgsl';
// @ts-ignore
import fragmentShader from '@/shaders/2d/fragments/simpleColor.frag.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';

const use2dTriangle = (canvasInfo: GPUDeviceInfo) => {
  const { device, context, textureFormat } = canvasInfo;

  const partialRenderPipelineDescriptor: Partial<GPURenderPipelineDescriptor> =
    {
      primitive: {
        topology: 'triangle-list',
      },
    };

  useEffect(() => {
    if (!device) {
      return;
    }
    const pipeline = device.createRenderPipeline({
      ...partialRenderPipelineDescriptor,
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
          clearValue: convertColorIntoVec4(249, 243, 204),
        },
      ] as Iterable<GPURenderPassColorAttachment | null>,
    });

    passEncoder.setPipeline(pipeline);
    passEncoder.draw(3);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }, []);
};

export default use2dTriangle;
