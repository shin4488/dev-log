import { iconSizes } from '../lib/icons';

export function GET() {
  return new Response(
    JSON.stringify({
      name: 'Dev Log',
      short_name: 'Dev Log',
      start_url: '/dev-log/',
      background_color: '#ffffff',
      display: 'minimal-ui',
      icons: iconSizes.map((size) => ({
        src: `/dev-log/icons/icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: 'image/png',
      })),
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
}
