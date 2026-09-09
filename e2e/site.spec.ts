import { test, expect } from './fixtures';

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

test('profile links underline only the current section even while hovering', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  const hero = page.locator('nav.position-absolute');
  const link = hero.getByRole('link', { name: '個人開発', exact: true });
  await expect(link).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await link.hover();
  await expect(link).toHaveCSS('opacity', '0.8');
  await expect(link).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await page.mouse.move(0, 0);
  await expect(link).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await link.click();
  const fixed = page.locator('.fixed-top');
  const selected = fixed.getByRole('link', { name: '個人開発', exact: true });
  await expect(selected).toHaveCSS('border-bottom-color', 'rgb(46, 134, 222)');
  const other = fixed.getByRole('link', { name: '開発経験', exact: true });
  await other.hover();
  await expect(other).toHaveCSS('color', 'rgb(46, 134, 222)');
  await expect(other).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await expect(other).not.toHaveAttribute('aria-current');
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

test('site theme preserves heading colors, table surfaces and skill borders', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  for (const heading of await page.locator('h2, h3').all()) {
    await expect(heading).toHaveCSS('color', 'rgb(26, 32, 44)');
  }
  const badge = page.locator('.badge.border').first();
  await expect(badge).toHaveCSS('border-width', '2px');
  await expect(badge).toHaveCSS('background-color', 'rgb(248, 249, 250)');
  await expect(badge).toHaveCSS('color', 'rgb(33, 37, 41)');
  const cell = page.locator('td').first();
  await expect(cell).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(cell).toHaveCSS('color', 'rgb(33, 37, 41)');
  await expect(page.locator('.text-muted').first()).toHaveCSS(
    'color',
    'rgb(108, 117, 125)',
  );
  const note = page.getByRole('alert');
  await expect(note).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(note).toHaveCSS('color', 'rgb(33, 37, 41)');
  await expect(note).toHaveCSS('border-color', 'rgba(0, 0, 0, 0)');
  await page.goto('2022-08-24-introduction/');
  await expect(page.locator('h1')).toHaveCSS('color', 'rgb(0, 0, 0)');
});

test('profile selection follows manual scrolling in both directions', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.mouse.move(0, 0);
  const hero = page.locator('nav.position-absolute');
  const selected = (label: string) =>
    hero.getByRole('link', { name: label, exact: true });
  const scrollSectionTo = async (id: string, top: number) => {
    await page.locator(`#${id}`).evaluate((element, top) => {
      window.scrollTo({
        top: window.scrollY + element.getBoundingClientRect().top - top,
        behavior: 'instant',
      });
    }, top);
  };

  await scrollSectionTo('projects', 100);
  await expect(selected('リンク')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
  // Both sections remain visible while the project heading crosses the menu.
  await scrollSectionTo('projects', 25);
  await expect(selected('個人開発')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
  await scrollSectionTo('projects', 100);
  await expect(selected('リンク')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
  await expect(selected('個人開発')).toHaveCSS(
    'border-bottom-color',
    'rgba(0, 0, 0, 0)',
  );
  await scrollSectionTo('projects', 0);
  await expect(selected('個人開発')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );

  await scrollSectionTo('experience', 0);
  await expect(selected('開発経験')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
  await scrollSectionTo('experience', 150);
  await expect(selected('個人開発')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(selected('リンク')).toHaveCSS(
    'border-bottom-color',
    'rgb(255, 255, 255)',
  );
});

test('canceling a smooth navigation keeps selection at the visible section', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  const hero = page.locator('nav.position-absolute');
  await hero
    .getByRole('link', { name: '個人開発', exact: true })
    .evaluate((link) => {
      (link as HTMLElement).click();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  await expect(
    hero.getByRole('link', { name: 'リンク', exact: true }),
  ).toHaveCSS('border-bottom-color', 'rgb(255, 255, 255)');
  await expect(
    hero.getByRole('link', { name: '個人開発', exact: true }),
  ).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
});

test('profile selection follows a directly loaded section link', async ({
  page,
}) => {
  await page.goto('./#experience');
  await page.waitForLoadState('networkidle');
  await expect(
    page.locator('nav.position-absolute [aria-current="location"]'),
  ).toHaveText('開発経験');
  await expect(page.locator('.fixed-top [aria-current="location"]')).toHaveText(
    '開発経験',
  );
});

test('profile selection follows resizing and the page bottom', async ({
  page,
}) => {
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.setViewportSize({ width: 1024, height: 1200 });
  // Viewport changes and font loading can move the document after the command
  // returns. Let layout settle before issuing the separate scroll action.
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  });
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  // Confirm the test reached the bottom rather than accepting a stale selection.
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(
          document.documentElement.scrollHeight -
            window.innerHeight -
            window.scrollY,
        ),
      ),
    )
    .toBeLessThanOrEqual(1);
  const currentLink = page.locator(
    'nav.position-absolute [aria-current="location"]',
  );
  await expect(currentLink).toHaveText('開発経験');
  await expect(page.locator('.fixed-top [aria-current="location"]')).toHaveText(
    '開発経験',
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(currentLink).toHaveText('リンク');
});
