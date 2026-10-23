import * as React from 'react';
import type { ReactNode } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/theme.css';

interface LayoutParameter {
  children?: ReactNode;
  useFluidContainer?: boolean;
}

const Layout: React.FC<LayoutParameter> = ({
  children,
  useFluidContainer = false,
}) => {
  const footerContent = (
    <>
      <hr />
      <footer className="py-4">© {new Date().getFullYear()} shin4488</footer>
    </>
  );

  return (
    <div>
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
