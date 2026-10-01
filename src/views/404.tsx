import * as React from 'react';
import type { PageProps } from '@/lib/types';
import Layout from '@/components/layout';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { localeUrl, messages } from '@/lib/i18n';

const NotFoundPage: React.FC<PageProps<never>> = ({
  location,
  locale = 'ja',
}) => {
  const text = messages[locale];
  return (
    <Layout location={location} locale={locale}>
      <div className="bg-primary d-flex justify-content-end p-3 mt-3 rounded">
        <LanguageSwitcher locale={locale} pathname={location.pathname} />
      </div>
      <h1>{text.notFoundTitle}</h1>
      <p>{text.notFoundMessage}</p>
      <a href={localeUrl(locale)}>{text.backHome}</a>
    </Layout>
  );
};

export default NotFoundPage;
