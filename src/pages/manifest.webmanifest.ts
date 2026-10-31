import { iconSizes } from '../lib/icons';
import { localUrl } from '../lib/site';

export function GET() {
  return new Response(
    JSON.stringify({
      name: 'Dev Log',
      short_name: 'Dev Log',
      start_url: localUrl('/'),
      background_color: '#ffffff',
      display: 'minimal-ui',
      icons: iconSizes.map((size) => ({
        src: localUrl(`/icons/icon-${size}x${size}.png`),
        sizes: `${size}x${size}`,
        type: 'image/png',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
}
