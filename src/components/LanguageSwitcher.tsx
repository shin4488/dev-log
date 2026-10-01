import { languageUrl, locales, messages, type Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  locale: Locale;
  pathname: string;
}

export default function LanguageSwitcher({
  locale,
  pathname,
}: LanguageSwitcherProps) {
  return (
    <nav aria-label={messages[locale].language} className="language-switcher">
      <div className="btn-group btn-group-sm">
        {locales.map((language) => (
          <a
            key={language}
            href={languageUrl(pathname, language)}
            lang={language}
            data-language={language}
            hrefLang={language}
            aria-current={language === locale ? 'page' : undefined}
            className={`btn ${language === locale ? 'btn-light' : 'btn-outline-light'}`}
          >
            {language === 'ja' ? '日本語' : 'English'}
          </a>
        ))}
      </div>
    </nav>
  );
}
