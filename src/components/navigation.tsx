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
  const navRef = React.useRef<HTMLDivElement | null>(null);
  const [navFixed, setNavFixed] = React.useState(false);
  const [activeHref, setActiveHref] = React.useState('#sns');

  React.useEffect(() => {
    if (!isAboutPage || !navRef.current) {
      return;
    }

    const nav = navRef.current;
    const links = Array.from(nav.querySelectorAll('a')) as HTMLAnchorElement[];
    const sections = links.map((link) =>
      document.querySelector(link.getAttribute('href') ?? ''),
    ) as HTMLElement[];
    const navTop = nav.getBoundingClientRect().top + window.pageYOffset;

    const updateFixed = () => {
      setNavFixed(window.pageYOffset >= navTop);
    };

    const highlightNav = () => {
      const offset = nav.offsetHeight + 10;
      const scroll = window.pageYOffset + offset;
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) {
          continue;
        }
        const nextTop =
          i < sections.length - 1
            ? sections[i + 1].offsetTop - offset
            : Infinity;
        const currentTop = section.offsetTop - offset;
        if (scroll >= currentTop && scroll < nextTop) {
          setActiveHref(links[i].getAttribute('href') ?? '');
          break;
        }
      }
    };

    const onScroll = () => {
      updateFixed();
      highlightNav();
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [isAboutPage]);

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
          <Nav
            ref={navRef}
            className={`justify-content-center gap-4 ${navFixed ? 'position-fixed top-0 start-0 w-100 py-2 bg-white bg-opacity-90' : 'position-absolute bottom-0 start-50 translate-middle-x pb-2'}`}
            style={
              navFixed
                ? { backdropFilter: 'blur(6px)', zIndex: 1000 }
                : undefined
            }
          >
            <Nav.Item>
              <Nav.Link
                href="#sns"
                className="text-decoration-none"
                style={{
                  paddingBottom: '0.25rem',
                  borderBottom: '2px solid',
                  borderColor:
                    activeHref === '#sns'
                      ? navFixed
                        ? '#0d6efd'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    activeHref === '#sns' && navFixed
                      ? '#0d6efd'
                      : navFixed
                        ? '#333'
                        : '#ffffff',
                }}
              >
                リンク
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#projects"
                className="text-decoration-none"
                style={{
                  paddingBottom: '0.25rem',
                  borderBottom: '2px solid',
                  borderColor:
                    activeHref === '#projects'
                      ? navFixed
                        ? '#0d6efd'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    activeHref === '#projects' && navFixed
                      ? '#0d6efd'
                      : navFixed
                        ? '#333'
                        : '#ffffff',
                }}
              >
                個人開発
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#experience"
                className="text-decoration-none"
                style={{
                  paddingBottom: '0.25rem',
                  borderBottom: '2px solid',
                  borderColor:
                    activeHref === '#experience'
                      ? navFixed
                        ? '#0d6efd'
                        : '#ffffff'
                      : 'transparent',
                  color:
                    activeHref === '#experience' && navFixed
                      ? '#0d6efd'
                      : navFixed
                        ? '#333'
                        : '#ffffff',
                }}
              >
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
