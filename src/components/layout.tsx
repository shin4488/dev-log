import * as React from 'react';
import type { ReactNode } from 'react';
import { basePath } from '@/lib/site';
import { Container } from 'react-bootstrap';
import Bio from '@/components/bio';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/theme.css';

interface LayoutParameter {
  location: { pathname: string };
  children?: ReactNode;
  useFluidContainer?: boolean;
}

const Layout: React.FC<LayoutParameter> = ({
  location,
  children,
  useFluidContainer = false,
}) => {
  const rootPath = `${basePath}/`;
  const isRootPath = location.pathname === rootPath;

  const footerContent = (
    <>
      <hr />
      <footer>
        <Bio /> © {new Date().getFullYear()} shin4488
      </footer>
    </>
  );

  return (
    // <div className="global-wrapper" data-is-root-path={isRootPath}>
    <div data-is-root-path={isRootPath}>
      {useFluidContainer ? (
        <>
          <main>{children}</main>
          <Container>{footerContent}</Container>
        </>
      ) : (
        <Container>
          <main>{children}</main>
          {footerContent}
        </Container>
      )}
    </div>
  );
};

export default Layout;
