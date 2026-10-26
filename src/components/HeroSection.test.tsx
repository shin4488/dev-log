import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  const mockOnNavClick = vi.fn();

  beforeEach(() => {
    mockOnNavClick.mockClear();
  });

  it('プロフィール画像が表示される', () => {
    render(<HeroSection activeSection="sns" onNavClick={mockOnNavClick} />);

    const profileImage = screen.getByAltText('shin4488のプロフィール画像');
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src');
  });

  it('ナビゲーションアイテムが表示される', () => {
    render(<HeroSection activeSection="sns" onNavClick={mockOnNavClick} />);

    expect(screen.getByText('リンク')).toBeInTheDocument();
    expect(screen.getByText('個人開発')).toBeInTheDocument();
    expect(screen.getByText('開発経験')).toBeInTheDocument();
  });

  it('ナビゲーションアイテムをクリックすると、onNavClickが呼ばれる', () => {
    render(<HeroSection activeSection="sns" onNavClick={mockOnNavClick} />);

    fireEvent.click(screen.getByText('個人開発'));

    expect(mockOnNavClick).toHaveBeenCalledWith('projects');
  });

  it('表示中の欄のリンクだけを現在地として示す', () => {
    render(
      <HeroSection activeSection="projects" onNavClick={mockOnNavClick} />,
    );

    const currentLinks = screen.getAllByRole('link', { current: 'location' });
    expect(currentLinks.map((link) => link.textContent)).toEqual(['個人開発']);
  });
});
