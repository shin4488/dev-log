import * as React from 'react';
import { Link, graphql, PageProps, HeadFC } from 'gatsby';
import Layout from '@/components/layout';
import Seo from '@/components/seo';
import { IndexPageQuery } from '~/gatsby-graphql';

const BlogIndex: React.FC<PageProps<IndexPageQuery>> = ({ data, location }) => {
  const posts = data.allMarkdownRemark.nodes;

  if (posts.length === 0) {
    return <Layout location={location}></Layout>;
  }

  return (
    <Layout location={location}>
      <ol style={{ listStyle: `none` }}>
        {posts.map((post) => {
          const slug = post.fields?.slug;
          const title = post.frontmatter?.title || slug;

          return (
            <li key={slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                {/* タイトル・更新日時 */}
                <header>
                  <h2>
                    <Link to={slug || ''} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter?.createdDate}</small>
                </header>
                {/* 説明 */}
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        post.frontmatter?.description || post.excerpt || '',
                    }}
                    itemProp="description"
                  />
                </section>
                {/* タグ */}
                {post.frontmatter?.tags?.map((tag) => {
                  const linkToPath = `/tags/${tag}`;
                  return (
                    <React.Fragment key={tag}>
                      <Link to={linkToPath} key={linkToPath}>
                        #{tag}
                      </Link>{' '}
                    </React.Fragment>
                  );
                })}
              </article>
            </li>
          );
        })}
      </ol>
    </Layout>
  );
};

export default BlogIndex;

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head: HeadFC<IndexPageQuery> = () => <Seo title="Blog" />;

export const query = graphql`
  query IndexPage($tagName: [String]) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___createdDate], order: DESC }
      filter: {
        fileAbsolutePath: { regex: "/content/blog/" }
        frontmatter: { tags: { in: $tagName } }
      }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          createdDate(formatString: "YYYY/MM/DD")
          title
          description
          tags
        }
      }
    }
  }
`;
