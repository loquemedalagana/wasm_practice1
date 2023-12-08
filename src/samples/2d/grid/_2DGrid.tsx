'use client';
import CanvasInfo from '@/components/CanvasInfo';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// @ts-ignore
import vertexShader from '@/samples/2d/grid/vertex.wgsl';
// @ts-ignore
import simpleColorVertexShader from '@/shaders/fragments/simpleColor.frag.wgsl';
import { convertColorIntoVec4 } from '@/util/math/color';
import { PartialGPUBufferDescriptor } from '@/util/types/wgpu';

import { rectVertexArray } from '@/mashes/2dRectangle';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});

const GRID_SIZE = 4;

const _2DRectangle = () => {
  const partialConfiguration: Partial<GPUCanvasConfiguration> = {
    alphaMode: 'premultiplied',
  };

  const partialDescriptor: Partial<GPURenderPipelineDescriptor> = {
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

  // a uniform buffer that describes the grid
  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE]);

  const partialUniformBufferDescriptor: PartialGPUBufferDescriptor = {
    label: 'Grid Uniforms',
    size: uniformArray.byteLength,
  };

  return (
    <CanvasProvider
      partialConfiguration={partialConfiguration}
      partialRenderPipelineDescriptor={partialDescriptor}
      vertexShader={vertexShader}
      fragmentShader={simpleColorVertexShader}
      vertexBufferInfo={{
        bufferDescriptor: vertexBufferDescriptor,
        array: rectVertexArray,
      }}
      uniformBufferInfo={{
        array: uniformArray,
        bufferDescriptor: partialUniformBufferDescriptor,
      }}
      backgroundColor={convertColorIntoVec4(248, 189, 235)}
      vertexBufferLayout={vertexBufferLayout}
      vertexCount={rectVertexArray.length / 2}
    >
      <CanvasInfo />
    </CanvasProvider>
  );
};

export default _2DRectangle;
