import * as React from 'react';
import type { PageProps } from '@/lib/types';
import { Container, Row, Col } from 'react-bootstrap';
import Layout from '@/components/layout';
import { getSelfDevelopmentItems } from '@/data/selfDevelopment';
import { messages } from '@/lib/i18n';
import { snsLinkItems } from '@/data/sns';
import HeroSection from '@/components/HeroSection';
import ProjectCard from '@/components/ProjectCard';
import SkillSection from '@/components/SkillSection';
import FixedNavigation from '@/components/FixedNavigation';

const aboutPage: React.FC<PageProps> = ({ location, locale }) => {
  const text = messages[locale];
  const [activeSection, setActiveSection] = React.useState('sns');
  const [isNavFixed, setIsNavFixed] = React.useState(false);

  const heroRef = React.useRef<HTMLDivElement>(null);
  const snsRef = React.useRef<HTMLElement>(null);
  const projectsRef = React.useRef<HTMLElement>(null);
  const experienceRef = React.useRef<HTMLElement>(null);

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
      // ページ末尾までスクロールしても最後の見出しが判定位置に届かない場合も、最後のセクションを選択する。
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

  // ヒーローが画面から完全に外れている間だけ、上部に固定したナビゲーションを表示する。
  React.useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
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
            className="me-4 me-md-5 text-reset"
            title={item.title}
          >
            <item.iconComponent
              size={35}
              className={item.className}
              color={item.color}
            />
          </a>
        ))}
      </div>
    ),
    [],
  );

  const renderProjects = React.useMemo(
    () => (
      <Row xs={1} md={2} className="gy-4 gx-3 gx-md-4">
        {getSelfDevelopmentItems(locale).map((item) => (
          <Col key={item.siteUri}>
            <ProjectCard item={item} locale={locale} />
          </Col>
        ))}
      </Row>
    ),
    [locale],
  );

  return (
    <Layout useFluidContainer={true}>
      <FixedNavigation
        isFixed={isNavFixed}
        activeSection={activeSection}
        onNavClick={scrollToSection}
        locale={locale}
      />

      <div ref={heroRef}>
        <HeroSection
          activeSection={activeSection}
          onNavClick={scrollToSection}
          locale={locale}
          pathname={location.pathname}
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
            {text.sections.sns}
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
            minHeight: '600px',
          }}
        >
          <h2 className="mb-4" data-analytics-section="projects">
            {text.sections.projects}
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
            minHeight: '600px',
          }}
        >
          <h2 className="mb-4" data-analytics-section="experience">
            {text.sections.experience}
          </h2>
          <SkillSection locale={locale} />
        </section>
      </Container>
    </Layout>
  );
};

export default aboutPage;
