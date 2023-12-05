'use client';
import { useEffect } from 'react';
import { useCanvasContext } from '@/wgpu/CanvasContext';
import { convertColorIntoVec4 } from '@/util/math/color';
import CanvasInfo from "@/components/CanvasInfo";

const _2DTriangle = () => {
  const {
    commandEncoder,
    context,
    device,
    canvasFormat,
    setRenderPassEncoder,
  } = useCanvasContext();

  useEffect(() => {
    if (commandEncoder && context && device && canvasFormat) {
      console.log(context, commandEncoder);
      const vertices = new Float32Array([
        //   X,    Y,
        -0.8,
        -0.8, // Triangle 1 (color 1)
        0.8,
        -0.8,
        0.8,
        0.8,

        -0.8,
        -0.8, // Triangle 2 (color 2)
        0.8,
        0.8,
        -0.8,
        0.8,
      ]);
      console.log(vertices);

      const vertexBuffer = device.createBuffer({
        label: 'Cell vertices',
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });

      console.log(vertexBuffer);
      device.queue.writeBuffer(vertexBuffer, /*bufferOffset=*/ 0, vertices);

      const vertexBufferLayout: GPUVertexBufferLayout = {
        arrayStride: 8,
        // @ts-ignore
        attributes: [
          {
            format: 'float32x2',
            offset: 0,
            shaderLocation: 0, // Position, see vertex shader
          },
        ],
      };

      const cellShaderModule = device.createShaderModule({
        label: 'Cell shader',
        code: `
          @vertex
          fn vertexMain() -> @builtin(position) vec4f {
            return vec4f(0, 0, 0, 1); // (X, Y, Z, W)
          }
          
          @fragment
          fn fragmentMain() -> @location(0) vec4f {
            return vec4f(1, 0, 0, 1);
          }
        `,
      });

      const cellPipeline = device.createRenderPipeline({
        label: 'Cell pipeline',
        layout: 'auto',
        vertex: {
          module: cellShaderModule,
          entryPoint: 'vertexMain',
          buffers: [vertexBufferLayout],
        },
        fragment: {
          module: cellShaderModule,
          entryPoint: 'fragmentMain',
          targets: [
            {
              format: canvasFormat,
            },
          ],
        },
      });

      const newPass = commandEncoder.beginRenderPass({
        // @ts-ignore
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            clearValue: convertColorIntoVec4(255, 223, 223), // New line
            storeOp: 'store',
          },
        ],
      });

      newPass.setPipeline(cellPipeline);
      newPass.setVertexBuffer(0, vertexBuffer);
      newPass.draw(vertices.length / 2); // 6 vertices

      newPass.end();
      setRenderPassEncoder(newPass);

      device.queue.submit([commandEncoder.finish()]);
    }
  }, [commandEncoder]);

  return <CanvasInfo />;
};

export default _2DTriangle;
