import Link from 'next/link';
import _3dPages from '@/samples/3d/pages/3dPages';

const _3DLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <nav className="sub-nav">
        <ul>
          {Object.keys(_3dPages).map((pageName) => {
            return (
              <li key={`page-element-${pageName}`}>
                <Link href={`/3d/${pageName}`} className="nav-item">
                  {pageName}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <section className="flex flex-col items-center">{children}</section>
    </>
  );
};

export default _3DLayout;
