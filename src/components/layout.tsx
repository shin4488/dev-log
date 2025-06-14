import * as React from 'react';
import { ReactNode } from 'react';
import { WindowLocation } from '@reach/router';
import { Container } from 'react-bootstrap';
import Bio from '@/components/bio';
import Navigation from '@/components/navigation';
import '@/style.scss';

interface LayoutParameter {
  location: WindowLocation;
  children?: ReactNode;
  useFluidContainer?: boolean;
}

const Layout: React.FC<LayoutParameter> = ({
  location,
  children,
  useFluidContainer = false,
}) => {
  // eslint-disable-next-line no-undef
  const rootPath = `${__PATH_PREFIX__}/`;
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
      <Navigation />

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
