import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startPageAnalytics } from './analytics';

// Follows the browser contract: an observer is notified only when the
// visible ratio crosses one of its thresholds or the target starts or stops
// intersecting.
class FakeIntersectionObserver {
  static instances = new Set<FakeIntersectionObserver>();
  private readonly thresholds: number[];
  private readonly previous = new Map<
    Element,
    { thresholdIndex: number; isIntersecting: boolean }
  >();

  constructor(
    private readonly callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {},
  ) {
    this.thresholds = [options.threshold ?? 0].flat();
    FakeIntersectionObserver.instances.add(this);
  }

  observe(target: Element) {
    this.previous.set(target, { thresholdIndex: -1, isIntersecting: false });
  }

  unobserve(target: Element) {
    this.previous.delete(target);
  }

  disconnect() {
    this.previous.clear();
  }

  takeRecords() {
    return [];
  }

  update(target: Element, intersectionRatio: number) {
    const previous = this.previous.get(target);
    if (!previous) {
      return;
    }
    const isIntersecting = intersectionRatio > 0;
    const thresholdIndex = this.thresholds.filter(
      (threshold) => threshold <= intersectionRatio,
    ).length;
    if (
      thresholdIndex === previous.thresholdIndex &&
      isIntersecting === previous.isIntersecting
    ) {
      return;
    }
    this.previous.set(target, { thresholdIndex, isIntersecting });
    this.callback(
      [
        {
          target,
          isIntersecting,
          intersectionRatio,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

let cleanup = () => {};
let hidden = false;

function heading(section: string) {
  const element = document.createElement('h2');
  element.dataset.analyticsSection = section;
  document.body.append(element);
  return element;
}

function showHeading(element: Element, visibleRatio: number) {
  for (const observer of FakeIntersectionObserver.instances) {
    observer.update(element, visibleRatio);
  }
}

function setTabHidden(value: boolean) {
  hidden = value;
  document.dispatchEvent(new Event('visibilitychange'));
}

function sentEvents(eventName: string) {
  return vi
    .mocked(window.gtag!)
    .mock.calls.filter(
      ([command, name]) => command === 'event' && name === eventName,
    )
    .map(([, , parameters]) => parameters as Record<string, unknown>);
}

const viewedSections = () =>
  sentEvents('section_view').map(({ section_name }) => section_name);

beforeEach(() => {
  vi.useFakeTimers();
  hidden = false;
  vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
  window.gtag = vi.fn();
  FakeIntersectionObserver.instances.clear();
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  document.body.innerHTML = '';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete window.gtag;
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

describe('section views', () => {
  it('counts a section once at least half of its heading stays visible for one second', () => {
    const projects = heading('projects');
    cleanup = startPageAnalytics();
    showHeading(projects, 0.2);
    showHeading(projects, 0.49);
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual([]);

    showHeading(projects, 0.5);
    vi.advanceTimersByTime(999);
    expect(viewedSections()).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(sentEvents('section_view')).toEqual([
      expect.objectContaining({ section_name: 'projects' }),
    ]);
  });

  it('restarts the second when the heading leaves the screen before it elapses', () => {
    const projects = heading('projects');
    cleanup = startPageAnalytics();
    showHeading(projects, 1);
    vi.advanceTimersByTime(900);
    showHeading(projects, 0.3);
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual([]);

    showHeading(projects, 1);
    vi.advanceTimersByTime(999);
    expect(viewedSections()).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(viewedSections()).toEqual(['projects']);
  });

  it('counts each section at most once per page', () => {
    const sns = heading('sns');
    const projects = heading('projects');
    cleanup = startPageAnalytics();
    showHeading(sns, 1);
    vi.advanceTimersByTime(1000);
    showHeading(projects, 1);
    vi.advanceTimersByTime(1000);
    expect(viewedSections()).toEqual(['sns', 'projects']);

    showHeading(sns, 0);
    showHeading(projects, 0);
    showHeading(sns, 1);
    showHeading(projects, 1);
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual(['sns', 'projects']);
  });

  it('counts a section only after a full visible second following a background tab', () => {
    const projects = heading('projects');
    cleanup = startPageAnalytics();
    showHeading(projects, 1);
    vi.advanceTimersByTime(900);
    setTabHidden(true);
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual([]);

    setTabHidden(false);
    vi.advanceTimersByTime(999);
    expect(viewedSections()).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(viewedSections()).toEqual(['projects']);
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual(['projects']);
  });

  it('cancels unfinished section measurements when leaving a page', () => {
    const projects = heading('projects');
    cleanup = startPageAnalytics();
    showHeading(projects, 1);
    cleanup();
    vi.advanceTimersByTime(60_000);
    expect(viewedSections()).toEqual([]);
  });
});
