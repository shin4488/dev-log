import path from 'node:path';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { contentAsset } from './content-assets.mjs';

export const element = (tagName, properties, children = []) => ({
  type: 'element',
  tagName,
  properties,
  children,
});

export async function renderMedia(html, fileURL) {
  const tree = fromHtml(html, { fragment: true });
  async function transform(parent, insideLink = false) {
    for (let index = 0; index < (parent.children?.length || 0); index++) {
      const node = parent.children[index];
      if (node.type !== 'element') continue;
      const properties = node.properties;
      if (properties.dataMarkdownHeading !== undefined) {
        delete properties.id;
        delete properties.dataMarkdownHeading;
      }
      const source =
        node.tagName === 'img'
          ? properties.src
          : node.tagName === 'a'
          ? properties.href
          : undefined;
      if (
        typeof source === 'string' &&
        !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(source)
      ) {
        const [pathname] = source.split(/[?#]/);
        if (pathname && !/\.md$/i.test(pathname)) {
          const file = path.resolve(
            path.dirname(fileURLToPath(fileURL)),
            decodeURIComponent(pathname),
          );
          const info = await stat(file).catch((error) => {
            if (error.code === 'ENOENT') return undefined;
            throw error;
          });
          if (!info?.isFile()) {
            await transform(node, insideLink || node.tagName === 'a');
            continue;
          }
          const asset = await contentAsset(file);
          const suffix = source.slice(pathname.length);
          if (node.tagName === 'a') properties.href = asset.original + suffix;
          else if (asset.src) {
            const image = element('img', {
              className: ['gatsby-resp-image-image'],
              alt: properties.alt || '',
              title: properties.title || '',
              src: asset.src,
              srcSet: asset.srcset,
              sizes: `(max-width: ${asset.width}px) 100vw, ${asset.width}px`,
              style:
                'width:100%;height:100%;margin:0;vertical-align:middle;position:absolute;top:0;left:0;',
              loading: 'lazy',
              decoding: 'async',
            });
            let children = [
              element('span', {
                className: ['gatsby-resp-image-background-image'],
                style: `padding-bottom: ${
                  asset.ratio * 100
                }%; position: relative; bottom: 0; left: 0; background-image: url('${
                  asset.placeholder
                }'); background-size: cover; display: block;`,
              }),
              image,
            ];
            if (!insideLink)
              children = [
                element(
                  'a',
                  {
                    className: ['gatsby-resp-image-link'],
                    href: asset.original,
                    style: 'display: block',
                    target: '_blank',
                    rel: ['noopener'],
                  },
                  children,
                ),
              ];
            parent.children[index] = element(
              'span',
              {
                className: ['gatsby-resp-image-wrapper'],
                style: `position: relative; display: block; margin-left: auto; margin-right: auto; max-width: ${asset.width}px; `,
              },
              children,
            );
            continue;
          } else {
            properties.src = asset.original + suffix;
            if (asset.naturalWidth && asset.naturalHeight) {
              properties.width ||= asset.naturalWidth;
              properties.height ||= asset.naturalHeight;
              properties.alt ||= path
                .basename(file, path.extname(file))
                .replace(/[^A-Z0-9]/gi, ' ');
            }
          }
        }
      }
      if (
        node.tagName === 'a' &&
        typeof properties.href === 'string' &&
        /^\/(?!\/|dev-log(?:\/|$))/.test(properties.href)
      )
        properties.href = '/dev-log' + properties.href;
      if (['iframe', 'object'].includes(node.tagName)) {
        const width = Number.parseInt(properties.width, 10);
        const height = Number.parseInt(properties.height, 10);
        if (
          width > 0 &&
          Number.isFinite(height) &&
          !String(properties.width).endsWith('%') &&
          !String(properties.height).endsWith('%')
        ) {
          delete properties.width;
          delete properties.height;
          properties.style = `${
            properties.style || ''
          } position: absolute; top: 0; left: 0; width: 100%; height: 100%; `;
          parent.children[index] = element(
            'div',
            {
              className: ['gatsby-resp-iframe-wrapper'],
              style: `padding-bottom: ${
                (height / width) * 100
              }%; position: relative; height: 0; overflow: hidden; margin-bottom: 1.0725rem`,
            },
            [node],
          );
        }
      }
      await transform(node, insideLink || node.tagName === 'a');
    }
  }
  await transform(tree);
  return toHtml(tree);
}

/** Navigation policy belongs to the page, not the syndicated article HTML. */
export function pageArticle(html) {
  const tree = fromHtml(html, { fragment: true });
  function visit(node) {
    if (node.tagName === 'a') node.properties.dataAstroReload = true;
    node.children?.forEach(visit);
  }
  visit(tree);
  return toHtml(tree);
}
