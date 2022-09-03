import * as React from 'react';
import AboutImage from '@/images/my-profile-image.png';
import { Navbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';
import { withPrefix } from 'gatsby';

/**
 * ナビゲーションのリンク選択肢
 */
interface NavigationItem {
  path: string;
  label: string;
}

const Navigation: React.FC = () => {
  const expandWidth = 'md';
  const imageSize = 40;
  const navigationItems: NavigationItem[] = [
    {
      path: '/',
      label: 'Blog',
    },
    {
      path: '/tags',
      label: 'Tags',
    },
    {
      path: '/about',
      label: 'About',
    },
  ];

  return (
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
            alt="Shin"
            src={AboutImage}
            width={imageSize}
            height={imageSize}
            roundedCircle
          />
          <span className="ms-3">Shin</span>
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
  );
};

export default Navigation;
