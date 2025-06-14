import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../navigation';

describe('Navigation', () => {
  it('renders About link', () => {
    render(<Navigation />);
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
  });
});
