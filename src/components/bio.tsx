import * as React from 'react';
import { messages, type Locale } from '@/lib/i18n';

const Bio: React.FC<{ locale?: Locale }> = ({ locale = 'ja' }) => {
  const text = messages[locale];
  return (
    <div>
      <div>
        {text.feedbackBefore}
        <a
          href="https://github.com/shin4488/dev-log/issues"
          target="_blank"
          rel="noopener noreferrer"
        >
          Issues
        </a>
        {text.feedbackAfter}
      </div>
    </div>
  );
};

export default Bio;
