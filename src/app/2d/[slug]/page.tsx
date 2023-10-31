import dynamic from 'next/dynamic';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import pages from '@/samples/2d/pages/2dPages';

const CanvasProvider = dynamic(() => import('@/wgpu/CanvasContext'), {
  loading: () => (
    <section className="wrapper loading-wrapper">
      <LoadingSpinner />
    </section>
  ),
});

function Page({ params }: { params: { slug: string } }) {
  const PageComponent = pages[params.slug];
  return (
    <CanvasProvider>
      <div>Current sample: {params.slug}</div>
      <PageComponent />
    </CanvasProvider>
  );
}

export default Page;
