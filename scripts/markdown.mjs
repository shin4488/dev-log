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

export function localLinks() {
  return (tree) => {
    function visit(node) {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        const href = node.properties.href;
        if (
          href.startsWith('/') &&
          !href.startsWith('//') &&
          !href.startsWith('/dev-log/')
        ) {
          node.properties.href = '/dev-log' + href;
        }
        // Markdown links have always used a normal document navigation.
        node.properties['data-astro-reload'] = true;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
