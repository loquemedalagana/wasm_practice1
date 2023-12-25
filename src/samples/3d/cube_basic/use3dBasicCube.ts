import { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Vec4 } from 'wgpu-matrix';

import { GPUDeviceInfo } from '@/util/types/wgpu';
import WGPUBufferGroup from '@/util/classes/WGPUBufferGroup';
import { convertColorIntoVec4 } from '@/util/math/color';

import CubeMesh from '@/mashes/3d/Cube';

// @ts-ignore
import vertexShader from '@/shaders/3d/vertices/cube.vert.wgsl';

// @ts-ignore
import fragmentShader from '@/shaders/3d/fragments/vertexPositionColor.frag.wgsl';

const use3dBasicCube = (
  canvasInfo: GPUDeviceInfo,
  modelViewProjectionMatrix: Vec4,
) => {
  const { device, context, textureFormat, canvas } = canvasInfo;
  const [wireFrameActive, setWireFrameActive] = useState(false);

  const handleWireFrame: ChangeEventHandler<HTMLInputElement> = (e) => {
    setWireFrameActive(e.currentTarget.checked);
  };

  const cubeMesh = new CubeMesh();

  const draw = useCallback(
    (
      device: GPUDevice,
      verticesBuffer: WGPUBufferGroup,
      pipeline: GPURenderPipeline,
    ) => {
      // constant buffer in direct X
      const uniformBuffer = device.createBuffer({
        size: (modelViewProjectionMatrix as Float32Array).byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const bindGroup = device.createBindGroup({
        label: 'Cube renderer bind group',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: {
              buffer: uniformBuffer,
              offset: 0,
              size: (modelViewProjectionMatrix as Float32Array).byteLength,
            },
          },
        ],
      });

      const depthTexture = device.createTexture({
        size: [canvas.width, canvas.height, 1],
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });

      device.queue.writeBuffer(
        uniformBuffer,
        0,
        modelViewProjectionMatrix as ArrayBuffer,
      );

      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),
            loadOp: 'clear',
            storeOp: 'store',
            clearValue: convertColorIntoVec4(33, 53, 85),
          },
        ] as Iterable<GPURenderPassColorAttachment | null>,
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1.0,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
        },
      };

      const commandEncoder = device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

      passEncoder.setPipeline(pipeline);
      passEncoder.setVertexBuffer(0, verticesBuffer.buffers[0]);
      passEncoder.setIndexBuffer(verticesBuffer.buffers[1], 'uint32');
      passEncoder.setBindGroup(0, bindGroup);
      passEncoder.drawIndexed(cubeMesh.indices.length);
      passEncoder.end();
      device.queue.submit([commandEncoder.finish()]);
    },
    [modelViewProjectionMatrix],
  );

  useEffect(() => {
    if (!device) {
      return;
    }

    const verticesBuffer = new WGPUBufferGroup(device, [
      {
        label: 'vertex',
        size: cubeMesh.vertices.byteLength,
        mappedAtCreation: true,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        data: cubeMesh.vertices,
      },
      {
        label: 'index',
        size: cubeMesh.indices.byteLength,
        mappedAtCreation: true,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        indices: cubeMesh.indices,
      },
    ]);

    const pipeline = device.createRenderPipeline({
      primitive: {
        topology: wireFrameActive ? 'line-list' : 'triangle-list',
        cullMode: 'back',
      },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
      layout: 'auto',
      vertex: {
        module: device.createShaderModule({
          code: vertexShader,
        }),
        entryPoint: 'main',
        buffers: [
          {
            arrayStride: 24,
            attributes: [
              {
                format: 'float32x3',
                offset: 0,
                shaderLocation: 0,
              },
              {
                format: 'float32x3',
                offset: 12,
                shaderLocation: 1,
              },
            ] as Iterable<GPUVertexAttribute>,
          },
        ],
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

    draw(device, verticesBuffer, pipeline);
  }, [wireFrameActive, modelViewProjectionMatrix]);

  return {
    wireFrameActive,
    handleWireFrame,
  };
};

export default use3dBasicCube;
