'use client';
import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import { convertColorIntoFloat } from '@/util/math/color';

const _2DCircle = () => {
  const { commandEncoder, context, device, setRenderPassEncoder } =
    useCanvasContext();

  useEffect(() => {
    if (commandEncoder && context && device) {
      console.log(context, commandEncoder)
      /*
           const newPass = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: convertColorIntoFloat(255, 223, 223), // New line
            storeOp: 'store',
          },
        ],
      });
      newPass.end();
      setRenderPassEncoder(newPass); 
      * */
      // device.queue.submit([commandEncoder.finish()]);
    }
  }, [commandEncoder]);

  return <h2>2D Circle will be here</h2>;
};

export default _2DCircle;
