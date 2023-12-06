'use client';
import CanvasInfo from '@/components/CanvasInfo';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// @ts-ignore
import triangleVertexShader from '@/shaders/vertices/triangle.vert.wgsl';
// @ts-ignore
import simpleColorVertexShader from '@/shaders/fragments/simpleColor.frag.wgsl';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});
const _2DTriangle = () => {
  const partialConfiguration: Partial<GPUCanvasConfiguration> = {
    alphaMode: 'premultiplied',
  };

  const partialDescriptor: Partial<GPURenderPipelineDescriptor> = {
    primitive: {
      topology: 'triangle-list',
    },
  };

  return (
    <CanvasProvider
      vertexCount={3}
      partialConfiguration={partialConfiguration}
      partialRenderPipelineDescriptor={partialDescriptor}
      vertexShader={triangleVertexShader}
      fragmentShader={simpleColorVertexShader}
    >
      <CanvasInfo />
    </CanvasProvider>
  );
};

export default _2DTriangle;
