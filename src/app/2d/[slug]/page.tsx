import { PathParams, Props, PageComponentType } from '@/util/UI/pageTypes';
import dynamic from 'next/dynamic';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const pages: PageComponentType = {
  circle: dynamic(() => import('@/samples/2d/circle/2DCircle'), {
    loading: () => (
      <section className="wrapper loading-wrapper">
        <LoadingSpinner />
      </section>
    ),
  }),
};

export default function Page({ params }: { params: { slug: string } }) {
  const PageComponent = pages[params.slug];
  return (
    <>
      <div>Current sample: {params.slug}</div>
      <PageComponent />
    </>
  );
}
