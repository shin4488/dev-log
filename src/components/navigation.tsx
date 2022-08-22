import * as React from 'react';
import AboutImage from '@/images/my-profile-image.png';
import { Navbar, Nav, Image, Container, Offcanvas } from 'react-bootstrap';

const Navigation: React.FC = () => {
  const expandWidth = 'md';

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
  );
};

export default Navigation;
