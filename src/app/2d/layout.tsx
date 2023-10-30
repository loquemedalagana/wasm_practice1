import Link from 'next/link';
import CanvasProvider from '@/wgpu/CanvasContext';

const _2DLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section>
      <nav className="sub-nav">
        <ul>
          <li>
            <Link href="/2d/circle" className="nav-item">
              circle
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <CanvasProvider>{children}</CanvasProvider>
      </main>
    </section>
  );
};

export default _2DLayout;
