
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InfoPanel from './InfoPanel';

describe('InfoPanel', () => {
  it('renders the current player and score', () => {
    render(
      <InfoPanel
        currentPlayer="Player 1"
        score={10}
        message="Test message"
        gameOver={false}
        onNewGame={() => {}}
        lastEnteredPlace={null}
      />
    );
    expect(screen.getByText(/Current Player:/)).toBeInTheDocument();
    expect(screen.getByText(/Player 1/)).toBeInTheDocument();
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('renders the message', () => {
    render(
      <InfoPanel
        currentPlayer="Player 1"
        score={10}
        message="Test message"
        gameOver={false}
        onNewGame={() => {}}
        lastEnteredPlace={null}
      />
    );
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders the last entered place', () => {
    const lastEnteredPlace = {
      name: 'London',
      summary: 'The capital of England.',
      imageUrl: 'https://example.com/london.jpg',
      wikipediaUrl: 'https://en.wikipedia.org/wiki/London',
    };

    render(
      <InfoPanel
        currentPlayer="Player 1"
        score={10}
        message="Test message"
        gameOver={false}
        onNewGame={() => {}}
        lastEnteredPlace={lastEnteredPlace}
      />
    );

    expect(screen.getByTestId('last-place-info')).toHaveTextContent('Last Place: London');
  });

  it('calls the onNewGame callback when the "New Game" button is clicked', () => {
    const onNewGame = jest.fn();
    render(
      <InfoPanel
        currentPlayer="Player 1"
        score={10}
        message="Test message"
        gameOver={true}
        onNewGame={onNewGame}
        lastEnteredPlace={null}
      />
    );

    fireEvent.click(screen.getByText('Start New Game'));
    expect(onNewGame).toHaveBeenCalled();
  });
});
