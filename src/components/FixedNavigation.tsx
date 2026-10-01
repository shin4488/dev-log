import * as React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { navigationItems, type Locale } from '@/lib/i18n';

interface FixedNavigationProps {
  isFixed: boolean;
  activeSection: string;
  onNavClick: (_sectionId: string) => void;
  locale?: Locale;
}

const FixedNavigation: React.FC<FixedNavigationProps> = ({
  isFixed,
  activeSection,
  onNavClick,
  locale = 'ja',
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navItems = navigationItems(locale);

  if (!isFixed) {
    return null;
  }

  return (
    <Navbar
      fixed="top"
      className="bg-white bg-opacity-90 shadow-sm"
      style={{ backdropFilter: 'blur(6px)' }}
    >
      <Container>
        <Nav className="mx-auto justify-content-center flex-wrap">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? 'location' : undefined}
              className="px-2 px-md-3 fw-semibold text-decoration-none d-inline-block position-relative"
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.id);
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                cursor: 'pointer',
                color:
                  activeSection === item.id || hoveredItem === item.id
                    ? '#2e86de'
                    : '#333',
                borderBottom:
                  activeSection === item.id
                    ? '2px solid #2e86de'
                    : '2px solid transparent',
                paddingBottom: '4px',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {item.label}
            </a>
          ))}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default FixedNavigation;
