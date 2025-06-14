import * as React from 'react';
import { render, screen } from '@testing-library/react';
import SkillSection from './SkillSection';

// skillLevel.tsのモック
jest.mock('@/data/skillLevel', () => ({
  experienceUpdatedDate: '2023/10/28',
  skillLevels: [
    { level: 4, skills: ['Salesforce', 'Apex'] },
    { level: 3, skills: ['Node.js', 'TypeScript'] },
    { level: 2, skills: ['C#', 'Vue.js'] },
  ],
  salesforceNotes: [
    '※Salesforceに関して',
    'Apex...JavaライクなSalesforce独自のプログラミング言語',
  ],
}));

describe('SkillSection', () => {
  it('更新日が表示される', () => {
    render(<SkillSection />);

    expect(screen.getByText('2023/10/28 現在')).toBeInTheDocument();
  });

  it('セクションタイトルが表示される', () => {
    render(<SkillSection />);

    expect(
      screen.getByText('業務で扱ってきた主な技術スタック'),
    ).toBeInTheDocument();
  });

  it('スキルが表示される', () => {
    render(<SkillSection />);

    expect(screen.getByText('Salesforce')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Vue.js')).toBeInTheDocument();
  });

  it('星の数が正しく表示される', () => {
    render(<SkillSection />);

    // 星が表示されることを確認
    const stars = screen.getAllByText('★');
    expect(stars.length).toBeGreaterThan(0);

    // 黄色い星（レベル表示）が存在することを確認
    const yellowStars = stars.filter((star) =>
      star.classList.contains('text-warning'),
    );
    expect(yellowStars.length).toBeGreaterThan(0);
  });

  it('Salesforce注釈が表示される', () => {
    render(<SkillSection />);

    expect(screen.getByText('※Salesforceに関して')).toBeInTheDocument();
    expect(
      screen.getByText('Apex...JavaライクなSalesforce独自のプログラミング言語'),
    ).toBeInTheDocument();
  });

  it('スキルバッジが正しく表示される', () => {
    render(<SkillSection />);

    const salesforceBadge = screen.getByText('Salesforce');
    expect(salesforceBadge).toHaveClass('badge');
    expect(salesforceBadge).toHaveClass('bg-light');
  });

  it('空の星（グレー）が表示される', () => {
    render(<SkillSection />);

    const stars = screen.getAllByText('★');
    const grayStars = stars.filter((star) =>
      star.classList.contains('text-muted'),
    );
    expect(grayStars.length).toBeGreaterThan(0);
  });
});
