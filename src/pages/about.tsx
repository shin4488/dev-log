import * as React from 'react';
import { PageProps, HeadFC } from 'gatsby';
import { Container, Row, Col } from 'react-bootstrap';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { selfDevelopmentItems } from '@/data/selfDevelopment';
import { snsLinkItems } from '@/data/sns';
import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import SkillSection from '@/components/SkillSection';
import FixedNavigation from '@/components/FixedNavigation';

// Gatsbyでのブラウザ環境チェック
const isBrowser = typeof window !== 'undefined';

const aboutPage: React.FC<PageProps> = ({ location }) => {
  const [activeSection, setActiveSection] = React.useState('sns');
  const [isNavFixed, setIsNavFixed] = React.useState(false);

  const scrollToSection = React.useCallback((sectionId: string) => {
    if (!isBrowser) {
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
    }
  }, []);

  const handleScroll = React.useCallback(() => {
    if (!isBrowser) {
      return;
    }

    const scrollPosition = window.scrollY;
    const heroHeight = 300;

    setIsNavFixed(scrollPosition > heroHeight);

    // Update active section based on scroll position
    const sections = ['sns', 'projects', 'experience'];
    const sectionElements = sections.map((id) => ({
      id,
      element: document.getElementById(id),
    }));

    const currentSection = sectionElements.find(({ element }) => {
      if (!element) {
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom >= 100;
    });

    if (currentSection) {
      setActiveSection(currentSection.id);
    }
  }, []);

  React.useEffect(() => {
    if (!isBrowser) {
      return;
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const renderSNSLinks = React.useMemo(
    () => (
      <div className="mb-4">
        {snsLinkItems.map((item) => (
          <a
            key={item.uri}
            href={item.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="me-4 me-md-5"
            style={{ color: 'inherit', ...item.style }}
            title={item.title}
          >
            <item.iconComponent size={35} className={item.className} />
          </a>
        ))}
      </div>
    ),
    [],
  );

  const renderProjects = React.useMemo(
    () => (
      <Row xs={1} md={2} className="g-4">
        {selfDevelopmentItems.map((item) => (
          <Col key={item.siteUri}>
            <ProjectCard item={item} />
          </Col>
        ))}
      </Row>
    ),
    [],
  );

  return (
    <Layout location={location} useFluidContainer={true}>
      <FixedNavigation
        isFixed={isNavFixed}
        activeSection={activeSection}
        onNavClick={scrollToSection}
      />

      <HeroSection activeSection={activeSection} onNavClick={scrollToSection} />

      <Container fluid className="py-4 px-2 px-md-5">
        <section
          id="sns"
          className="mb-5"
          style={{ paddingTop: '80px', marginTop: '-80px' }}
        >
          <h2 className="mb-4">リンク</h2>
          {renderSNSLinks}
        </section>

        <section
          id="projects"
          className="mb-5"
          style={{ paddingTop: '80px', marginTop: '-80px' }}
        >
          <h2 className="mb-4">個人開発</h2>
          {renderProjects}
        </section>

        <section
          id="experience"
          className="mb-5"
          style={{ paddingTop: '80px', marginTop: '-80px' }}
        >
          <h2 className="mb-4">開発経験</h2>
          <SkillSection />
        </section>
      </Container>
    </Layout>
  );
};

export default aboutPage;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: HeadFC = () => <Seo title="About" />;
