import {
  languageUrl,
  languagePreferenceKey,
  locales,
  messages,
  type Locale,
} from '@/lib/i18n';

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
            hrefLang={language}
            aria-current={language === locale ? 'page' : undefined}
            className={`btn ${language === locale ? 'btn-light' : 'btn-outline-light'}`}
            onClick={(event) => {
              const url = new URL(
                languageUrl(pathname, language),
                window.location.origin,
              );
              url.hash = window.location.hash;
              try {
                window.localStorage.setItem(languagePreferenceKey, language);
              } catch {
                // An explicit URL choice still works when browser storage is blocked.
                url.searchParams.set('lang', language);
              }
              event.currentTarget.href = url.href;
            }}
          >
            {language === 'ja' ? '日本語' : 'English'}
          </a>
        ))}
      </div>
    </nav>
  );
}
