import { basePath, localUrl } from './site';

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export const languagePreferenceKey = 'dev-log.language';

export function isLocale(value: unknown): value is Locale {
  return locales.some((locale) => locale === value);
}

export const messages = {
  ja: {
    pageTitle: '自己紹介',
    description:
      'shin4488のポートフォリオ。個人開発の制作物と開発経験を紹介します。',
    language: '表示言語',
    sections: { sns: 'リンク', projects: '個人開発', experience: '開発経験' },
    profileImage: 'shin4488のプロフィール画像',
    technologies: '使用技術',
    summary: '概要',
    technicalHighlights: '技術アピール',
    experienceTitle: '業務で扱ってきた主な技術スタック',
    updated: (date: string) => `${date} 現在`,
    feedbackBefore: 'このサイトへのご要望は、GitHubの',
    feedbackAfter: 'にお寄せください。',
    notFoundTitle: '404: ページが見つかりません',
    notFoundMessage: 'お探しのページは見つかりませんでした。',
    backHome: 'トップページへ戻る',
  },
  en: {
    pageTitle: 'About',
    description:
      "shin4488's portfolio, featuring personal projects and professional development experience.",
    language: 'Language',
    sections: {
      sns: 'Links',
      projects: 'Personal Projects',
      experience: 'Experience',
    },
    profileImage: "shin4488's profile picture",
    technologies: 'Technologies',
    summary: 'Overview',
    technicalHighlights: 'Technical highlights',
    experienceTitle: 'Technologies I have used professionally',
    updated: (date: string) => {
      const [year, month, day] = date.split('/').map(Number);
      const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(Date.UTC(year, month - 1, day)));
      return `As of ${formatted}`;
    },
    feedbackBefore: 'For suggestions about this site, please open an issue on ',
    feedbackAfter: '.',
    notFoundTitle: '404: Page not found',
    notFoundMessage: 'The page you are looking for could not be found.',
    backHome: 'Back to home',
  },
};

export function navigationItems(locale: Locale) {
  return (['sns', 'projects', 'experience'] as const).map((id) => ({
    id,
    label: messages[locale].sections[id],
  }));
}

// Content paths are relative to the site root; assets continue to use localUrl.
export function localeUrl(locale: Locale, path = '/') {
  return localUrl(`${locale === 'en' ? '/en' : ''}${path}`);
}

export function languageUrl(pathname: string, locale: Locale) {
  const path =
    pathname.slice(basePath.length).replace(/^\/en(?=\/|$)/, '') || '/';
  return localeUrl(locale, path === '/404.html' ? '/404/' : path);
}
