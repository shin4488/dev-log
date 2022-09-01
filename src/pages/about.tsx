import * as React from 'react';
import { graphql, PageProps, HeadFC } from 'gatsby';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { AboutPageQuery } from '~/gatsby-graphql';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { selfDevelopmentItems } from '@/data/selfDevelopment';
import { snsLinkItems } from '@/data/sns';

const aboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const resumePost = data.markdownRemark;
  const scrollPaddingTopStyle = { paddingTop: '65px', marginTop: '-45px' };

  return (
    <Layout location={location}>
      <a href="#link">
        <h4 id="link" className="d-inline-block" style={scrollPaddingTopStyle}>
          <span className="bg-dark">|</span>
          <span> リンク</span>
        </h4>
      </a>
      <div className="ms-3 mt-4 mb-5 ">
        {snsLinkItems.map((item) => (
          <a
            key={item.uri}
            href={item.uri}
            style={{ color: 'inherit' }}
            target="_blank"
            className="me-4 me-md-5"
            title={item.title}
          >
            <item.iconComponent className={item.className} size={30} />
          </a>
        ))}
      </div>

      <a href="#self-development">
        <h4
          id="self-development"
          className="d-inline-block"
          style={scrollPaddingTopStyle}
        >
          <span className="bg-dark">|</span>
          <span> 個人開発</span>
        </h4>
      </a>
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
                          <td>コメント</td>
                          <td className="text-break">{item.description}</td>
                        </tr>
                        <tr>
                          <td>アピール</td>
                          <td className="text-break">{item.sellingPoint}</td>
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
          <a href="#development-experience">
            <h4
              id="development-experience"
              className="d-inline-block"
              style={scrollPaddingTopStyle}
            >
              <span className="bg-dark">|</span>
              <span> 開発経験</span>
            </h4>
          </a>

          <article
            className="blog-post"
            itemScope
            itemType="http://schema.org/Article"
          >
            <p className="mb-4">{resumePost.frontmatter?.updatedDate} 現在</p>
            <section
              dangerouslySetInnerHTML={{ __html: resumePost.html || '' }}
              className="text-break"
              itemProp="articleBody"
            />
          </article>
        </div>
      )}
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
