import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { getSalesforceNotes, getSkillLevels } from '@/data/skillLevel';
import SkillSection from './SkillSection';

vi.mock('@/data/skillLevel', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/data/skillLevel')>()),
  experienceUpdatedDate: '2024/01/05',
}));

describe('SkillSection', () => {
  it('日本語では更新日を「YYYY/MM/DD 現在」と表示する', () => {
    render(<SkillSection locale="ja" />);

    expect(screen.getByText('2024/01/05 現在')).toBeInTheDocument();
  });

  it('英語では更新日を月名・日・年の順に表示する', () => {
    render(<SkillSection locale="en" />);

    expect(screen.getByText('As of January 5, 2024')).toBeInTheDocument();
  });

  it('セクションタイトルが表示される', () => {
    render(<SkillSection locale="ja" />);

    expect(
      screen.getByText('業務で扱ってきた主な技術スタック'),
    ).toBeInTheDocument();
  });

  it('すべての技術を表示する', () => {
    render(<SkillSection locale="ja" />);

    for (const { skills } of getSkillLevels('ja')) {
      for (const skill of skills) {
        expect(screen.getByText(skill)).toBeInTheDocument();
      }
    }
  });

  it('レベルごとに5個の星を並べ、レベルの数だけ黄色、残りを灰色にする', () => {
    render(<SkillSection locale="ja" />);

    // 黄色の星を★、灰色の星を☆に置き換え、表示順に5個ずつ区切る。
    const stars = screen
      .getAllByText('★')
      .map((star) =>
        star.classList.contains('text-warning')
          ? '★'
          : star.classList.contains('text-muted')
            ? '☆'
            : '?',
      )
      .join('');
    expect(stars.match(/.{1,5}/gu)).toEqual(
      getSkillLevels('ja').map(
        ({ level }) => '★'.repeat(level) + '☆'.repeat(5 - level),
      ),
    );
  });

  it('Salesforceの注釈をすべて順に表示する', () => {
    render(<SkillSection locale="ja" />);

    expect(screen.getByRole('alert').textContent).toBe(
      getSalesforceNotes('ja').join(''),
    );
  });
});
