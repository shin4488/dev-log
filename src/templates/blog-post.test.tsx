import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogPost from './blog-post';
import type { Post } from '@/lib/types';

const post: Post = {
  fields: { slug: '/middle/' },
  frontmatter: {
    title: 'Middle article',
    createdDate: '2026/09/08',
    updatedDate: '2026/09/09',
  },
  html: '<p>Article body</p>',
  feedHtml: '<p>Article body</p>',
  excerpt: 'Article body',
  seoExcerpt: 'Article body',
};

test('renders the article, dates, and adjacent article links', () => {
  render(
    <BlogPost
      location={{ pathname: '/dev-log/middle/' }}
      data={{
        markdownRemark: post,
        previous: {
          ...post,
          fields: { slug: '/older/' },
          frontmatter: { ...post.frontmatter, title: 'Older article' },
        },
        next: {
          ...post,
          fields: { slug: '/newer/' },
          frontmatter: { ...post.frontmatter, title: 'Newer article' },
        },
      }}
    />,
  );
  expect(
    screen.getByRole('heading', { name: 'Middle article' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Article body')).toBeInTheDocument();
  expect(
    screen.getByText('作成日：2026/09/08, 更新日：2026/09/09'),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Older article' })).toHaveAttribute(
    'href',
    '/dev-log/older/',
  );
  expect(screen.getByRole('link', { name: 'Newer article' })).toHaveAttribute(
    'href',
    '/dev-log/newer/',
  );
});

test('a single article has no previous or next link', () => {
  render(
    <BlogPost
      location={{ pathname: '/dev-log/middle/' }}
      data={{ markdownRemark: post, previous: null, next: null }}
    />,
  );
  expect(screen.queryByText('Previous:')).not.toBeInTheDocument();
  expect(screen.queryByText('Next:')).not.toBeInTheDocument();
});
