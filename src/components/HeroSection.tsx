import * as React from 'react';
import { Container } from 'react-bootstrap';
import AboutImage from '@/images/my-profile-image.png?url';
import { localeUrl, messages, navigationItems, type Locale } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

interface HeroSectionProps {
  activeSection: string;
  onNavClick: (_sectionId: string) => void;
  locale?: Locale;
  pathname?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  activeSection,
  onNavClick,
  locale = 'ja',
  pathname = localeUrl(locale),
}) => {
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const navItems = navigationItems(locale);

  return (
    <div
      className="text-white text-center py-5 position-relative mb-4"
      style={{
        background: 'linear-gradient(120deg, #1d976c, #2e86de)',
      }}
    >
      <div className="position-absolute top-0 end-0 p-3">
        <LanguageSwitcher locale={locale} pathname={pathname} />
      </div>
      <Container className="pt-4">
        <img
          src={AboutImage}
          alt={messages[locale].profileImage}
          className="rounded-circle mb-3 border border-4 border-white object-fit-cover"
          width={140}
          height={140}
        />
      </Container>
      <nav className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center gap-3 px-2 pb-2">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            aria-current={activeSection === item.id ? 'location' : undefined}
            className="pb-1 text-white text-decoration-none d-inline-block position-relative"
            style={{
              borderBottom:
                activeSection === item.id
                  ? '2px solid white'
                  : '2px solid transparent',
              opacity: hoveredItem === item.id ? 0.8 : 1,
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
