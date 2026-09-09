import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [
    async ({ page }, use) => {
      const diagnostics: string[] = [];
      page.on('pageerror', (error) => diagnostics.push(error.message));
      page.on('console', (message) => {
        if (['warning', 'error'].includes(message.type())) {
          diagnostics.push(`${message.type()}: ${message.text()}`);
        }
      });
      await use();
      expect(diagnostics, 'Browser warnings and errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
