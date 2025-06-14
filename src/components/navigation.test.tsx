import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from './navigation';
import { WindowLocation } from '@reach/router';

const createLocation = (pathname: string): WindowLocation<unknown> =>
  ({ pathname } as WindowLocation<unknown>);

describe('Navigation', () => {
  it('renders About link', () => {
    render(<Navigation location={createLocation('/')} />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
  });

  it('shows hero links on About page', () => {
    render(<Navigation location={createLocation('/about')} />);
    expect(screen.getByRole('link', { name: 'リンク' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '個人開発' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '開発経験' })).toBeInTheDocument();
  });
});
