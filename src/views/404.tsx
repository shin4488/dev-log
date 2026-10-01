import * as React from 'react';
import type { PageProps } from '@/lib/types';
import Layout from '@/components/layout';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { isLocale, localeUrl, messages } from '@/lib/i18n';

const NotFoundPage: React.FC<PageProps<never>> = ({
  location,
  locale = 'ja',
}) => {
  const [displayLocale, setDisplayLocale] = React.useState(locale);

  React.useEffect(() => {
    const syncLocale = () => {
      if (document.body.dataset.pageType !== 'not_found') {
        return;
      }
      const preference = document.documentElement.dataset.preferredLocale;
      setDisplayLocale(isLocale(preference) ? preference : locale);
    };
    syncLocale();
    document.addEventListener('astro:page-load', syncLocale);
    return () => document.removeEventListener('astro:page-load', syncLocale);
  }, [locale]);

  const text = messages[displayLocale];
  return (
    <Layout location={location} locale={displayLocale}>
      <div className="bg-primary d-flex justify-content-end p-3 mt-3 rounded">
        <LanguageSwitcher locale={displayLocale} pathname={location.pathname} />
      </div>
      <h1>{text.notFoundTitle}</h1>
      <p>{text.notFoundMessage}</p>
      <a href={localeUrl(displayLocale)}>{text.backHome}</a>
    </Layout>
  );
};

export default NotFoundPage;
