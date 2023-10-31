import SingleColor from '@/samples/2d/SingleColor/SingleColor';
import { convertColorIntoFloat } from '@/util/math/color';
import dynamic from 'next/dynamic';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});

export default function Home() {
  return (
    <CanvasProvider>
      <h1>Please select 2d samples from sub navigation bar</h1>
      <SingleColor backgroundColor={convertColorIntoFloat(252, 245, 237)} />
    </CanvasProvider>
  );
}
