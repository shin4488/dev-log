import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { mkdir, copyFile } from 'node:fs/promises';

const base = '/dev-log';

export default defineConfig({
  site: 'https://shin4488.github.io',
  base,
  trailingSlash: 'always',
  publicDir: './static',
  // Links to the previous English URL lead to the English root page.
  // Redirect destinations do not receive the base path automatically.
  redirects: {
    '/en/': `${base}/`,
  },
  integrations: [
    react(),
    sitemap({
      // The integration skips only the root 404 page by default.
      filter: (page) => !page.endsWith('/404/'),
    }),
    // Also publish the English not-found page at /404/, the URL that language links use.
    // Astro writes the root 404 page only as 404.html.
    {
      name: 'legacy-404-url',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          await mkdir(new URL('404/', dir), { recursive: true });
          await copyFile(
            new URL('404.html', dir),
            new URL('404/index.html', dir),
          );
        },
      },
    },
  ],
  vite: {
    environments: {
      client: {
        optimizeDeps: {
          // ClientRouter imports these through astro:transitions/client after
          // the initial scan. Prebundle them before serving browser modules so
          // late discovery cannot invalidate their URLs during a cold start.
          include: [
            'astro/virtual-modules/transitions-router.js',
            'astro/virtual-modules/transitions-types.js',
            'astro/virtual-modules/transitions-events.js',
            'astro/virtual-modules/transitions-swap-functions.js',
          ],
        },
      },
      // The prerender and ssr environments below both resolve the ESM builds of the listed UI packages through Vite instead of loading them with Node.
      prerender: {
        resolve: {
          conditions: ['module', 'development|production'],
          noExternal: [
            'react-icons',
            'react-bootstrap',
            'dom-helpers',
            '@restart/ui',
            '@restart/hooks',
            'react-transition-group',
            'uncontrollable',
          ],
        },
      },
      ssr: {
        resolve: {
          conditions: ['module', 'development|production'],
          noExternal: [
            'react-icons',
            'react-bootstrap',
            'dom-helpers',
            '@restart/ui',
            '@restart/hooks',
            'react-transition-group',
            'uncontrollable',
          ],
        },
      },
    },
  },
});
