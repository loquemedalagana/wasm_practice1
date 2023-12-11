import { PageComponentType } from '@/util/UI/pageTypes';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const pages: PageComponentType = {
  'cube-basic': dynamic(() => import('@/samples/3d/cube_basic/Main'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
  // TODO: lightning
  // TODO: cube map
  // TODO: normal vector and wire frames
  // TODO: cylinder and sphere
  // TODO: obj viewer
  // TODO: fbx viewer
  // TODO: usdz viewer
};

export default pages;
