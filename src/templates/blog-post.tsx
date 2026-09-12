import * as React from 'react';
import type { PageProps, PostData } from '@/lib/types';
import Link from '@/components/Link';
import Layout from '@/components/layout';

const BlogPostTemplate: React.FC<PageProps<PostData>> = ({
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
        <div
          data-analytics-article-end
          aria-hidden="true"
          style={{ height: 1 }}
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

export default BlogPostTemplate;
