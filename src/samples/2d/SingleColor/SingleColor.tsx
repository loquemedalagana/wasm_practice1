'use client';
import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import { convertColorIntoFloat } from '@/util/math/color';

const SingleColor = () => {
  const { commandEncoder, context, device, setRenderPassEncoder } =
    useCanvasContext();

  useEffect(() => {
    if (commandEncoder && context && device) {
      const newPass = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: convertColorIntoFloat(100, 153, 233), // New line
            storeOp: 'store',
          },
        ],
      });
      newPass.end();
      setRenderPassEncoder(newPass);

      device.queue.submit([commandEncoder.finish()]);
    }
  }, [commandEncoder]);

  return <h2>Single Color</h2>;
};

export default SingleColor;
