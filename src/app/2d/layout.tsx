import Link from 'next/link';
import _2dPages from '@/samples/2d/pages/2dPages';

const _2DLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section>
      <nav className="sub-nav">
        <ul>
          {Object.keys(_2dPages).map((pageName) => {
            return (
              <li key={`page-element-${pageName}`}>
                <Link href={`/2d/${pageName}`} className="nav-item">
                  {pageName}
                </Link>
              </li>
            );
          })}
          {/*
          <li>
            <Link href="/2d/texture" className="nav-item">
              texture
            </Link>
          </li>
          */}
        </ul>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {children}
      </main>
    </section>
  );
};

export default _2DLayout;
