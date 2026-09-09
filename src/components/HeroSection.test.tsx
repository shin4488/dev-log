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

    const profileImage = screen.getByAltText('Profile picture');
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

  it('アクティブなセクションが正しくスタイリングされる', () => {
    render(
      <HeroSection activeSection="projects" onNavClick={mockOnNavClick} />,
    );

    const activeLink = screen.getByText('個人開発');
    expect(activeLink).toHaveStyle({ borderBottomColor: 'rgb(255, 255, 255)' });
    expect(activeLink).toHaveAttribute('aria-current', 'location');
  });

  it('ホバー効果が正しく動作する', () => {
    render(<HeroSection activeSection="sns" onNavClick={mockOnNavClick} />);

    const link = screen.getByText('個人開発');

    fireEvent.mouseEnter(link);
    expect(link).toHaveStyle({ opacity: 0.8 });
    expect(link).toHaveStyle({ borderBottomColor: 'rgba(0, 0, 0, 0)' });
    expect(link).not.toHaveAttribute('aria-current');

    fireEvent.mouseLeave(link);
    expect(link).toHaveStyle({ borderBottomColor: 'rgba(0, 0, 0, 0)' });
  });

  it('背景グラデーションが適用される', () => {
    render(<HeroSection activeSection="sns" onNavClick={mockOnNavClick} />);

    const heroContainer = screen.getByText('リンク').closest('div');
    expect(heroContainer).toHaveStyle({
      background: 'linear-gradient(120deg, #1d976c, #2e86de)',
    });
  });
});
