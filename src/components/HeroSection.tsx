import * as React from 'react';
import { Container } from 'react-bootstrap';
import AboutImage from '@/images/my-profile-image.png';
import '@/style.scss';

interface HeroSectionProps {
  activeSection: string;
  onNavClick: (_sectionId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  activeSection,
  onNavClick,
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navItems = [
    { id: 'sns', label: 'リンク' },
    { id: 'projects', label: '個人開発' },
    { id: 'experience', label: '開発経験' },
  ];

  return (
    <div
      className="text-white text-center py-5 position-relative mb-4"
      style={{
        background: 'linear-gradient(120deg, #1d976c, #2e86de)',
      }}
    >
      <Container>
        <img
          src={AboutImage}
          alt="Profile picture"
          className="rounded-circle mb-3 border border-4 border-white"
          style={{ width: '140px', height: '140px', objectFit: 'cover' }}
        />
      </Container>
      <nav className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center gap-4 pb-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-white text-decoration-none d-inline-block position-relative"
            style={{
              borderBottom:
                hoveredItem === item.id || activeSection === item.id
                  ? '2px solid white'
                  : '2px solid transparent',
              paddingBottom: '4px',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={(e) => {
              e.preventDefault();
              onNavClick(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default HeroSection;
