import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { toHtml } from 'hast-util-to-html';
import { element, renderMedia } from './markdown-media.mjs';
import { markdownCode } from './markdown-code.mjs';
import prune from 'underscore.string/prune.js';

// Keep the former plain-text RSS excerpt, including word-boundary truncation.
export function excerpt() {
  return (tree, file) => {
    const parts = [];
    function visit(node) {
      if (node.type === 'text' || node.type === 'inlineCode')
        parts.push(node.value);
      else if (node.type === 'image') parts.push(node.alt || '');
      else if (
        ['paragraph', 'heading', 'tableCell', 'break'].includes(node.type)
      )
        parts.push(' ');
      node.children?.forEach(visit);
    }
    visit(tree);
    file.data.astro.frontmatter.excerpt = prune(
      parts.join('').trim(),
      140,
      '…',
    );
    file.data.astro.frontmatter.seoExcerpt = prune(
      parts.join('').trim(),
      160,
      '…',
    );
  };
}

// Let the article pipeline handle both Markdown and raw HTML images identically.
export function articleNodes() {
  return (tree) => {
    const definitions = new Map();
    function collect(node) {
      if (node.type === 'definition') definitions.set(node.identifier, node);
      node.children?.forEach(collect);
    }
    collect(tree);
    function visit(node) {
      if (node.type === 'heading')
        node.data = {
          ...node.data,
          hProperties: { 'data-markdown-heading': true },
        };
      if (node.type === 'image' || node.type === 'imageReference') {
        const definition =
          node.type === 'image' ? node : definitions.get(node.identifier);
        if (definition) {
          const image = element('img', {
            src: definition.url,
            alt: node.alt || '',
            ...(definition.title ? { title: definition.title } : {}),
          });
          node.type = 'html';
          node.value = toHtml(image);
        }
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}

export function articleProcessor() {
  return {
    name: 'dev-log-articles',
    options: {},
    async createRenderer(shared) {
      const renderer = await createMarkdownProcessor({
        ...shared,
        syntaxHighlight: false,
        remarkPlugins: [articleNodes, markdownCode, excerpt],
      });
      return {
        async render(content, options) {
          const result = await renderer.render(content, options);
          result.code = await renderMedia(result.code, options.fileURL);
          return result;
        },
      };
    },
  };
}
