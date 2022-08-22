import * as React from 'react';
import { graphql, PageProps, HeadFC } from 'gatsby';
import Seo from '@/components/seo';
import Layout from '@/components/layout';
import { AboutPageQuery } from '~/gatsby-graphql';

const aboutPage: React.FC<PageProps<AboutPageQuery>> = ({ data, location }) => {
  const resumePost = data.markdownRemark;
  const developmentExperienceComponent =
    resumePost === undefined || resumePost === null ? (
      <></>
    ) : (
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
        <hr />
      </article>
    );

  return <Layout location={location}>{developmentExperienceComponent}</Layout>;
};

export default aboutPage;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: HeadFC<AboutPageQuery> = () => <Seo title="All posts" />;

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
