
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoard from './GameBoard';

// Mock the PlaceInfoPanel component
jest.mock('./PlaceInfoPanel', () => ({ place }) => (
  <div data-testid="place-info-panel">
    <h3>{place.name}</h3>
    <p>{place.summary}</p>
    <a href={place.wikipediaUrl}>Read more on Wikipedia</a>
    <img src={place.imageUrl} alt={place.name} />
  </div>
));

describe('GameBoard', () => {
  const mockPlaces = [
    {
      place_id: '1',
      name: 'London',
      summary: 'The capital of England.',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/London',
      imageUrl: 'https://example.com/london.jpg',
    },
    {
      place_id: '2',
      name: 'Paris',
      summary: 'The capital of France.',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/Paris',
      imageUrl: 'https://example.com/paris.jpg',
    },
  ];

  it('renders the list of places', () => {
    render(<GameBoard places={mockPlaces} onPlaceSelect={() => {}} />);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('calls the onPlaceSelect callback when a place is clicked', () => {
    const onPlaceSelect = jest.fn();
    render(<GameBoard places={mockPlaces} onPlaceSelect={onPlaceSelect} />);

    fireEvent.click(screen.getByText('London'));
    expect(onPlaceSelect).toHaveBeenCalledWith(mockPlaces[0]);

    fireEvent.click(screen.getByText('Paris'));
    expect(onPlaceSelect).toHaveBeenCalledWith(mockPlaces[1]);
  });

  it('expands and collapses the place information when a place is clicked', () => {
    render(<GameBoard places={mockPlaces} onPlaceSelect={() => {}} />);

    // Initially, no details should be visible
    expect(screen.queryByTestId('place-info-panel')).not.toBeInTheDocument();

    // Click London to expand
    fireEvent.click(screen.getAllByText('London')[0]);
    expect(screen.getByTestId('place-info-panel')).toBeInTheDocument();
    expect(screen.getByText('The capital of England.')).toBeInTheDocument();

    // Click London again to collapse
    fireEvent.click(screen.getAllByText('London')[0]);
    expect(screen.queryByTestId('place-info-panel')).not.toBeInTheDocument();
  });
});
