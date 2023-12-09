import { PageComponentType } from '@/util/UI/pageTypes';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const pages: PageComponentType = {
  triangle: dynamic(() => import('@/samples/2d/triangle/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  circle: dynamic(() => import('@/samples/2d/circle/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  rectangle: dynamic(() => import('@/samples/2d/rectangle/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  grid: dynamic(() => import('@/samples/2d/grid/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  'grid-state': dynamic(() => import('@/samples/2d/grid_state/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
};

export default pages;
