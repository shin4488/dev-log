import { readFile, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const cache = new Map();
export const contentRoot = path.resolve('content/blog');
const raster = /\.(png|jpe?g|webp|tiff?)$/i;
const digest = (bytes) =>
  createHash('sha256').update(bytes).digest('hex').slice(0, 24);

export async function contentAsset(file) {
  const resolved = await realpath(file);
  if (!resolved.startsWith(contentRoot + path.sep)) {
    throw new Error('Article assets must be inside content/blog');
  }
  const input = await readFile(resolved);
  const hash = digest(input);
  const key = `${resolved}:${hash}`;
  if (!cache.has(key)) cache.set(key, generate(input, resolved, hash));
  return cache.get(key);
}

async function generate(input, file, hash) {
  const name = path.basename(file);
  const artifacts = [{ name: `${hash}/original/${name}`, bytes: input }];
  const url = (name) =>
    '/dev-log/media/' + name.split('/').map(encodeURIComponent).join('/');
  const original = url(artifacts[0].name);
  if (!raster.test(file)) {
    const dimensions = /\.(gif|svg|avif)$/i.test(file)
      ? await sharp(input).metadata()
      : {};
    return {
      original,
      artifacts,
      naturalWidth: dimensions.width,
      naturalHeight: dimensions.pageHeight || dimensions.height,
    };
  }
  const metadata = await sharp(input).metadata();
  const width = metadata.autoOrient.width;
  const height = metadata.autoOrient.height;
  const displayWidth = Math.min(width, 630);
  const widths = [
    ...new Set(
      [0.25, 0.5, 1, 1.5, 2].map((scale) =>
        Math.min(width, Math.round(displayWidth * scale)),
      ),
    ),
  ];
  const variants = await Promise.all(
    widths.map(async (size) => {
      const bytes = await sharp(input)
        .rotate()
        .resize({ width: size })
        .toBuffer();
      const name = `${hash}/${size}/${path.basename(file)}`;
      artifacts.push({ name, bytes });
      return { width: size, url: url(name) };
    }),
  );
  const placeholder = await sharp(input)
    .rotate()
    .resize({ width: 20 })
    .png()
    .toBuffer();
  return {
    original,
    artifacts,
    width: displayWidth,
    ratio: height / width,
    src: variants.find((item) => item.width === displayWidth).url,
    srcset: variants.map((item) => `${item.url} ${item.width}w`).join(',\n'),
    placeholder: `data:image/png;base64,${placeholder.toString('base64')}`,
  };
}

export async function allContentAssets() {
  const { articleProcessor } = await import('./markdown.mjs');
  const renderer = await articleProcessor().createRenderer({});
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(file);
      else if (entry.isFile() && entry.name === 'index.md') {
        const { content, frontmatter } = parseFrontmatter(
          await readFile(file, 'utf8'),
        );
        await renderer.render(content, {
          fileURL: pathToFileURL(file),
          frontmatter,
        });
      }
    }
  }
  await visit(contentRoot);
  const assets = (await Promise.all(cache.values())).flatMap(
    (asset) => asset.artifacts,
  );
  return [...new Map(assets.map((item) => [item.name, item])).values()];
}
