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

interface SnsLink {
  className?: string;
  uri: string;
  title: string;
  iconComponent: IconType;
}

interface SelfDevelopmentItem {
  title: string;
  imageUri: string;
  siteUri: string;
  developmentStartAt: string;
  developmentEndAt: string;
  usedTechniques: string[];
  sellingPoint: string;
  description: string;
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

  const selfDevelopmentItems: SelfDevelopmentItem[] = [
    {
      title: 'Shooting Game',
      imageUri: 'https://shooting-basic.surge.sh/img/man.png',
      siteUri: 'https://shooting-basic.surge.sh',
      developmentStartAt: '2017年1月',
      developmentEndAt: '3月',
      usedTechniques: ['JavaScript', 'Surge'],
      sellingPoint:
        'Surgeを使用してサーバコスト・開発スピードをかけずにデリバリーできるようにした。',
      description:
        '大学3年生の時に初めてHTML・CSS・JavaScriptを触った時に作ったもの。今考えるとよくこんなクオリティでリリースしたなと思うが、当時は結構真剣に作っていた。',
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
            <Card className="ps-1">
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
                    <Card.Text>
                      <Table striped bordered hover>
                        <tbody>
                          <tr>
                            <td>サイト</td>
                            <td>
                              <a
                                href={item.siteUri}
                                target="_blank"
                                title={item.title}
                              >
                                {item.siteUri}
                              </a>
                            </td>
                          </tr>
                          {/* 列幅が４文字の方が見やすいため、４文字全てが1行に入るように調整している */}
                          <tr>
                            <td style={{ whiteSpace: 'nowrap' }}>開発時期</td>
                            <td>
                              {item.developmentStartAt}〜{item.developmentEndAt}
                            </td>
                          </tr>
                          <tr>
                            <td>使用技術</td>
                            <td>{item.usedTechniques.join(', ')}</td>
                          </tr>
                          <tr>
                            <td>アピール</td>
                            <td>{item.sellingPoint}</td>
                          </tr>
                          <tr>
                            <td>コメント</td>
                            <td>{item.description}</td>
                          </tr>
                        </tbody>
                      </Table>

                      {/* <div>
                    サイト：
                    <a href={item.siteUri} target="_blank" title={item.title}>
                      {item.siteUri}
                    </a>
                  </div>
                  <div>
                    開発時期：{item.developmentStartAt}〜{item.developmentEndAt}
                  </div>
                  <div>使用技術：{item.usedTechniques.join(', ')}</div>
                  <div>{item.description}</div> */}
                    </Card.Text>
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
