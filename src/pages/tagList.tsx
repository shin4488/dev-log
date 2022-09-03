import * as React from 'react';
import { Link, graphql, PageProps, HeadFC, withPrefix } from 'gatsby';
import { TagListPageQuery } from '~/gatsby-graphql';
import Layout from '@/components/layout';
import Seo from '@/components/seo';

const TagList: React.FC<PageProps<TagListPageQuery>> = ({ data, location }) => {
  const tags = data.tags.group;

  if (tags.length === 0) {
    return <Layout location={location}></Layout>;
  }

  return (
    <Layout location={location}>
      <div style={{ wordWrap: 'break-word' }}>
        {tags.map((tag) => {
          const tagName = tag.tag;
          return (
            <span className="me-3" key={tagName}>
              <Link className="me-1" to={withPrefix(`tags/${tagName}`)}>
                {tagName}
              </Link>
              {`(${tag.totalCount})`}
            </span>
          );
        })}
      </div>
    </Layout>
  );
};

export default TagList;

export const Head: HeadFC<TagListPageQuery> = () => <Seo title="Tags" />;

export const query = graphql`
  query TagListPage {
    tags: allMarkdownRemark(
      sort: { fields: [frontmatter___tags], order: ASC }
      filter: { fileAbsolutePath: { regex: "/content/blog/" } }
    ) {
      group(field: frontmatter___tags) {
        tag: fieldValue
        totalCount
      }
    }
  }
`;
