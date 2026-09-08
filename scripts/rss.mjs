import { XMLBuilder } from 'fast-xml-parser';

/** Build the feed from data so escaping and item identity never depend on XML replacements. */
export function buildFeed(posts, site) {
  const root = site.url.replace(/\/$/, '');
  return new XMLBuilder({ ignoreAttributes: false }).build({
    '?xml': { '@_version': '1.0', '@_encoding': 'UTF-8' },
    rss: {
      '@_version': '2.0',
      '@_xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
      channel: {
        title: 'Dev Log RSS Feed',
        description: site.description,
        link: root,
        item: [...posts].reverse().map((post) => ({
          title: post.frontmatter.title,
          description: post.excerpt,
          link: root + post.fields.slug,
          guid: { '@_isPermaLink': 'false', '#text': root + post.fields.slug },
          'content:encoded': post.feedHtml,
        })),
      },
    },
  });
}
