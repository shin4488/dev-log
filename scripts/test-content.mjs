import assert from 'node:assert/strict';
import {
  cp,
  mkdtemp,
  readFile,
  readdir,
  mkdir,
  symlink,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import sharp from 'sharp';
import { buildFeed } from './rss.mjs';

const root = process.cwd();
const directory = await mkdtemp(path.join(os.tmpdir(), 'dev-log-content-'));
// Only copy declared public sources; never load developer environment files.
for (const file of [
  'src',
  'content',
  'static',
  'scripts',
  'astro.config.mjs',
  'tsconfig.json',
  'package.json',
]) {
  await cp(path.join(root, file), path.join(directory, file), {
    recursive: true,
  });
}
await mkdir(path.join(directory, 'node_modules'));
for (const name of await readdir(path.join(root, 'node_modules'))) {
  const source = path.join(root, 'node_modules', name);
  const target = path.join(directory, 'node_modules', name);
  if (name === 'astro') await cp(source, target, { recursive: true });
  else await symlink(source, target);
}
await cp(
  path.join(root, 'e2e/fixtures/content'),
  path.join(directory, 'content/blog'),
  { recursive: true },
);
await writeFile(
  path.join(directory, 'content/blog/unlinked-private.txt'),
  'Must never be published',
);
const result = spawnSync(
  process.execPath,
  [path.join(directory, 'node_modules/astro/bin/astro.mjs'), 'build'],
  {
    cwd: directory,
    encoding: 'utf8',
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: '1',
      GOOGLE_ANALYTICS_MEASUREMENT_ID: 'G-TEST',
    },
  },
);
if (result.status !== 0) throw new Error(result.stdout + result.stderr);
const output = path.join(directory, 'dist');
const emitted = await readdir(output, { recursive: true });
assert.ok(
  !emitted.some((file) => file.endsWith('unlinked-private.txt')),
  'unreferenced files must not be published',
);
const html = await readFile(
  path.join(output, '2026-01-01-media/index.html'),
  'utf8',
);
const document = fromHtml(html);
const select = (node, predicate) => [
  ...(predicate(node) ? [node] : []),
  ...(node.children || []).flatMap((child) => select(child, predicate)),
];
const tags = (node, tagName) =>
  select(node, (item) => item.tagName === tagName);
const hasClass = (node, name) => node.properties?.className?.includes(name);
const body = select(document, (node) =>
  node.properties?.itemProp?.includes('articleBody'),
)[0];
assert.ok(body, 'built article body exists');
const images = tags(body, 'img');
assert.equal(images.length, 3);
for (const image of images) {
  assert.ok(hasClass(image, 'gatsby-resp-image-image'));
  assert.equal(image.properties.loading, 'lazy');
  assert.equal(image.properties.sizes, '(max-width: 630px) 100vw, 630px');
  const variants = image.properties.srcSet
    .split(',')
    .map((entry) => entry.trim().split(/\s+/));
  assert.deepEqual(
    variants.map(([, width]) => width),
    ['158w', '315w', '630w', '945w', '1260w'],
  );
  for (const [url, width] of variants) {
    assert.ok(url.startsWith('/dev-log/media/'));
    const bytes = await readFile(
      path.join(output, decodeURIComponent(url.slice('/dev-log/'.length))),
    );
    assert.equal(
      (await sharp(bytes).metadata()).width,
      Number.parseInt(width, 10),
    );
  }
}
const links = tags(body, 'a');
assert.equal(
  links.filter((node) => hasClass(node, 'gatsby-resp-image-link')).length,
  2,
  'linked image must not gain a nested link',
);
for (const link of links.filter((node) =>
  hasClass(node, 'gatsby-resp-image-link'),
)) {
  assert.equal(link.properties.target, '_blank');
  assert.deepEqual(
    await readFile(
      path.join(output, link.properties.href.slice('/dev-log/'.length)),
    ),
    await readFile(
      path.join(root, 'e2e/fixtures/content/2026-01-01-media/wide.png'),
    ),
  );
}
const attachment = links.find(
  (node) => node.children[0]?.value === 'Attachment',
);
assert.deepEqual(
  await readFile(
    path.join(output, attachment.properties.href.slice('/dev-log/'.length)),
  ),
  await readFile(
    path.join(root, 'e2e/fixtures/content/2026-01-01-media/sample.txt'),
  ),
);
assert.ok(links.some((node) => node.properties.href === '/dev-log/about'));
assert.ok(links.every((node) => node.properties.dataAstroReload !== undefined));
assert.equal(tags(body, 'iframe')[0].properties.width, undefined);
assert.ok(
  select(body, (node) => hasClass(node, 'gatsby-resp-iframe-wrapper')).some(
    (node) => node.properties.style.includes('56.25%'),
  ),
);
assert.equal(
  tags(body, 'h2')[0].properties.id,
  undefined,
  'preserve original heading anchor behavior',
);
assert.equal(
  select(body, (node) => hasClass(node, 'gatsby-highlight')).length,
  2,
);
assert.equal(
  select(body, (node) => hasClass(node, 'gatsby-highlight-code-line')).length,
  1,
);
assert.equal(tags(body, 'pre')[0].properties.tabIndex, undefined);
const codeDocument = fromHtml(
  await readFile(path.join(output, '2025-01-01-code/index.html'), 'utf8'),
);
const codeBody = select(codeDocument, (node) =>
  node.properties?.itemProp?.includes('articleBody'),
)[0];
const textContent = (node) =>
  node.type === 'text'
    ? node.value
    : (node.children || []).map(textContent).join('');
assert.ok(textContent(codeBody).includes('<value> & text'));
assert.ok(!textContent(codeBody).includes('const hidden'));
assert.ok(!textContent(codeBody).includes('highlight-next-line'));
assert.ok(textContent(codeBody).includes('const highlighted = 1;'));
assert.ok(
  tags(codeBody, 'pre').some(
    (node) => node.properties.style === 'counter-reset: linenumber 4',
  ),
);
assert.ok(
  select(codeBody, (node) => node.properties?.dataUser === 'editor').length ===
    1,
);
assert.ok(
  tags(codeBody, 'a').some(
    (node) => node.properties.href === '../2026-01-01-media/',
  ),
);
const feed = await readFile(path.join(output, 'rss.xml'), 'utf8');
assert.equal(XMLValidator.validate(feed), true);
const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  trimValues: false,
});
const items = parser.parse(feed).rss.channel.item;
assert.equal(
  items[0].title,
  'Next fixture',
  'sort by full timestamps, not formatted dates',
);
assert.equal(items[1].title, 'Media & <markup> fixture');
assert.equal(items[1].guid['@_isPermaLink'], 'false');
assert.equal(
  items[1].guid['#text'],
  'https://shin4488.github.io/dev-log/2026-01-01-media/',
);
assert.ok(!items[1]['content:encoded'].includes('data-astro-reload'));
assert.ok(!items[1]['content:encoded'].includes('__ASTRO_IMAGE_'));
const special = 'Quotes " & <tag> ]]> 日本語';
const xml = buildFeed(
  [
    {
      frontmatter: { title: special },
      fields: { slug: '/a/' },
      excerpt: special,
      feedHtml: special,
    },
  ],
  { url: 'https://example.com/blog/', description: special },
);
assert.equal(XMLValidator.validate(xml), true);
assert.equal(parser.parse(xml).rss.channel.item['content:encoded'], special);
assert.equal(
  XMLValidator.validate(
    buildFeed([], { url: 'https://example.com/', description: special }),
  ),
  true,
);
await mkdir(path.join(root, 'test-results'), { recursive: true });
await writeFile(path.join(root, 'test-results/content-build-path.txt'), output);
await writeFile(
  path.join(directory, 'outside-content.txt'),
  'Private test value',
);
const boundary = spawnSync(process.execPath, ['--input-type=module'], {
  cwd: directory,
  encoding: 'utf8',
  input: `import assert from 'node:assert/strict';
import { contentAsset } from ${JSON.stringify(
    new URL('./content-assets.mjs', import.meta.url).href,
  )};
await assert.rejects(() => contentAsset('outside-content.txt'), { message: 'Article assets must be inside content/blog' });`,
});
assert.equal(boundary.status, 0, boundary.stderr);
console.log(`Article contracts passed; fixture build: ${output}`);
