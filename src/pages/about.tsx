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

const aboutPage: React.FC<PageProps> = ({ location }) => {
  const [activeSection, setActiveSection] = React.useState('sns');
  const [isNavFixed, setIsNavFixed] = React.useState(false);

  // セクションのrefを作成
  const heroRef = React.useRef<HTMLDivElement>(null);
  const snsRef = React.useRef<HTMLElement>(null);
  const projectsRef = React.useRef<HTMLElement>(null);
  const experienceRef = React.useRef<HTMLElement>(null);

  // 初期表示時にsnsセクションをアクティブに設定
  React.useEffect(() => {
    setActiveSection('sns');
  }, []);

  // セクションへのスクロール関数
  const scrollToSection = React.useCallback((sectionId: string) => {
    const sectionRefs = {
      sns: snsRef,
      projects: projectsRef,
      experience: experienceRef,
    };

    const targetRef = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActiveSection(sectionId);
    }
  }, []);

  // セクションの位置を監視してアクティブセクションを判定
  React.useEffect(() => {
    const checkActiveSection = () => {
      const sections = [
        { id: 'sns', ref: snsRef },
        { id: 'projects', ref: projectsRef },
        { id: 'experience', ref: experienceRef },
      ];

      // 画面上端から50px下の位置
      const targetPosition = 50;
      let activeSection = 'sns'; // デフォルト

      // 各セクションの位置をチェック
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect();
          const sectionTop = rect.top;

          // セクションの上端が目標位置（50px）を通過している場合
          if (sectionTop <= targetPosition) {
            activeSection = section.id;
            break;
          }
        }
      }

      setActiveSection(activeSection);
    };

    // 初回チェック
    checkActiveSection();

    // Intersection Observer を使用してスクロール検出の最適化
    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px 0px 0px', // セクションの上端が画面上部から50px下に来たときに反応
      threshold: 0,
    };

    const observerCallback = () => {
      checkActiveSection();
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // セクション要素を監視対象に追加（スクロール検出用）
    if (snsRef.current) {
      observer.observe(snsRef.current);
    }
    if (projectsRef.current) {
      observer.observe(projectsRef.current);
    }
    if (experienceRef.current) {
      observer.observe(experienceRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // ヒーローセクションの監視（ナビゲーション固定用）
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        // ヒーローセクションが見えなくなったらナビゲーションを固定
        setIsNavFixed(!entry.isIntersecting);
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

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

      <div ref={heroRef}>
        <HeroSection
          activeSection={activeSection}
          onNavClick={scrollToSection}
        />
      </div>

      <Container fluid className="py-4 px-2 px-md-5">
        <section
          ref={snsRef}
          id="sns"
          className="mb-5"
          style={{
            paddingTop: '50px',
            marginTop: '-50px',
          }}
        >
          <h2 className="mb-4">リンク</h2>
          {renderSNSLinks}
        </section>

        <section
          ref={projectsRef}
          id="projects"
          className="mb-5"
          style={{
            paddingTop: '50px',
            marginTop: '-50px',
            minHeight: '600px', // 最小高さを設定
          }}
        >
          <h2 className="mb-4">個人開発</h2>
          {renderProjects}
        </section>

        <section
          ref={experienceRef}
          id="experience"
          className="mb-5"
          style={{
            paddingTop: '50px',
            marginTop: '-50px',
            minHeight: '600px', // 最小高さを設定
          }}
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
