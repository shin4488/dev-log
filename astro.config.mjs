import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { mkdir, copyFile } from 'node:fs/promises';
import { unified } from '@astrojs/markdown-remark';
import { excerpt, localLinks } from './scripts/markdown.mjs';

export default defineConfig({
  site: 'https://shin4488.github.io',
  base: '/dev-log',
  trailingSlash: 'always',
  publicDir: './static',
  integrations: [
    react(),
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
      prerender: {
        resolve: {
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
  markdown: {
    processor: unified({
      syntaxHighlight: 'prism',
      remarkPlugins: [excerpt],
      rehypePlugins: [localLinks],
    }),
  },
});
