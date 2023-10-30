import dynamic from 'next/dynamic';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import SingleColor from '@/samples/2d/SingleColor/SingleColor';
import { convertColorIntoFloat } from '@/util/math/color';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CanvasProvider>
        <h1>Home</h1>
        <SingleColor backgroundColor={convertColorIntoFloat(100, 153, 233)} />
      </CanvasProvider>
    </main>
  );
}
