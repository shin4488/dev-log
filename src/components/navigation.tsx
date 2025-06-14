import * as React from 'react';
import AboutImage from '@/images/my-profile-image.png';
import { Navbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';
import { withPrefix } from 'gatsby';
import { WindowLocation } from '@reach/router';

/**
 * ナビゲーションのリンク選択肢
 */
interface NavigationItem {
  path: string;
  label: string;
}

interface NavigationProps {
  location: WindowLocation;
}

const Navigation: React.FC<NavigationProps> = ({ location }) => {
  const expandWidth = 'md';
  const imageSize = 40;
  const navigationItems: NavigationItem[] = [
    {
      path: '/about',
      label: 'About',
    },
  ];

  const isAboutPage = location.pathname === withPrefix('/about');

  return (
    <>
      <Navbar
        key={expandWidth}
        bg="nav-bar"
        variant="dark"
        expand={expandWidth}
        className="mb-3"
        sticky="top"
      >
        <Container>
          <Navbar.Brand href={withPrefix('/')}>
            <Image
              alt="Dev Log"
              src={AboutImage}
              width={imageSize}
              height={imageSize}
              roundedCircle
            />
            <span className="ms-3">Dev Log</span>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls={`offcanvasNavbar-expand-${expandWidth}`}
            style={{
              border: 'var(--bs-border-width) solid rgba(0, 0, 0, 0)',
            }}
          />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expandWidth}`}
            placement="end"
          >
            <Offcanvas.Header className="justify-content-end" closeButton />
            <Offcanvas.Body className="justify-content-end">
              <Nav>
                {navigationItems.map((item) => {
                  return (
                    <Nav.Item key={item.path}>
                      <Nav.Link href={withPrefix(item.path)}>
                        {item.label}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      {isAboutPage && (
        <header
          className="text-white text-center py-5 position-relative mb-5"
          style={{ background: 'linear-gradient(120deg, #1d976c, #2e86de)' }}
        >
          <Image
            src={AboutImage}
            width={140}
            height={140}
            roundedCircle
            className="mb-3 border border-white border-4"
            style={{ objectFit: 'cover' }}
          />
          <Nav className="justify-content-center gap-4 position-absolute bottom-0 start-50 translate-middle-x pb-2">
            <Nav.Item>
              <Nav.Link href="#sns" className="text-white">
                リンク
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#projects" className="text-white">
                個人開発
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#experience" className="text-white">
                開発経験
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </header>
      )}
    </>
  );
};

export default Navigation;
