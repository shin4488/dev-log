import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FixedNavigation from './FixedNavigation';

describe('FixedNavigation', () => {
  const mockOnNavClick = jest.fn();

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

  it('アクティブなセクションが正しくスタイリングされる', () => {
    render(
      <FixedNavigation
        isFixed={true}
        activeSection="projects"
        onNavClick={mockOnNavClick}
      />,
    );

    const activeLink = screen.getByText('個人開発');
    expect(activeLink).toHaveStyle({ color: '#2e86de' });
  });

  it('ホバー効果が正しく動作する', () => {
    render(
      <FixedNavigation
        isFixed={true}
        activeSection="sns"
        onNavClick={mockOnNavClick}
      />,
    );

    const link = screen.getByText('個人開発');

    fireEvent.mouseEnter(link);
    expect(link).toHaveStyle({ borderBottomColor: '#2e86de' });

    fireEvent.mouseLeave(link);
    expect(link).toHaveStyle({ borderBottomColor: 'transparent' });
  });
});
