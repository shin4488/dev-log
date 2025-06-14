import * as React from 'react';
import { graphql, PageProps, HeadFC } from 'gatsby';
import Layout from '@/components/layout';
import Seo from '@/components/seo';
import { AboutPageQuery } from '~/gatsby-graphql';
import { snsLinkItems } from '@/data/sns';
import { selfDevelopmentItems } from '@/data/selfDevelopment';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

const AboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const resumePost = data.markdownRemark;

  const SectionHeading: React.FC<{ id: string }> = ({ id, children }) => (
    <h2 id={id} className="mb-4">
      {children}
    </h2>
  );

  return (
    <Layout location={location}>
      <Container>
        <section className="mb-5">
          <SectionHeading id="sns">リンク</SectionHeading>
          <div className="mb-4">
            {snsLinkItems.map((item) => (
              <a
                key={item.uri}
                href={item.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
                title={item.title}
                style={{ color: 'inherit', ...item.style }}
              >
                <item.iconComponent className={item.className} size={24} />
              </a>
            ))}
          </div>
        </section>

        <section className="mb-5">
          <SectionHeading id="projects">個人開発</SectionHeading>
          <Row xs={1} md={2} className="g-4">
            {selfDevelopmentItems.map((item) => (
              <Col key={item.siteUri}>
                <Card className="h-100 shadow-sm">
                  <a
                    href={item.siteUri}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card.Img
                      variant="top"
                      src={item.imageUri}
                      style={{ objectFit: 'contain', height: '200px' }}
                    />
                  </a>
                  <Card.Body>
                    <Card.Title>
                      <a
                        href={item.siteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        {item.title}
                      </a>
                    </Card.Title>
                    <Table>
                      <tbody>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>使用技術</th>
                          <td>
                            {item.usedTechniques.map((tech) => (
                              <Badge
                                bg="secondary"
                                className="me-1 mb-1"
                                key={tech}
                              >
                                {tech}
                              </Badge>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>概要</th>
                          <td className="text-break">{item.overview}</td>
                        </tr>
                        <tr>
                          <th style={{ whiteSpace: 'nowrap' }}>技術アピール</th>
                          <td className="text-break">{item.techAppeal}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {resumePost && (
          <section className="mb-5">
            <SectionHeading id="experience">開発経験</SectionHeading>
            <p className="mb-3">{resumePost.frontmatter?.updatedDate} 現在</p>
            <article
              className="text-break"
              itemScope
              itemType="http://schema.org/Article"
              dangerouslySetInnerHTML={{ __html: resumePost.html || '' }}
            />
          </section>
        )}
      </Container>
    </Layout>
  );
};

export default AboutPage;

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
