
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import { LOCAL_STORAGE_KEYS, PLAYER_NAMES } from './constants';
jest.mock('./components/TriesSearch');
import {searchPrefix} from './components/TriesSearch';


describe('App', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // Mock searchPrefix to control trie search results
  const mockSearchPrefix = jest.fn((trie, prefix) => {
    console.log('Mock searchPrefix called with:', { trie, prefix });
    const result = []; // Default behavior if not explicitly mocked for a test
    console.log('Mock searchPrefix returning:', result);
    return result;
  });
  jest.mock('./components/TriesSearch', () => ({
    __esModule: true,
    default: mockSearchPrefix,
  }));

  let searchPrefix; // Declare searchPrefix here

  beforeAll(() => {
    // searchPrefix = require('./components/TriesSearch').default; // Assign in beforeAll
  });

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch = mockFetch([]);
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    searchPrefix = require('./components/TriesSearch').default; // Assign in beforeAll
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });


// Mock the fetch API
const mockFetch = (data, ok = true) =>
  jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(data),
    })
  );


let allPlacesData = [];
// Mock allPlaces data


  it('handles localStorage.getItem errors gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App allPlaces={allPlacesData} />);

    expect(screen.getByText(/Welcome to Places Chain Game!/)).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith(
      `Error loading ${LOCAL_STORAGE_KEYS.PLACES_CHAIN} from localStorage:`,
      expect.any(Error)
    );
    console.error.mockRestore();
  });

  it('handles localStorage.setItem errors gracefully', async () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage set error');
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<App allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    global.fetch = mockFetch({
      query: {
        pages: {
          '1': {
            extract: 'London is a city.',
            thumbnail: { source: 'https://example.com/london.jpg' },
            fullurl: 'https://en.wikipedia.org/wiki/London',
          },
        },
      },
    });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        'Error saving state to localStorage:',
        expect.any(Error)
      );
    });
    console.error.mockRestore();
  });

  it('renders the game mode selection buttons', () => {
    render(<App allPlaces={allPlacesData} />);
    expect(screen.getByText('Player vs. Player')).toBeInTheDocument();
    expect(screen.getByText('Player vs. Computer')).toBeInTheDocument();
  });

  it('switches to "Player vs. Computer" mode', () => {
    render(<App allPlaces={allPlacesData} />);
    fireEvent.click(screen.getByText('Player vs. Computer'));
    expect(screen.getByText('Player vs. Computer')).toHaveClass('btn-primary');
    expect(screen.getByText('Player vs. Player')).toHaveClass('btn-secondary');
  });

  it('handles place submission and updates the game state', async () => {
    searchPrefix.mockReturnValue([{ place_id: '1', name: 'Londona', simpleName: 'londona', coordinates: [0, 0] }]);
    render(<App allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    global.fetch = mockFetch({
      query: {
        pages: {
          '1': {
            extract: 'Londona is a city.',
            thumbnail: { source: 'https://example.com/londona.jpg' },
            fullurl: 'https://en.wikipedia.org/wiki/Londona',
          },
        },
      },
    });

    fireEvent.change(input, { target: { value: 'Londona' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText('Londona')).toHaveLength(2); // One in MapPanel, one in InfoPanel
    });
  });

  it('handles invalid place submission', async () => {
    searchPrefix.mockReturnValueOnce([]);
    render(<App allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'InvalidPlace' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/is not a recognized place/)).toBeInTheDocument();
    });
  });

  it('handles giving up', () => {
    render(<App allPlaces={allPlacesData} />);
    const giveUpButton = screen.getByText('Give Up');
    fireEvent.click(giveUpButton);
    expect(screen.getByText(/gave up!/)).toBeInTheDocument();
  });

  it('handles starting a new game', () => {
    render(<App allPlaces={allPlacesData} />);
    const giveUpButton = screen.getByText('Give Up');
    fireEvent.click(giveUpButton);

    const newGameButton = screen.getByText('Start New Game');
    fireEvent.click(newGameButton);
    expect(screen.getByText(/Welcome to Places Chain Game!/)).toBeInTheDocument();
  });

  it('computer makes a move when placesChain is not empty', async () => {
    const initialState = {
      placesChain: [{ place_id: '1', name: 'London', simpleName: 'london', coordinates: [0, 0] }],
      currentPlayer: PLAYER_NAMES.PLAYER_2,
      gameMode: 'playerVsComputer',
    };
    searchPrefix.mockImplementation((trie, prefix) => {
      if (prefix === 'n') {
        return [{ place_id: '2', name: 'New York', simpleName: 'new york', coordinates: [0, 0] }];
      }
      return [];
    });
    
    render(<App initialState={initialState} allPlaces={allPlacesData} />);

    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    global.fetch = mockFetch({
      query: {
        pages: {
          '1': {
            extract: 'London is a city.',
            thumbnail: { source: 'https://example.com/london.jpg' },
            fullurl: 'https://en.wikipedia.org/wiki/London',
          },
        },
      },
    });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(submitButton);


    global.fetch = mockFetch({
      query: {
        pages: {
          '2': {
            extract: 'New York is a city.',
            thumbnail: { source: 'https://example.com/ny.jpg' },
            fullurl: 'https://en.wikipedia.org/wiki/New_York',
          },
        },
      },
    });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Computer chose: N.*/)).toBeInTheDocument(); 
      expect(screen.getByText(/Now it's Player 1's turn/)).toBeInTheDocument();
    });
  });

  it('computer declares win if no place found', async () => {
    const initialState = {
      placesChain: [{ place_id: '1', name: 'Zurich', simpleName: 'zurich', coordinates: [0, 0] }],
      currentPlayer: PLAYER_NAMES.PLAYER_2,
      gameMode: 'playerVsComputer',
    };
    searchPrefix.mockReturnValueOnce([]);
    render(<App initialState={initialState} allPlaces={allPlacesData} />);

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Computer has no moves left! Player 1 wins!/)).toBeInTheDocument();
    });
  });

  it('prevents submission if place has already been used', async () => {
    const initialState = {
      placesChain: [{ place_id: '1', name: 'London', simpleName: 'london', coordinates: [0, 0] }],
      availablePlaces: new Set(['london']),
    };
    searchPrefix.mockReturnValueOnce([{ place_id: '1', name: 'London', simpleName: 'london', coordinates: [0, 0] }]);
    render(<App initialState={initialState} allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/has already been used/)).toBeInTheDocument();
    });
  });

  it('prevents submission if place does not start with the correct letter', async () => {
    const initialState = {
      placesChain: [{ place_id: '1', name: 'London', simpleName: 'london', coordinates: [0, 0] }],
    };
    searchPrefix.mockReturnValueOnce([{ place_id: '3', name: 'Paris', simpleName: 'paris', coordinates: [0, 0] }]);
    render(<App initialState={initialState} allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/does not start with the last letter/)).toBeInTheDocument();
    });
  });

  it('handles Wikipedia API errors gracefully during place submission', async () => {
    searchPrefix.mockReturnValueOnce([{ place_id: '1', name: 'London', simpleName: 'london', coordinates: [0, 0] }]);
    render(<App allPlaces={allPlacesData} />);
    const input = screen.getByPlaceholderText('Enter a place name');
    const submitButton = screen.getByText('Submit');

    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

    await act(async () => {
      fireEvent.change(input, { target: { value: 'London' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/An error occurred while validating the place. Please try again./)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});