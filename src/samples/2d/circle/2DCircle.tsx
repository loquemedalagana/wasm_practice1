'use client';
import CanvasInfo from '@/components/CanvasInfo';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// @ts-ignore
import circleVertexShader from '@/shaders/vertices/circle.vert.wgsl';
// @ts-ignore
import simpleColorVertexShader from '@/shaders/fragments/simpleColor.frag.wgsl';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});
const _2DCircle = () => {
  const partialConfiguration: Partial<GPUCanvasConfiguration> = {
    alphaMode: 'premultiplied',
  };

  const partialDescriptor: Partial<GPURenderPipelineDescriptor> = {
    primitive: {
      topology: 'point-list',
    },
  };

  // Create a buffer with circle vertices
  const vertexCount = 360; // Number of vertices to approximate the circle
  const vertices = new Float32Array(vertexCount * 2); // 2D position (x, y)

  for (let i = 0; i < vertexCount; i++) {
    const angle = (i / vertexCount) * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    vertices[i * 2] = x;
    vertices[i * 2 + 1] = y;
  }

  const bufferDescriptor: Pick<
    GPUBufferDescriptor,
    'size' | 'mappedAtCreation'
  > = {
    size: vertices.byteLength,
    mappedAtCreation: true,
  };

  return (
    <CanvasProvider
      vertexCount={vertexCount}
      partialConfiguration={partialConfiguration}
      partialRenderPipelineDescriptor={partialDescriptor}
      vertexShader={circleVertexShader}
      fragmentShader={simpleColorVertexShader}
      partialBufferDescriptor={bufferDescriptor}
      vertexArray={vertices}
    >
      <CanvasInfo />
    </CanvasProvider>
  );
};

export default _2DCircle;
