import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectCard from './ProjectCard';

const mockProjectItem = {
  title: 'テストプロジェクト',
  imageUri: '/test-image.png',
  siteUri: 'https://example.com',
  usedTechniques: ['React', 'TypeScript', 'Jest'],
  summary: 'これはテスト用のプロジェクトです。',
  technicalAppeal: 'React Hooksを活用した実装です。',
};

describe('ProjectCard', () => {
  it('プロジェクトの基本情報が表示される', () => {
    render(<ProjectCard item={mockProjectItem} />);

    expect(screen.getByText('テストプロジェクト')).toBeInTheDocument();
    expect(
      screen.getByText('これはテスト用のプロジェクトです。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('React Hooksを活用した実装です。'),
    ).toBeInTheDocument();
  });

  it('プロジェクト画像が表示される', () => {
    render(<ProjectCard item={mockProjectItem} />);

    const image = screen.getByAltText('テストプロジェクト');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.png');
  });

  it('使用技術のバッジが表示される', () => {
    render(<ProjectCard item={mockProjectItem} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Jest')).toBeInTheDocument();
  });

  it('プロジェクトタイトルとイメージがリンクになっている', () => {
    render(<ProjectCard item={mockProjectItem} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);

    // 両方のリンクが正しいhrefとtargetを持つことを確認
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  it('テーブルの行ラベルが正しく表示される', () => {
    render(<ProjectCard item={mockProjectItem} />);

    expect(screen.getByText('使用技術')).toBeInTheDocument();
    expect(screen.getByText('概要')).toBeInTheDocument();
    expect(screen.getByText('技術アピール')).toBeInTheDocument();
  });

  it('カードにBootstrapクラスが適用される', () => {
    const { container } = render(<ProjectCard item={mockProjectItem} />);

    const card = container.querySelector('.card');
    expect(card).toHaveClass('h-100', 'shadow-sm', 'border');
  });
});
