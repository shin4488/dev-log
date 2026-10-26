import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FixedNavigation from './FixedNavigation';

describe('FixedNavigation', () => {
  const mockOnNavClick = vi.fn();

  beforeEach(() => {
    mockOnNavClick.mockClear();
  });

  it('isFixedがfalseの場合、何も表示されない', () => {
    const { container } = render(
      <FixedNavigation
        isFixed={false}
        activeSection="sns"
        onNavClick={mockOnNavClick}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('isFixedがtrueの場合、ナビゲーションが表示される', () => {
    render(
      <FixedNavigation
        isFixed={true}
        activeSection="sns"
        onNavClick={mockOnNavClick}
      />,
    );

    expect(screen.getByText('リンク')).toBeInTheDocument();
    expect(screen.getByText('個人開発')).toBeInTheDocument();
    expect(screen.getByText('開発経験')).toBeInTheDocument();
  });

  it('ナビゲーションアイテムをクリックすると、onNavClickが呼ばれる', () => {
    render(
      <FixedNavigation
        isFixed={true}
        activeSection="sns"
        onNavClick={mockOnNavClick}
      />,
    );

    fireEvent.click(screen.getByText('個人開発'));

    expect(mockOnNavClick).toHaveBeenCalledWith('projects');
  });

  it('表示中の欄のリンクだけを現在地として示す', () => {
    render(
      <FixedNavigation
        isFixed={true}
        activeSection="projects"
        onNavClick={mockOnNavClick}
      />,
    );

    const currentLinks = screen.getAllByRole('link', { current: 'location' });
    expect(currentLinks.map((link) => link.textContent)).toEqual(['個人開発']);
  });
});
