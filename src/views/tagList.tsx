import * as React from 'react';
import type { TagData, PageProps } from '@/lib/types';
import Link from '@/components/Link';
import Layout from '@/components/layout';

const TagList: React.FC<PageProps<TagData>> = ({ data, location }) => {
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
              <Link className="me-1" to={`${location.pathname}${tagName}/`}>
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
