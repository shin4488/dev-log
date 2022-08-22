import * as React from 'react';
import { ReactNode } from 'react';
import { WindowLocation } from '@reach/router';
import { Container } from 'react-bootstrap';
import Bio from '@/components/bio';
import Navigation from '@/components/navigation';

interface LayoutParameter {
  location: WindowLocation;
  children?: ReactNode;
}

const Layout: React.FC<LayoutParameter> = ({ location, children }) => {
  // eslint-disable-next-line no-undef
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;

  return (
    // <div className="global-wrapper" data-is-root-path={isRootPath}>
    <div data-is-root-path={isRootPath}>
      <Navigation />

      <Container>
        <main>{children}</main>
        <hr />
        <footer>
          <Bio /> © {new Date().getFullYear()} shin4488
        </footer>
      </Container>
    </div>
  );
};

export default Layout;
