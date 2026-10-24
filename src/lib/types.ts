import type { Locale } from './i18n';

export interface PageProps {
  location: { pathname: string };
  locale: Locale;
}
