import * as React from 'react';
import type { PageProps } from '@/lib/types';
import { Container, Row, Col } from 'react-bootstrap';
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
    }
  }, []);

  // クリック先ではなく、実際の表示位置から選択状態を決める。
  React.useEffect(() => {
    const sections = [
      { id: 'sns', ref: snsRef },
      { id: 'projects', ref: projectsRef },
      { id: 'experience', ref: experienceRef },
    ];
    let frame: number | null = null;

    const checkActiveSection = () => {
      frame = null;
      // セクションのスクロール用余白と同じ位置を判定基準にする。
      const targetPosition = 50;
      let currentSection = 'sns';
      for (const section of sections) {
        if (
          section.ref.current &&
          section.ref.current.getBoundingClientRect().top <= targetPosition
        ) {
          currentSection = section.id;
        }
      }
      // 最後の見出しが画面上端まで届かない高さの画面でも選択できる。
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 1
      ) {
        currentSection = 'experience';
      }
      setActiveSection(currentSection);
    };

    const scheduleCheck = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(checkActiveSection);
      }
    };

    checkActiveSection();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck);
    window.addEventListener('pageshow', scheduleCheck);

    // 画像の読み込みや折り返しによる、スクロール以外の位置変化も追う。
    const observer = new ResizeObserver(scheduleCheck);
    for (const ref of [heroRef, snsRef, projectsRef, experienceRef]) {
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
      window.removeEventListener('pageshow', scheduleCheck);
      observer.disconnect();
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
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
            data-analytics-event="profile_click"
            data-analytics-name={item.title}
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
          <h2 className="mb-4" data-analytics-section="sns">
            リンク
          </h2>
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
          <h2 className="mb-4" data-analytics-section="projects">
            個人開発
          </h2>
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
          <h2 className="mb-4" data-analytics-section="experience">
            開発経験
          </h2>
          <SkillSection />
        </section>
      </Container>
    </Layout>
  );
};

export default aboutPage;
