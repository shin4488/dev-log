import { test as base, expect } from '@playwright/test';

// Network responses and console locations can differ by a URL fragment.
const requestUrl = (url: string) => url.split('#')[0];

export const test = base.extend<{ browserDiagnostics: void }>({
  browserDiagnostics: [
    async ({ page }, use) => {
      const diagnostics: {
        text: string;
        type?: string;
        url?: string;
        line?: number;
        column?: number;
      }[] = [];
      const visitedDocuments = new Set<string>();
      const notFoundResponses = new Set<string>();
      page.on('framenavigated', (frame) => {
        if (frame === page.mainFrame()) {
          visitedDocuments.add(requestUrl(frame.url()));
        }
      });
      page.on('response', (response) => {
        if (
          response.status() === 404 &&
          response.frame() === page.mainFrame()
        ) {
          notFoundResponses.add(requestUrl(response.url()));
        }
      });
      page.on('pageerror', (error) =>
        diagnostics.push({ text: error.message }),
      );
      page.on('console', (message) => {
        if (['warning', 'error'].includes(message.type())) {
          diagnostics.push({
            text: `${message.type()}: ${message.text()}`,
            type: message.type(),
            url: requestUrl(message.location().url),
            line: message.location().lineNumber,
            column: message.location().columnNumber,
          });
        }
      });
      await use();
      // HTTP errors have no JS source position. Match the response to a URL
      // the main frame visited, including Astro's fetch-based page navigation.
      // Missing assets and application errors must still fail.
      const unexpected = diagnostics.filter(
        (diagnostic) =>
          !(
            diagnostic.type === 'error' &&
            notFoundResponses.has(diagnostic.url || '') &&
            visitedDocuments.has(diagnostic.url || '') &&
            diagnostic.line === 0 &&
            diagnostic.column === 0
          ),
      );
      expect(unexpected, 'Browser warnings and errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
