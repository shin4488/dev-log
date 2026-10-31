import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  const mockOnNavClick = vi.fn();

  const renderHeroSection = (activeSection: string) =>
    render(
      <HeroSection
        activeSection={activeSection}
        onNavClick={mockOnNavClick}
        locale="ja"
        pathname="/dev-log/ja/"
      />,
    );

  beforeEach(() => {
    mockOnNavClick.mockClear();
  });

  it('プロフィール画像が表示される', () => {
    renderHeroSection('sns');

    const profileImage = screen.getByAltText('shin4488のプロフィール画像');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src');
  });

  it('ナビゲーションアイテムが表示される', () => {
    renderHeroSection('sns');

    expect(screen.getByText('リンク')).toBeInTheDocument();
    expect(screen.getByText('個人開発')).toBeInTheDocument();
    expect(screen.getByText('開発経験')).toBeInTheDocument();
  });

  it('ナビゲーションアイテムをクリックすると、onNavClickが呼ばれる', () => {
    renderHeroSection('sns');

    fireEvent.click(screen.getByText('個人開発'));

    expect(mockOnNavClick).toHaveBeenCalledWith('projects');
  });

  it('表示中の欄のリンクだけを現在地として示す', () => {
    renderHeroSection('projects');

    const currentLinks = screen.getAllByRole('link', { current: 'location' });
    expect(currentLinks.map((link) => link.textContent)).toEqual(['個人開発']);
  });
});
