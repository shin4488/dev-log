type EventParameters = Record<string, string | number>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

let previousPage: string | undefined;

// Astro のページ差し替えごとに、表示判定と時間の計測を作り直す。
export function startPageAnalytics(): () => void {
  if (!window.gtag) {
    return () => {};
  }

  const context = {
    page_path: location.pathname,
    page_location: location.href.split('#')[0],
    page_title: document.title,
    page_referrer: previousPage ?? document.referrer,
    page_type: document.body.dataset.pageType || 'other',
  };
  const send = (event: string, parameters: EventParameters = {}) => {
    window.gtag?.('event', event, { ...context, ...parameters });
  };
  send('page_view');
  previousPage = context.page_location;

  const onClick = (event: MouseEvent) => {
    if (event.type === 'auxclick' && event.button !== 1) {
      return;
    }
    const target = event.target;
    const link =
      target instanceof Element
        ? target.closest<HTMLAnchorElement>('a[data-analytics-event]')
        : null;
    const eventName = link?.dataset.analyticsEvent;
    if (
      !link ||
      !['project_click', 'profile_click'].includes(eventName || '')
    ) {
      return;
    }
    const url = new URL(link.href);
    send(eventName!, {
      link_name: link.dataset.analyticsName || '',
      link_url: url.origin + url.pathname,
    });
  };
  document.addEventListener('click', onClick);
  document.addEventListener('auxclick', onClick);

  // 見出しの半分以上が画面に1秒間表示されたら、各欄につき1回記録する。
  const seen = new Set<Element>();
  const visible = new Set<Element>();
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const schedule = (element: Element) => {
    if (document.hidden || seen.has(element) || timers.has(element)) {
      return;
    }
    timers.set(
      element,
      setTimeout(() => {
        timers.delete(element);
        if (document.hidden || !visible.has(element)) {
          return;
        }
        seen.add(element);
        send('section_view', {
          section_name: (element as HTMLElement).dataset.analyticsSection || '',
        });
      }, 1000),
    );
  };
  const cancel = (element: Element) => {
    clearTimeout(timers.get(element));
    timers.delete(element);
  };
  const sections = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          visible.add(entry.target);
          schedule(entry.target);
        } else {
          visible.delete(entry.target);
          cancel(entry.target);
        }
      }
    },
    { threshold: 0.5 },
  );
  document
    .querySelectorAll('[data-analytics-section]')
    .forEach((element) => sections.observe(element));

  // 「読了」の断定ではなく、本文末尾到達＋表示中の累計30秒という目安。
  const articleEnd = document.querySelector('[data-analytics-article-end]');
  let endReached = false;
  let readSent = false;
  let visibleTime = 0;
  let lastTick = performance.now();
  let wasVisible = !document.hidden;
  const checkRead = () => {
    const now = performance.now();
    if (wasVisible) {
      visibleTime += now - lastTick;
    }
    lastTick = now;
    wasVisible = !document.hidden;
    if (
      articleEnd &&
      !document.hidden &&
      endReached &&
      visibleTime >= 30_000 &&
      !readSent
    ) {
      readSent = true;
      send('article_read');
    }
  };
  const article = new IntersectionObserver((entries) => {
    if (!document.hidden && entries.some((entry) => entry.isIntersecting)) {
      endReached = true;
      checkRead();
    }
  });
  if (articleEnd) {
    article.observe(articleEnd);
  }
  const interval = articleEnd ? setInterval(checkRead, 1000) : undefined;
  const onVisibility = () => {
    checkRead();
    for (const element of visible) {
      cancel(element);
      if (!document.hidden) {
        schedule(element);
      }
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('auxclick', onClick);
    document.removeEventListener('visibilitychange', onVisibility);
    sections.disconnect();
    article.disconnect();
    timers.forEach(clearTimeout);
    clearInterval(interval);
  };
}
