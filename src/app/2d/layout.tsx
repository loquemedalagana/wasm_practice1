import Link from 'next/link';
import _2dPages from '@/samples/2d/pages/2dPages';

const _2DLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
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
      <section className="flex flex-col items-center">{children}</section>
    </>
  );
};

export default _2DLayout;
