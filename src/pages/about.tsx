import * as React from 'react';
import { graphql, PageProps, HeadFC } from 'gatsby';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { AboutPageQuery } from '~/gatsby-graphql';
import { FaGithub, FaDev, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { SiQiita } from 'react-icons/si';
import { IconType } from 'react-icons';

interface SnsLink {
  uri: string;
  iconComponent: IconType;
}

const aboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const snsLinkItems: SnsLink[] = [
    {
      uri: 'https://github.com/shin4488',
      iconComponent: FaGithub,
    },
    {
      uri: 'https://qiita.com/shin4488',
      iconComponent: SiQiita,
    },
    {
      uri: 'https://dev.to/shin4488',
      iconComponent: FaDev,
    },
    {
      uri: 'https://twitter.com/shin44880',
      iconComponent: FaTwitter,
    },
    {
      uri: 'https://www.linkedin.com/in/shinya-umeshita-668676240',
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
      <div className="mb-3">
        {snsLinkItems.map((item) => (
          <a
            key={item.uri}
            href={item.uri}
            style={{ color: 'inherit' }}
            target="_blank"
            className="mr-3"
          >
            <item.iconComponent size={30} />
          </a>
        ))}
      </div>

      <div>
        <span className="bg-dark">||</span>
        <span> 個人開発</span>
      </div>
      <div className="mb-3"></div>

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
