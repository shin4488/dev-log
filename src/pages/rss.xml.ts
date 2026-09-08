import { buildFeed } from '../../scripts/rss.mjs';
import { getPosts } from '../lib/posts';
import { site } from '../lib/site';

export async function GET() {
  return new Response(buildFeed(await getPosts(), site), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
