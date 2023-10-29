import CanvasProvider from "@/wgpu/CanvasContext";

export default function Home() {

  return (
    <CanvasProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Joder Macho</h1>
      </main>
    </CanvasProvider>
  );
}
