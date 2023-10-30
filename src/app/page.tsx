import CanvasProvider from '@/wgpu/CanvasContext';
import SingleColor from "@/samples/2d/SingleColor/SingleColor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CanvasProvider>
        <h1>Home</h1>
        <SingleColor />
      </CanvasProvider>
    </main>
  );
}
