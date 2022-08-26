import * as React from 'react';
import { Link, graphql, PageProps, HeadFC } from 'gatsby';
import Layout from '@/components/layout';
import Seo from '@/components/seo';
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
          <p>
            作成日：{post.frontmatter?.createdDate}
            {post.frontmatter?.updatedDate &&
              `, 更新日：${post.frontmatter.updatedDate}`}
          </p>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post?.html || '' }}
          itemProp="articleBody"
        />
        {previous && next && <hr />}
      </article>

      {/* 前後の記事へのリンク */}
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
            {previous && (
              <>
                {'Previous: '}
                <Link to={previous.fields?.slug || ''} rel="prev">
                  {previous.frontmatter?.title}
                </Link>
              </>
            )}
          </li>
          <li>
            {next && (
              <>
                {'Next: '}
                <Link to={next.fields?.slug || ''} rel="next">
                  {next.frontmatter?.title}
                </Link>
              </>
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
      // TODO:og:imageに設定する画像データの用意
      image={''}
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
        createdDate(formatString: "YYYY/MM/DD")
        updatedDate(formatString: "YYYY/MM/DD")
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
