import type { Locale, LocalizedText } from '@/lib/i18n';

interface SkillLevel {
  level: 1 | 2 | 3 | 4 | 5;
  skills: string[];
}

export const skillLevels: SkillLevel[] = [
  {
    level: 4,
    skills: [
      'Salesforce',
      'Apex',
      'Lightning Web Component',
      'Aura Component',
      'Visualforce',
      'プロセスビルダー',
      'フロー',
      '第2世代管理パッケージ',
    ],
  },
  {
    level: 3,
    skills: ['Node.js', 'TypeScript'],
  },
  {
    level: 2,
    skills: ['C#', 'Vue.js', 'Ruby on Rails'],
  },
  {
    level: 1,
    skills: [
      'Google Cloud',
      'BigQuery',
      'Terraform',
      'GitHub Actions',
      'SQL Server',
      'Jenkins',
      'Datadog',
      'Redis',
    ],
  },
];

const salesforceNotes: LocalizedText[] = [
  { ja: '※Salesforceに関して', en: 'About Salesforce' },
  {
    ja: 'Apex...JavaライクなSalesforce独自のプログラミング言語',
    en: 'Apex: Salesforce’s Java-like programming language.',
  },
  {
    ja: 'Lightning Web Component...Vue.jsライクなSalesforce独自のUIフレームワーク',
    en: 'Lightning Web Component: Salesforce’s UI framework, similar to Vue.js.',
  },
];

const englishSkillNames: Record<string, string> = {
  プロセスビルダー: 'Process Builder',
  フロー: 'Flow',
  第2世代管理パッケージ: 'Second-generation managed packages',
};

export function getSkillLevels(locale: Locale): SkillLevel[] {
  return skillLevels.map((group) => ({
    ...group,
    skills: group.skills.map((skill) =>
      locale === 'en' ? (englishSkillNames[skill] ?? skill) : skill,
    ),
  }));
}

export function getSalesforceNotes(locale: Locale) {
  return salesforceNotes.map((note) => note[locale]);
}

// 開発経験の更新日
export const experienceUpdatedDate = '2025/09/21';

export { type SkillLevel };
