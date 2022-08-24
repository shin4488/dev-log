import * as React from 'react';
import { graphql, PageProps, HeadFC } from 'gatsby';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { AboutPageQuery } from '~/gatsby-graphql';
import { FaGithub, FaDev, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SiQiita } from 'react-icons/si';
import { IconType } from 'react-icons';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { selfDevelopmentItems } from './selfDevelopment';

interface SnsLink {
  className?: string;
  uri: string;
  title: string;
  iconComponent: IconType;
}

const aboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const snsLinkItems: SnsLink[] = [
    {
      uri: 'https://github.com/shin4488',
      title: 'GitHub',
      iconComponent: FaGithub,
    },
    {
      className: 'text-qiita',
      uri: 'https://qiita.com/shin4488',
      title: 'Qiita',
      iconComponent: SiQiita,
    },
    {
      uri: 'https://dev.to/shin4488',
      title: 'dev.to',
      iconComponent: FaDev,
    },
    {
      className: 'text-twitter',
      uri: 'https://twitter.com/shin44880',
      title: 'Twitter',
      iconComponent: FaTwitter,
    },
    {
      className: 'text-linkedin',
      uri: 'https://www.linkedin.com/in/shinya-umeshita-668676240',
      title: 'LinkedIn',
      iconComponent: FaLinkedin,
    },
  ];

  const resumePost = data.markdownRemark;

  return (
    <Layout location={location}>
      <div>
        <span className="bg-dark">||</span>
        <span> リンク</span>
      </div>
      <div className="ms-3 my-3">
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

      <div>
        <span className="bg-dark">||</span>
        <span> 個人開発</span>
      </div>
      <div className="my-3">
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
                          <td>アピール</td>
                          <td className="text-break">{item.sellingPoint}</td>
                        </tr>
                        <tr>
                          <td>コメント</td>
                          <td className="text-break">{item.description}</td>
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
        <>
          <div>
            <span className="bg-dark">||</span>
            <span> 開発経験</span>
          </div>

          <article
            className="blog-post"
            itemScope
            itemType="http://schema.org/Article"
          >
            <p>{resumePost.frontmatter?.date} 現在</p>
            <section
              dangerouslySetInnerHTML={{ __html: resumePost.html || '' }}
              itemProp="articleBody"
            />
          </article>
        </>
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
        date(formatString: "YYYY/MM/DD")
      }
    }
  }
`;
