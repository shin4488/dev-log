import { stat, utimes } from 'node:fs/promises';
import { resolve } from 'node:path';
import { test, expect } from './fixtures';

for (const route of [
  '',
  'about/',
  'blog/',
  '2022-08-24-introduction/',
  'tags/',
  'tags/gatsby/',
  'tags/個人開発/',
  'tagList/',
]) {
  test(`development route ${route || '/'} renders without diagnostics`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('footer')).toContainText('shin4488');
    await page.waitForLoadState('networkidle');
    await expect(
      page.locator('script[src*="googletagmanager.com"]'),
    ).toHaveCount(0);
  });
}

test('CSS and React hot updates retain the document and working navigation', async ({
  page,
}) => {
  const updates: string[] = [];
  page.on('websocket', (socket) =>
    socket.on('framereceived', ({ payload }) => {
      const message = JSON.parse(String(payload));
      if (message.type === 'update') {
        updates.push(
          ...message.updates.map((update: { path: string }) => update.path),
        );
      }
    }),
  );
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: '個人開発', exact: true }).click();
  await expect(page.locator('.fixed-top')).toBeVisible();
  await page.evaluate(
    () => (document.documentElement.dataset.hmrDocument = 'retained'),
  );
  for (const path of ['src/style.css', 'src/components/HeroSection.tsx']) {
    const file = resolve(path);
    const original = await stat(file);
    await utimes(file, original.atime, new Date());
    await expect
      .poll(() => updates.some((update) => update.endsWith(`/${path}`)))
      .toBe(true);
  }
  await expect(page.locator('html')).toHaveAttribute(
    'data-hmr-document',
    'retained',
  );
  await page
    .locator('.fixed-top')
    .getByRole('link', { name: 'リンク', exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator('#sns')
        .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
    )
    .toBeLessThan(2);
});
