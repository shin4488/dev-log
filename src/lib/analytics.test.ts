import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { startPageAnalytics } from './analytics';

const observers: {
  callback: ConstructorParameters<typeof IntersectionObserver>[0];
  targets: Element[];
}[] = [];
let cleanup = () => {};
let hidden = false;

function intersect(index: number, visible: boolean) {
  const observer = observers[index];
  observer.callback(
    observer.targets.map((target) => ({
      target,
      isIntersecting: visible,
      intersectionRatio: visible ? 1 : 0,
    })) as IntersectionObserverEntry[],
    {} as IntersectionObserver,
  );
}

beforeEach(() => {
  vi.useFakeTimers();
  hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  window.gtag = vi.fn();
  observers.length = 0;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      record: (typeof observers)[number];
      constructor(
        callback: ConstructorParameters<typeof IntersectionObserver>[0],
      ) {
        this.record = { callback, targets: [] };
        observers.push(this.record);
      }
      observe(target: Element) {
        this.record.targets.push(target);
      }
      disconnect() {}
    },
  );
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete window.gtag;
});

it('does not collect without the production tag', () => {
  delete window.gtag;
  cleanup = startPageAnalytics();
  expect(observers).toHaveLength(0);
});

it('counts nested project and middle-button profile clicks without collecting destination queries', () => {
  document.body.innerHTML =
    '<a href="https://example.com/app?token=private#section" data-analytics-event="project_click" data-analytics-name="制作物"><span>開く</span></a><a href="https://example.com/profile" data-analytics-event="profile_click" data-analytics-name="GitHub">GitHub</a>';
  cleanup = startPageAnalytics();
  document
    .querySelector('span')!
    .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  document
    .querySelectorAll('a')[1]
    .dispatchEvent(new MouseEvent('auxclick', { bubbles: true, button: 1 }));
  expect(window.gtag).toHaveBeenCalledWith(
    'event',
    'project_click',
    expect.objectContaining({
      link_name: '制作物',
      link_url: 'https://example.com/app',
    }),
  );
  expect(window.gtag).toHaveBeenCalledWith(
    'event',
    'profile_click',
    expect.objectContaining({ link_name: 'GitHub' }),
  );
  cleanup();
  vi.mocked(window.gtag!).mockClear();
  document
    .querySelector('span')!
    .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  expect(window.gtag).not.toHaveBeenCalled();
});

it('counts a section only after a continuous visible second, once per page', () => {
  document.body.innerHTML =
    '<h2 data-analytics-section="projects">個人開発</h2>';
  cleanup = startPageAnalytics();
  intersect(0, true);
  vi.advanceTimersByTime(900);
  intersect(0, false);
  vi.advanceTimersByTime(1000);
  expect(window.gtag).toHaveBeenCalledTimes(1); // page_view only
  intersect(0, true);
  vi.advanceTimersByTime(1000);
  intersect(0, false);
  intersect(0, true);
  vi.advanceTimersByTime(2000);
  expect(window.gtag).toHaveBeenCalledTimes(2);
  expect(window.gtag).toHaveBeenLastCalledWith(
    'event',
    'section_view',
    expect.objectContaining({ section_name: 'projects' }),
  );
});

it('requires the article end and 30 visible seconds, excluding time in the background', () => {
  document.body.innerHTML = '<div data-analytics-article-end></div>';
  cleanup = startPageAnalytics();
  vi.advanceTimersByTime(20_000);
  hidden = true;
  document.dispatchEvent(new Event('visibilitychange'));
  vi.advanceTimersByTime(60_000);
  hidden = false;
  document.dispatchEvent(new Event('visibilitychange'));
  vi.advanceTimersByTime(10_000);
  expect(window.gtag).toHaveBeenCalledTimes(1);
  intersect(1, true);
  expect(window.gtag).toHaveBeenLastCalledWith(
    'event',
    'article_read',
    expect.any(Object),
  );
  vi.advanceTimersByTime(60_000);
  expect(window.gtag).toHaveBeenCalledTimes(2);
});

it('cancels unfinished visibility and reading measurements when leaving a page', () => {
  document.body.innerHTML =
    '<h2 data-analytics-section="projects">個人開発</h2><div data-analytics-article-end></div>';
  cleanup = startPageAnalytics();
  intersect(0, true);
  intersect(1, true);
  cleanup();
  vi.advanceTimersByTime(60_000);
  expect(window.gtag).toHaveBeenCalledTimes(1);
});
