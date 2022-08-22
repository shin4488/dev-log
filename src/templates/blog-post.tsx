import * as React from 'react';
import { Link, graphql, PageProps, HeadFC } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../components/layout';
import Seo from '../components/seo';
import { BlogPostBySlugQuery } from '~/gatsby-graphql';

const BlogPostTemplate: React.FC<PageProps<BlogPostBySlugQuery>> = ({
  data: { previous, next, markdownRemark: post },
  location,
}) => {
  if (post === undefined || post === null) {
    return <Layout location={location}>No Posts...</Layout>;
  }

  return (
    <Layout location={location}>
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <h1 itemProp="headline">{post.frontmatter?.title}</h1>
          <p>{post.frontmatter?.date}</p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {next && (
              <Link to={next.fields?.slug || ''} rel="next">
                {next.frontmatter?.title} ←
              </Link>
            )}
          </li>
          <li>
            {previous && (
              <Link to={previous.fields?.slug || ''} rel="prev">
                → {previous.frontmatter?.title}
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export const Head: HeadFC<BlogPostBySlugQuery> = ({
  data: { markdownRemark: post },
}) => {
  return (
    <Seo
      title={post?.frontmatter?.title || ''}
      description={post?.frontmatter?.description || post?.excerpt || ''}
    />
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
