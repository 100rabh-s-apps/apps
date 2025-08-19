import { renderHook } from '@testing-library/react';
import { act } from 'react';
import useGameLogic from './useGameLogic';

// Mocking the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ query: { pages: { 123: { extract: 'Mock summary' } } } }),
  })
);

// Mocking localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useGameLogic', () => {
  beforeEach(() => {
    localStorage.clear();
    fetch.mockClear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGameLogic());

    expect(result.current.placesChain).toEqual([]);
    expect(result.current.currentPlayer).toBe('Player 1');
    expect(result.current.scores).toEqual({ 'Player 1': 0, 'Player 2': 0});
    expect(result.current.gameOver).toBe(false);
  });

  it('should handle a new game', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.handleNewGame();
    });

    expect(result.current.placesChain).toEqual([]);
    expect(result.current.currentPlayer).toBe('Player 1');
    expect(result.current.scores).toEqual({ 'Player 1': 0, 'Player 2': 0, });
    expect(result.current.gameOver).toBe(false);
  });

  it('should handle giving up', () => {
    const { result } = renderHook(() => useGameLogic());

    act(() => {
      result.current.handleGiveUp();
    });

    expect(result.current.gameOver).toBe(true);
  });
});
