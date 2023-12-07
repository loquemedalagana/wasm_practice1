import pages from '@/samples/2d/pages/2dPages';

function Page({ params }: { params: { slug: string } }) {
  const PageComponent = pages[params.slug];
  return (
    <>
      <div>Current sample: {params.slug}</div>
      <PageComponent />
    </>
  );
}

export default Page;
