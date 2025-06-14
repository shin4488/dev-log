interface SkillLevel {
  level: number;
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
    skills: ['C#', 'Vue.js'],
  },
  {
    level: 1,
    skills: ['SQL Server', 'Jenkins', 'Ruby on Rails', 'Datadog', 'Redis'],
  },
];

export const salesforceNotes = [
  '※Salesforceに関して',
  'Apex...JavaライクなSalesforce独自のプログラミング言語',
  'Lightning Web Component...Vue.jsライクなSalesforce独自のUIフレームワーク',
];

// 開発経験の更新日
export const experienceUpdatedDate = '2023/10/28';

export { type SkillLevel };
