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
      className="bg-white bg-opacity-90 shadow-sm fixed-nav"
      style={{ backdropFilter: 'blur(6px)' }}
    >
      <Container>
        <Nav className="mx-auto">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`px-3 fw-semibold text-decoration-none hero-nav-button ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick(item.id);
              }}
              style={{
                cursor: 'pointer',
                color: activeSection === item.id ? '#2e86de' : '#333',
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
