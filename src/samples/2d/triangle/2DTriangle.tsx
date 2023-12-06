'use client';
import CanvasInfo from '@/components/CanvasInfo';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});
const _2DTriangle = () => {
  return (
    <CanvasProvider vertexCount={3}>
      <CanvasInfo />
    </CanvasProvider>
  );
};

export default _2DTriangle;
