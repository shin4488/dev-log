import * as React from 'react';
import { graphql, PageProps, HeadFC, Link } from 'gatsby';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { AboutPageQuery } from '~/gatsby-graphql';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { selfDevelopmentItems } from '@/data/selfDevelopment';
import { snsLinkItems } from '@/data/sns';
import ListGroup from 'react-bootstrap/ListGroup';

interface TitleLink {
  innerLink: string;
  titleLabel: string;
}

interface LinkedId {
  link: TitleLink;
  selfDevelopment: TitleLink;
  developmentExperience: TitleLink;
}

const aboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const resumePost = data.markdownRemark;
  const scrollPaddingTopStyle = { paddingTop: '65px', marginTop: '-45px' };
  const titleLeftSideBar = 'ps-2 border-start border-title-left-bar border-5';
  const sideBarWidth = 2;
  const linkedIds: LinkedId = {
    link: {
      innerLink: 'link',
      titleLabel: 'リンク',
    },
    selfDevelopment: {
      innerLink: 'self-development',
      titleLabel: '個人開発',
    },
    developmentExperience: {
      innerLink: 'development-experience',
      titleLabel: '開発経験',
    },
  };

  React.useEffect(() => {
    const sectionIds = [
      linkedIds.link.innerLink,
      linkedIds.selfDevelopment.innerLink,
      linkedIds.developmentExperience.innerLink,
    ];
    function onScroll() {
      const offset = 80;
      const scrollPos = window.scrollY + offset;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          current = id;
        }
      }
      sectionIds.forEach((id) => {
        const nav = document.getElementById(`nav-${id}`);
        if (nav) {
          if (id === current) {
            nav.classList.add('active');
          } else {
            nav.classList.remove('active');
          }
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout location={location}>
      <Row sm={1} md={2}>
        <Col md={12 - sideBarWidth}>
          <h2
            id={linkedIds.link.innerLink}
            className="d-inline-block"
            style={scrollPaddingTopStyle}
          >
            <span className={titleLeftSideBar}>{linkedIds.link.titleLabel}</span>
          </h2>
          <div className="ms-3 mt-4 mb-5 ">
            {snsLinkItems.map((item) => (
              <a
                key={item.uri}
                href={item.uri}
                style={{ color: 'inherit', ...item.style }}
                target="_blank"
                rel="noopener noreferrer"
                className="me-4 me-md-5"
                aria-label={item.title}
                title={item.title}
              >
                <item.iconComponent className={item.className} size={30} />
              </a>
            ))}
          </div>

          <h2
            id={linkedIds.selfDevelopment.innerLink}
            className="d-inline-block"
            style={scrollPaddingTopStyle}
          >
            <span className={titleLeftSideBar}>
              {linkedIds.selfDevelopment.titleLabel}
            </span>
          </h2>
          <div className="mt-4 mb-5">
            {selfDevelopmentItems.map((item) => {
              return (
                <Card key={item.siteUri} className="ps-1 mb-3">
                  <Row xs={1} md={2}>
                    <Col md={2} className="m-auto text-center">
                      <a href={item.siteUri} target="_blank" title={item.title}>
                        <Card.Img
                          variant="top"
                          src={item.imageUri}
                          style={{
                            maxWidth: 200,
                            maxHeight: 200,
                            objectFit: 'contain',
                          }}
                        />
                      </a>
                    </Col>
                    <Col md={10}>
                      <Card.Body>
                        <Card.Title>{item.title}</Card.Title>
                        <Table striped bordered hover>
                          <tbody>
                            <tr>
                              <td>サイト</td>
                              <td>
                                <a
                                  href={item.siteUri}
                                  target="_blank"
                                  title={item.title}
                                  className="text-break"
                                >
                                  {item.siteUri}
                                </a>
                              </td>
                            </tr>
                            {/* 列幅が４文字の方が見やすいため、４文字全てが1行に入るように調整している */}
                            <tr>
                              <td style={{ whiteSpace: 'nowrap' }}>開発時期</td>
                              <td>
                                {item.developmentStartAt}
                                {item.developmentEndAt === ''
                                  ? ''
                                  : `〜${item.developmentEndAt}`}
                              </td>
                            </tr>
                            <tr>
                              <td>使用技術</td>
                              <td>{item.usedTechniques.join(', ')}</td>
                            </tr>
                            <tr>
                              <td>概要</td>
                              <td className="text-break">{item.description}</td>
                            </tr>
                            <tr>
                              <td>技術アピール</td>
                              <td className="text-break">
                                {item.sellingPoint}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>

          {resumePost === undefined || resumePost === null ? (
            <></>
          ) : (
            <div>
              <h2
                id={linkedIds.developmentExperience.innerLink}
                className="d-inline-block"
                style={scrollPaddingTopStyle}
              >
                <span className={titleLeftSideBar}>
                  {linkedIds.developmentExperience.titleLabel}
                </span>
              </h2>

              <article
                className="blog-post"
                itemScope
                itemType="http://schema.org/Article"
              >
                <p className="mb-4">
                  {resumePost.frontmatter?.updatedDate} 現在
                </p>
                <section
                  dangerouslySetInnerHTML={{ __html: resumePost.html || '' }}
                  className="text-break"
                  itemProp="articleBody"
                />
              </article>
            </div>
          )}
        </Col>

        <Col
          md={sideBarWidth}
          className="d-none d-sm-none d-md-block position-fixed end-0 border border-dark"
        >
          <span className="mb-2">Contents</span>
          <ListGroup variant="flush">
            <ListGroup.Item
              href={`#${linkedIds.link.innerLink}`}
              action
              active={false}
            >
              {linkedIds.link.titleLabel}
            </ListGroup.Item>
            <ListGroup.Item
              href={`#${linkedIds.selfDevelopment.innerLink}`}
              action
              active={false}
            >
              {linkedIds.selfDevelopment.titleLabel}
            </ListGroup.Item>
            <ListGroup.Item
              href={`#${linkedIds.developmentExperience.innerLink}`}
              action
              active={false}
            >
              {linkedIds.developmentExperience.titleLabel}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Layout>
  );
};

export default aboutPage;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: HeadFC<AboutPageQuery> = () => <Seo title="About" />;

export const pageQuery = graphql`
  query AboutPage {
    markdownRemark(fileAbsolutePath: { regex: "/content/resume/" }) {
      html
      frontmatter {
        updatedDate(formatString: "YYYY/MM/DD")
      }
    }
  }
`;
