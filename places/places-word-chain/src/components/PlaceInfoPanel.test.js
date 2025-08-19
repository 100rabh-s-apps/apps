
import React from 'react';
import { render, screen } from '@testing-library/react';
import PlaceInfoPanel from './PlaceInfoPanel';

describe('PlaceInfoPanel', () => {
  it('renders a default message when no place is provided', () => {
    render(<PlaceInfoPanel place={null} />);
    expect(screen.getByText('Click on a place in the chain to see its details here.')).toBeInTheDocument();
  });

  it('renders the place information correctly', () => {
    const place = {
      name: 'London',
      summary: 'The capital of England.',
      imageUrl: 'https://example.com/london.jpg',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/London',
    };

    render(<PlaceInfoPanel place={place} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Summary:')).toBeInTheDocument();
    expect(screen.getByText('The capital of England.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Read more on Wikipedia/i })).toHaveAttribute(
      'href',
      'https://en.wikipedia.org/wiki/London'
    );
    expect(screen.getByRole('img', { name: 'London' })).toHaveAttribute(
      'src',
      'https://example.com/london.jpg'
    );
  });

  it('renders without an image', () => {
    const place = {
      name: 'London',
      summary: 'The capital of England.',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/London',
    };

    render(<PlaceInfoPanel place={place} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders without a summary', () => {
    const place = {
      name: 'London',
      imageUrl: 'https://example.com/london.jpg',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/London',
    };

    render(<PlaceInfoPanel place={place} />);

    expect(screen.queryByText('Summary:')).not.toBeInTheDocument();
  });

  it('renders without a Wikipedia link', () => {
    const place = {
      name: 'London',
      summary: 'The capital of England.',
      imageUrl: 'https://example.com/london.jpg',
    };

    render(<PlaceInfoPanel place={place} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
