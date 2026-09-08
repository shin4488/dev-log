import rss from '@astrojs/rss';
import { getPosts } from '../lib/posts';
import { site } from '../lib/site';

export async function GET() {
  const posts = await getPosts();
  const response = await rss({
    title: 'Dev Log RSS Feed',
    description: site.description,
    site: site.url.replace(/\/$/, ''),
    trailingSlash: false,
    items: [...posts].reverse().map((post) => ({
      title: post.frontmatter.title,
      description: post.excerpt,
      link: site.url.replace(/\/$/, '') + post.fields.slug,
      content: post.html.replaceAll(' data-astro-reload=""', ''),
    })),
  });
  // Keep existing feed item identity; readers must not treat migration as new posts.
  return new Response(
    (await response.text()).replaceAll(
      'isPermaLink="true"',
      'isPermaLink="false"',
    ),
    {
      headers: response.headers,
    },
  );
}
