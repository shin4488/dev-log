import * as React from 'react';
import { ReactNode } from 'react';
import { WindowLocation } from '@reach/router';
import AboutImage from '@/images/my-profile-image.png';
import { Navbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';

interface LayoutParameter {
  location: WindowLocation;
  children?: ReactNode;
}

const Layout: React.FC<LayoutParameter> = ({ location, children }) => {
  // eslint-disable-next-line no-undef
  const rootPath = `${__PATH_PREFIX__}/`;
  const isRootPath = location.pathname === rootPath;
  const expandWidth = 'md';

  return (
    // <div className="global-wrapper" data-is-root-path={isRootPath}>
    <div data-is-root-path={isRootPath}>
      <Navbar
        key={expandWidth}
        bg="light"
        expand={expandWidth}
        className="mb-3"
      >
        <Container>
          <Navbar.Brand href="/">
            <Image
              alt="Shin"
              src={AboutImage}
              width={50}
              height={50}
              roundedCircle
            />
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-${expandWidth}`}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expandWidth}`}
            placement="end"
          >
            <Offcanvas.Header className="justify-content-end" closeButton />
            <Offcanvas.Body className="justify-content-end">
              <Nav activeKey="/">
                <Nav.Item>
                  <Nav.Link href="/">Blog</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/my-second-post">Tags</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="/hello-world">About</Nav.Link>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <main>{children}</main>
      <footer>© {new Date().getFullYear()} shin4488</footer>
    </div>
  );
};

export default Layout;
