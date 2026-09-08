import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '' }),
  );
  await page.route('https://**.google-analytics.com/**', (route) =>
    route.abort(),
  );
});

const routes = [
  ['', 'About'],
  ['about/', 'About'],
  ['blog/', 'Blog'],
  ['2022-08-24-introduction/', '自己紹介ページを作成しました'],
  ['tags/', 'Tags'],
  ['tags/gatsby/', 'Blog'],
  ['tags/個人開発/', 'Blog'],
  ['tagList/', 'Tags'],
  ['404/', '404: Not Found'],
  ['404.html', '404: Not Found'],
];

for (const [route, title] of routes) {
  test(`published route ${
    route || '/'
  } has its content and local assets`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    // Published documents are served successfully, including the explicit 404 page.
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${title} | Dev Log`);
    await expect(page.locator('footer')).toContainText('shin4488');
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
    expect(
      await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter(
              (image) =>
                new URL(image.src).origin === location.origin &&
                (!image.complete || !image.naturalWidth),
            )
            .map((image) => image.src),
        ),
    ).toEqual([]);
  });
}

test('profile navigation scrolls, fixes the menu, and updates its active state', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '個人開発', exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator('#projects')
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
  const fixed = page.locator('.fixed-top');
  await expect(fixed).toBeVisible();
  await expect(fixed.getByRole('link', { name: '個人開発' })).toHaveCSS(
    'color',
    'rgb(46, 134, 222)',
  );
  await fixed.getByRole('link', { name: 'リンク', exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator('#sns')
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
});

test('profile links retain their underline on selection and clear hover on exit', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  const hero = page.locator('nav.position-absolute');
  const link = hero.getByRole('link', { name: '個人開発', exact: true });
  await expect(link).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await link.hover();
  await expect(link).toHaveCSS('border-bottom-color', 'rgb(255, 255, 255)');
  await page.mouse.move(0, 0);
  await expect(link).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await link.click();
  const fixed = page.locator('.fixed-top');
  const selected = fixed.getByRole('link', { name: '個人開発', exact: true });
  await expect(selected).toHaveCSS('border-bottom-color', 'rgb(46, 134, 222)');
  const other = fixed.getByRole('link', { name: '開発経験', exact: true });
  await other.hover();
  await expect(other).toHaveCSS('border-bottom-color', 'rgb(46, 134, 222)');
  await page.mouse.move(0, 0);
  await expect(other).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await expect(selected).toHaveCSS('border-bottom-color', 'rgb(46, 134, 222)');
  await expect(link).toHaveCSS('border-bottom-color', 'rgb(255, 255, 255)');
});

test('blog, tag and article links retain their URLs and back navigation', async ({
  page,
}) => {
  await page.goto('blog/');
  await expect(page.getByRole('link', { name: '#gatsby' })).toHaveAttribute(
    'href',
    '/dev-log/tags/gatsby/',
  );
  await page.getByRole('link', { name: '#gatsby' }).click();
  await expect(page).toHaveURL(/\/tags\/gatsby\/$/);
  await page
    .getByRole('link', { name: '自己紹介ページを作成しました' })
    .click();
  await expect(page.locator('[itemprop="articleBody"]')).toContainText(
    '社会人になってから',
  );
  await expect(page.getByRole('link', { name: 'こちら' })).toHaveAttribute(
    'href',
    '/dev-log/about',
  );
  await expect(page.locator('article header')).toContainText(
    '作成日：2022/08/24',
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/tags\/gatsby\/$/);
});

test('RSS retains the item identity, excerpt, and full article', async ({
  page,
  request,
}) => {
  const response = await request.get('rss.xml');
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  await page.goto('./');
  const feed = await page.evaluate((xml) => {
    const document = new DOMParser().parseFromString(xml, 'application/xml');
    const item = [...document.querySelectorAll('item')].find(
      (item) =>
        item.querySelector('guid')?.textContent ===
        'https://shin4488.github.io/dev-log/2022-08-24-introduction/',
    )!;
    return {
      title: document.querySelector('channel > title')?.textContent,
      count: document.querySelectorAll('item').length,
      guid: item.querySelector('guid')?.textContent,
      permalink: item.querySelector('guid')?.getAttribute('isPermaLink'),
      excerpt: item.querySelector('description')?.textContent,
      content: item.getElementsByTagNameNS(
        'http://purl.org/rss/1.0/modules/content/',
        'encoded',
      )[0]?.textContent,
    };
  }, xml);
  expect(feed.title).toBe('Dev Log RSS Feed');
  expect(feed.count).toBeGreaterThanOrEqual(1);
  expect(feed.guid).toBe(
    'https://shin4488.github.io/dev-log/2022-08-24-introduction/',
  );
  expect(feed.permalink).toBe('false');
  expect(feed.excerpt).toBe(
    '社会人になってから、個人開発でサービス公開を年に1回のペースで行ってきました。…',
  );
  expect(feed.content).toContain('<a href="/dev-log/about">こちら</a>');
});

test('manifest icons and social preview image remain available', async ({
  request,
  page,
}) => {
  const manifest = await (await request.get('manifest.webmanifest')).json();
  expect(manifest).toMatchObject({
    name: 'Dev Log',
    short_name: 'Dev Log',
    start_url: '/dev-log/',
    background_color: '#ffffff',
    display: 'minimal-ui',
  });
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual([
    '48x48',
    '72x72',
    '96x96',
    '144x144',
    '192x192',
    '256x256',
    '384x384',
    '512x512',
  ]);
  for (const icon of manifest.icons)
    expect((await request.get(icon.src)).ok()).toBeTruthy();
  await page.goto('./');
  const og = await page
    .locator('meta[property="og:image"]')
    .getAttribute('content');
  expect(og).toBe(
    'https://shin4488.github.io/dev-log/static/my-profile-image-564c5fa176a060003203d7276dbcce81.png',
  );
  expect((await request.get(new URL(og!).pathname)).ok()).toBeTruthy();
});

test('analytics sends one page view for initial load and each internal navigation', async ({
  page,
}) => {
  await page.goto('blog/');
  const views = () =>
    page.evaluate(() =>
      Array.from((window as any).dataLayer || [])
        .filter(
          (entry: any) => entry[0] === 'event' && entry[1] === 'page_view',
        )
        .map((entry: any) => entry[2].page_path),
    );
  await expect(
    page.locator('script[src*="googletagmanager.com/gtag/js"]'),
  ).toHaveCount(1);
  await expect.poll(views).toEqual(['/dev-log/blog/']);
  await page.getByRole('link', { name: '#gatsby' }).click();
  await expect.poll(views).toEqual(['/dev-log/blog/', '/dev-log/tags/gatsby/']);
});

test('F1C icon is served locally even when the F1C site is unavailable', async ({
  page,
}) => {
  await page.route('https://f1c.biz/**', (route) => route.abort());
  await page.goto('./');
  const image = page.locator('a[href="https://f1c.biz"] img');
  await expect(image).toBeVisible();
  const state = await image.evaluate((image) => ({
    local: new URL((image as HTMLImageElement).src).origin === location.origin,
    width: (image as HTMLImageElement).naturalWidth,
    height: (image as HTMLImageElement).naturalHeight,
  }));
  expect(state).toEqual({ local: true, width: 600, height: 600 });
});
