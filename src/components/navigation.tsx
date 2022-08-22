import * as React from 'react';
import AboutImage from '@/images/my-profile-image.png';
import { Navbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';

/**
 * ナビゲーションのリンク選択肢
 */
interface NavigationItem {
  path: string;
  label: string;
}

const Navigation: React.FC = () => {
  const expandWidth = 'md';
  const navigationItems: NavigationItem[] = [
    {
      path: '/',
      label: 'Blog',
    },
    {
      path: '/my-second-post',
      label: 'Tags',
    },
    {
      path: '/about',
      label: 'About',
    },
  ];

  return (
    <Navbar key={expandWidth} bg="light" expand={expandWidth} className="mb-3">
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
            <Nav>
              {navigationItems.map((item) => {
                return (
                  <Nav.Item key={item.path}>
                    <Nav.Link href={item.path}>{item.label}</Nav.Link>
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
