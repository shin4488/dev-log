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
  ['', '自己紹介', 'ja'],
  ['en/', 'About', 'en'],
  ['404/', '404: ページが見つかりません', 'ja'],
  ['404.html', '404: ページが見つかりません', 'ja'],
  ['en/404/', '404: Page not found', 'en'],
];

for (const [route, title, locale] of routes) {
  test(`published route ${
    route || '/'
  } has its content and local assets`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const response = await page.goto(route);
    // Published documents are served successfully, including the explicit 404 page.
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(`${title} | Dev Log`);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
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

test('profile fits narrow screens without horizontal scrolling', async ({
  page,
}) => {
  for (const route of ['./', 'en/']) {
    for (const width of [320, 390, 767, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} profile width at ${width}px`,
      ).toBeLessThanOrEqual(width);
      await page.locator('nav.position-absolute a[href="#projects"]').click();
      await expect(page.locator('.fixed-top')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
        `${route} fixed navigation width at ${width}px`,
      ).toBeLessThanOrEqual(width);
    }
  }
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

test('removed duplicate and publishing routes return 404 and have no profile links', async ({
  request,
  page,
}) => {
  for (const route of [
    'about/',
    'en/about/',
    'about/index.html',
    'en/about/index.html',
    'blog/',
    '2022-08-24-introduction/',
    'tags/',
    'tags/gatsby/',
    'tags/個人開発/',
    'tagList/',
    'rss.xml',
    'media/2026-01-01-media/sample.txt',
  ]) {
    const response = await request.get(route);
    expect(response.status(), route).toBe(404);
  }
  await page.goto('./');
  await expect(
    page.locator('link[rel="alternate"][type="application/rss+xml"]'),
  ).toHaveCount(0);
  await expect(
    page.locator(
      'a[href*="/about/"], a[href*="/blog/"], a[href*="/tags/"], a[href*="/tagList/"]',
    ),
  ).toHaveCount(0);
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
  await page.goto('./');
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
  await expect.poll(views).toEqual(['/dev-log/']);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect.poll(views).toEqual(['/dev-log/', '/dev-log/en/']);
  const latest = await page.evaluate(() =>
    Array.from((window as any).dataLayer)
      .filter((entry: any) => entry[1] === 'page_view')
      .at(-1),
  );
  expect((latest as any)[2]).toMatchObject({
    page_title: 'About | Dev Log',
    page_type: 'about',
    page_location: 'http://127.0.0.1:9000/dev-log/en/',
    page_referrer: 'http://127.0.0.1:9000/dev-log/',
  });
  await page.getByRole('link', { name: '日本語', exact: true }).click();
  await expect.poll(views).toEqual(['/dev-log/', '/dev-log/en/', '/dev-log/']);
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

test('analytics records meaningful section and link interactions on the profile', async ({
  page,
  context,
}) => {
  await context.route('https://github.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<title>Test destination</title>',
    }),
  );
  await page.goto('./');
  const events = (name: string) =>
    page.evaluate(
      (name) =>
        Array.from((window as any).dataLayer || [])
          .filter((entry: any) => entry[0] === 'event' && entry[1] === name)
          .map((entry: any) => entry[2]),
      name,
    );
  await page.getByRole('link', { name: '個人開発', exact: true }).click();
  await expect
    .poll(() => events('section_view'))
    .toContainEqual(
      expect.objectContaining({ section_name: 'projects', page_type: 'about' }),
    );
  const project = page
    .locator('a[data-analytics-event="project_click"]')
    .first();
  // Keep navigation local to the test while exercising the actual link click.
  await project.evaluate((link) =>
    link.addEventListener('click', (event) => event.preventDefault(), {
      once: true,
    }),
  );
  await project.click();
  await expect.poll(() => events('project_click')).toHaveLength(1);
  const profile = page.locator(
    'a[data-analytics-event="profile_click"][title="GitHub"]',
  );
  const popupPromise = page.waitForEvent('popup');
  await profile.click();
  const popup = await popupPromise;
  await popup.close();
  await expect
    .poll(() => events('profile_click'))
    .toContainEqual(expect.objectContaining({ link_name: 'GitHub' }));
  expect(await events('page_view')).toHaveLength(1);
});

test('language switching translates the portfolio and survives reload', async ({
  page,
}) => {
  await page.goto('./');
  const switcher = page.getByRole('navigation', {
    name: '表示言語',
    exact: true,
  });
  await expect(switcher.getByRole('link', { name: '日本語' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await switcher.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/dev-log\/en\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page).toHaveTitle('About | Dev Log');
  await expect(page.locator('#projects h2')).toHaveText('Projects');
  await expect(page.locator('.card')).toHaveCount(9);
  await expect(page.locator('.card').first()).toContainText(
    'Probability Distribution Visualizer',
  );
  await expect(page.locator('#experience')).toContainText('Process Builder');
  await expect(page.locator('#experience')).toContainText(
    'As of September 21, 2025',
  );
  await expect(page.locator('footer')).toContainText(
    'For suggestions about this site',
  );
  // The language control is the only Japanese text on the English page.
  const mainText = await page.locator('main').innerText();
  expect(mainText.replace('日本語', '')).not.toMatch(
    /[\u3040-\u30ff\u3400-\u9fff]/u,
  );
  await page.reload();
  await expect(page.locator('#projects h2')).toHaveText('Projects');
  await page
    .getByRole('navigation', { name: 'Language', exact: true })
    .getByRole('link', { name: '日本語' })
    .click();
  await expect(page).toHaveURL(/\/dev-log\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('#projects h2')).toHaveText('個人開発');
  await expect(page.locator('.card').first()).toContainText(
    '確率分布ビジュアライザー',
  );
});

test('language switching preserves a directly linked section and works with browser history', async ({
  page,
}) => {
  await page.goto('./#experience');
  await page
    .getByRole('navigation', { name: '表示言語', exact: true })
    .getByRole('link', { name: 'English' })
    .click();
  await expect(page).toHaveURL(/\/dev-log\/en\/#experience$/);
  await expect(page.locator('.fixed-top [aria-current="location"]')).toHaveText(
    'Experience',
  );
  await page.getByRole('link', { name: '日本語', exact: true }).click();
  await expect(page).toHaveURL(/\/dev-log\/#experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.locator('#experience h2')).toHaveText('開発経験');
  await page.goBack();
  await expect(page).toHaveURL(/\/dev-log\/en\/#experience$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('#experience h2')).toHaveText('Experience');
});

test('English navigation scrolls and keeps the current section selected', async ({
  page,
}) => {
  await page.goto('en/');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  const fixed = page.locator('.fixed-top');
  await expect(fixed.locator('[aria-current="location"]')).toHaveText(
    'Projects',
  );
  await fixed.getByRole('link', { name: 'Experience', exact: true }).click();
  await expect(fixed.locator('[aria-current="location"]')).toHaveText(
    'Experience',
  );
  await fixed.getByRole('link', { name: 'Links', exact: true }).click();
  await expect
    .poll(() =>
      page
        .locator('#sns')
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
  await expect(
    page.locator('nav.position-absolute [aria-current="location"]'),
  ).toHaveText('Links');
});

test('localized page metadata links to the matching language variants', async ({
  page,
}) => {
  for (const route of ['', 'en/']) {
    await page.goto(route);
    const english = route.startsWith('en/');
    const origin = 'https://shin4488.github.io/dev-log/';
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${origin}${route}`,
    );
    await expect(page.locator('link[hreflang="ja"]')).toHaveAttribute(
      'href',
      origin,
    );
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
      'href',
      `${origin}en/`,
    );
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
      'href',
      origin,
    );
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      'content',
      english ? 'en_US' : 'ja_JP',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      english ? /personal projects/ : /個人開発/,
    );
  }
});

test('404 language controls and home links use the selected language', async ({
  page,
}) => {
  await page.goto('404.html');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/dev-log\/en\/404\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    '404: Page not found',
  );
  await expect(
    page.getByRole('link', { name: 'Back to home' }),
  ).toHaveAttribute('href', '/dev-log/en/');
  await page.getByRole('link', { name: '日本語', exact: true }).click();
  await expect(page).toHaveURL(/\/dev-log\/404\/$/);
  await expect(
    page.getByRole('link', { name: 'トップページへ戻る' }),
  ).toHaveAttribute('href', '/dev-log/');
  await page.getByRole('link', { name: 'トップページへ戻る' }).click();
  await expect(page.locator('#projects h2')).toHaveText('個人開発');
});

test.describe('static localized pages', () => {
  test.use({ javaScriptEnabled: false });

  test('both languages and the switcher are available without JavaScript', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
    await page.getByRole('link', { name: 'English', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#projects h2')).toHaveText('Projects');
    await expect(page.locator('.card').first()).toContainText(
      'Probability Distribution Visualizer',
    );
    await page.getByRole('link', { name: '日本語', exact: true }).click();
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
  });
});

test.describe('browser language preferences', () => {
  test.use({ locale: 'en-US' });

  test('first visit follows the browser and an explicit choice persists across visits', async ({
    page,
    context,
  }) => {
    await page.goto('./');
    await expect(page).toHaveURL(/\/dev-log\/en\/$/);
    await expect(page.locator('#projects h2')).toHaveText('Projects');
    await page.getByRole('link', { name: '日本語', exact: true }).click();
    await expect(page).toHaveURL(/\/dev-log\/$/);
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
    await page.reload();
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
    const nextVisit = await context.newPage();
    await nextVisit.goto('http://127.0.0.1:9000/dev-log/');
    await expect(nextVisit.locator('#projects h2')).toHaveText('個人開発');
    await nextVisit.close();
    await page.getByRole('link', { name: 'English', exact: true }).click();
    await page.goto('./');
    await expect(page).toHaveURL(/\/dev-log\/en\/$/);
  });

  test('automatic language selection preserves a linked section', async ({
    page,
  }) => {
    await page.goto('./#experience');
    await expect(page).toHaveURL(/\/dev-log\/en\/#experience$/);
    await expect(
      page.locator('.fixed-top [aria-current="location"]'),
    ).toHaveText('Experience');
  });

  test('an explicit English URL takes priority over the saved Japanese choice', async ({
    page,
  }) => {
    await page.goto('./');
    await page.getByRole('link', { name: '日本語', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
    await page.goto('en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  });

  test('language switching works when browser storage is blocked', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('Storage is blocked', 'SecurityError');
        },
      });
    });
    await page.goto('./');
    await expect(page).toHaveURL(/\/dev-log\/en\/$/);
    await page.getByRole('link', { name: '日本語', exact: true }).click();
    await expect(page).toHaveURL(/\/dev-log\/\?lang=ja$/);
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
    await page.reload();
    await expect(page.locator('#projects h2')).toHaveText('個人開発');
  });
});

test('a saved English choice takes priority over a Japanese browser', async ({
  page,
}) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await page.goto('./');
  await expect(page).toHaveURL(/\/dev-log\/en\/$/);
  await expect(page.locator('#projects h2')).toHaveText('Projects');
});

test.describe('unsupported browser languages', () => {
  test.use({ locale: 'fr-FR' });

  test('falls back to Japanese when no preferred language is supported', async ({
    page,
  }) => {
    await page.goto('./');
    await expect(page).toHaveURL(/\/dev-log\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  });
});
