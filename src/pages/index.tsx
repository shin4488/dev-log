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
                <header>
                  <h2>
                    <Link to={slug || ''} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{post.frontmatter?.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        post.frontmatter?.description || post.excerpt || '',
                    }}
                    itemProp="description"
                  />
                </section>
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
export const Head: HeadFC<IndexPageQuery> = () => <Seo title="All posts" />;

export const query = graphql`
  query IndexPage {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`;
