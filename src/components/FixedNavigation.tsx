import * as React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

interface FixedNavigationProps {
  isFixed: boolean;
  activeSection: string;
  onNavClick: (_sectionId: string) => void;
}

const FixedNavigation: React.FC<FixedNavigationProps> = ({
  isFixed,
  activeSection,
  onNavClick,
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navItems = [
    { id: 'sns', label: 'リンク' },
    { id: 'projects', label: '個人開発' },
    { id: 'experience', label: '開発経験' },
  ];

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
        <Nav className="mx-auto">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="px-3 fw-semibold text-decoration-none d-inline-block position-relative"
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.id);
              }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                cursor: 'pointer',
                color: activeSection === item.id ? '#2e86de' : '#333',
                borderBottom:
                  hoveredItem === item.id || activeSection === item.id
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
