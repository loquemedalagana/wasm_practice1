import CanvasProvider from '@/wgpu/CanvasContext';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CanvasProvider>
        <h1>Home</h1>
      </CanvasProvider>
    </main>
  );
}
