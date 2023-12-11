import pages from '@/samples/3d/pages/3dPages';

function Page({ params }: { params: { slug: string } }) {
  const PageComponent = pages[params.slug];
  return (
    <>
      <div>Current sample: {params.slug}</div>
      <PageComponent />
    </>
  );
}

export const generateStaticParams = async () => {
  return Object.keys(pages).map((p) => {
    return { slug: p };
  });
};

export default Page;
