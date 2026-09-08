import { pageArticle } from '../../scripts/markdown-media.mjs';
import type { MarkdownInstance } from 'astro';
import type { Post } from './types';

const documents = import.meta.glob<
  MarkdownInstance<
    Post['frontmatter'] & { excerpt: string; seoExcerpt: string }
  >
>('../../content/blog/**/index.md', { eager: true });

export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    Object.entries(documents)
      .sort(
        ([, a], [, b]) =>
          Date.parse(a.frontmatter.createdDate) -
          Date.parse(b.frontmatter.createdDate),
      )
      .map(async ([file, document]) => {
        const html = await document.compiledContent();
        const formatDate = (date: string) =>
          new Date(date).toISOString().slice(0, 10).replaceAll('-', '/');
        return {
          fields: {
            slug: `/${file.split('/blog/')[1].replace(/\/index\.md$/, '')}/`,
          },
          frontmatter: {
            ...document.frontmatter,
            createdDate: formatDate(document.frontmatter.createdDate),
            updatedDate: document.frontmatter.updatedDate
              ? formatDate(document.frontmatter.updatedDate)
              : undefined,
          },
          html: pageArticle(html),
          feedHtml: html,
          excerpt: document.frontmatter.excerpt,
          seoExcerpt: document.frontmatter.seoExcerpt,
        };
      }),
  );
  return posts;
}

export function getTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of new Set(post.frontmatter.tags || [])) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return [...counts]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([tag, totalCount]) => ({ tag, totalCount }));
}
