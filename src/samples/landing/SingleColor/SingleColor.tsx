'use client';
import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import { RGB, RGBA } from '@/util/math/color';

interface Props {
  backgroundColor: RGB | RGBA;
}

const SingleColor: React.FC<Props> = ({ backgroundColor }) => {
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
            clearValue: backgroundColor, // New line
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
