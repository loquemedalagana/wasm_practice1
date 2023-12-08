import { PageComponentType } from '@/util/UI/pageTypes';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const pages: PageComponentType = {
  triangle: dynamic(() => import('@/samples/2d/triangle/2DTriangle'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  circle: dynamic(() => import('@/samples/2d/circle/2DCircle'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  rectangle: dynamic(() => import('@/samples/2d/rectangle/2DRectangle'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  grid: dynamic(() => import('@/samples/2d/grid/_2DGrid'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
};

export default pages;
