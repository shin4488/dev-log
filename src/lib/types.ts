import type { Locale } from './i18n';

export interface PageProps<T = unknown> {
  location: { pathname: string };
  data: T;
  locale?: Locale;
}
