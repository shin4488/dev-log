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

export const salesforceNotes = [
  '※Salesforceに関して',
  'Apex...JavaライクなSalesforce独自のプログラミング言語',
  'Lightning Web Component...Vue.jsライクなSalesforce独自のUIフレームワーク',
];

// 開発経験の更新日
export const experienceUpdatedDate = '2025/09/21';

export { type SkillLevel };
