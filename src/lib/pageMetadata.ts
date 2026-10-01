import { localeUrl, locales, messages, type Locale } from './i18n';
import { site } from './site';

interface PageMetadataOptions {
  title: string;
  locale: Locale;
  description?: string;
  pagePath?: string;
}

// Server rendering and client-side language changes use the same definitions.
export function createPageMetadata({
  title,
  locale,
  description = messages[locale].description,
  pagePath = '/',
}: PageMetadataOptions) {
  const canonicalUrl = new URL(localeUrl(locale, pagePath), site.url).href;
  return {
    lang: locale,
    title: `${title} | ${site.title}`,
    canonicalUrl,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      {
        property: 'og:image',
        content: `${site.url}static/my-profile-image-564c5fa176a060003203d7276dbcce81.png`,
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:locale', content: locale === 'ja' ? 'ja_JP' : 'en_US' },
      {
        property: 'og:locale:alternate',
        content: locale === 'ja' ? 'en_US' : 'ja_JP',
      },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:creator', content: site.twitter },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ],
    alternates: [...locales, 'x-default' as const].map((language) => ({
      language,
      url: new URL(
        localeUrl(language === 'x-default' ? 'ja' : language, pagePath),
        site.url,
      ).href,
    })),
  };
}

export function applyPageMetadata(
  metadata: ReturnType<typeof createPageMetadata>,
) {
  document.documentElement.lang = metadata.lang;
  document.title = metadata.title;
  for (const tag of metadata.meta) {
    const attribute = tag.name ? 'name' : 'property';
    const value = tag.name ?? tag.property;
    document.head
      .querySelector(`meta[${attribute}="${value}"]`)
      ?.setAttribute('content', tag.content);
  }
  document.head
    .querySelector('link[rel="canonical"]')
    ?.setAttribute('href', metadata.canonicalUrl);
  for (const { language, url } of metadata.alternates) {
    document.head
      .querySelector(`link[rel="alternate"][hreflang="${language}"]`)
      ?.setAttribute('href', url);
  }
}
