import { useState, useEffect, useCallback } from 'react';
import searchPrefix from '../components/TriesSearch';
import { LOCAL_STORAGE_KEYS, PLAYER_NAMES } from '../constants';
import { API_URLS } from '../config';
import allPlaces from '../data/compressed_trie_output.json';

// Function to get initial state from localStorage
const getInitialState = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      const parsedValue = JSON.parse(storedValue);
      if (key === LOCAL_STORAGE_KEYS.AVAILABLE_PLACES) {
        return new Set(parsedValue);
      }
      return parsedValue;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

const titleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

const useGameLogic = (initialState = {}) => {
  const [placesChain, setPlacesChain] = useState(() => initialState.placesChain || getInitialState(LOCAL_STORAGE_KEYS.PLACES_CHAIN, []));
  const [availablePlaces, setAvailablePlaces] = useState(() => initialState.availablePlaces || getInitialState(LOCAL_STORAGE_KEYS.AVAILABLE_PLACES, new Set()));
  const [currentPlayer, setCurrentPlayer] = useState(() => initialState.currentPlayer || getInitialState(LOCAL_STORAGE_KEYS.CURRENT_PLAYER, PLAYER_NAMES.PLAYER_1));
  const [scores, setScores] = useState(() => initialState.scores || getInitialState(LOCAL_STORAGE_KEYS.SCORES, { [PLAYER_NAMES.PLAYER_1]: 0, [PLAYER_NAMES.PLAYER_2]: 0 }));
  const [message, setMessage] = useState(initialState.message || `Welcome to Places Chain Game! ${PLAYER_NAMES.PLAYER_1}, start by entering a place name.`);
  const [gameOver, setGameOver] = useState(initialState.gameOver || false);
  const [lastEnteredPlace, setLastEnteredPlace] = useState(() => initialState.lastEnteredPlace || getInitialState(LOCAL_STORAGE_KEYS.LAST_ENTERED_PLACE, null));
  const [selectedPlace, setSelectedPlace] = useState(initialState.selectedPlace || null);
  const [gameMode, setGameMode] = useState(() => initialState.gameMode || getInitialState(LOCAL_STORAGE_KEYS.GAME_MODE, 'playerVsPlayer'));
  const [isProcessingAI, setIsProcessingAI] = useState(initialState.isProcessingAI || false);

  const fetchWikipediaData = useCallback(async (title) => {
    try {
      const response = await fetch(`${API_URLS.WIKIPEDIA}${encodeURIComponent(title)}`);
      if (!response.ok) {
        throw new Error('Wikipedia API request failed');
      }
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];

      let summary = '';
      let imageUrl = '';
      let wikipediaUrl = '';

      if (page && !page.missing) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = page.extract;
        let foundSummary = '';
        const paragraphs = tempDiv.querySelectorAll('p');

        for (let i = 0; i < paragraphs.length; i++) {
          if (paragraphs[i].textContent.trim().length > 0) {
            foundSummary = paragraphs[i].textContent.trim();
            break;
          }
        }
        summary = foundSummary;

        imageUrl = page.thumbnail?.source || '';
        wikipediaUrl = page.fullurl || '';
      }

      return { summary, imageUrl, wikipediaUrl };
    } catch (error) {
      throw error; // Re-throw the error so handlePlaceSubmit can catch it
    }
  }, []);

  const switchPlayer = useCallback(() => {
    setCurrentPlayer(prevPlayer => (prevPlayer === PLAYER_NAMES.PLAYER_1 ? PLAYER_NAMES.PLAYER_2 : PLAYER_NAMES.PLAYER_1));
  }, [setCurrentPlayer]);

  const handleComputerTurn = useCallback(async () => {
    setIsProcessingAI(true);
    setMessage('Computer is thinking...');
    const lastPlace = placesChain[placesChain.length - 1].simpleName.toLowerCase();

    if (!lastPlace) {
      setMessage('No place entered yet. Computer cannot make a move.');
      setIsProcessingAI(false);
      return;
    }

    const lastLetter = lastPlace[lastPlace.length - 1].toLowerCase();
    
    const availablePlacesForComputer = Array.from(searchPrefix(allPlaces, lastLetter)).filter(
      (placeName) =>
        placeName.name.toLowerCase().startsWith(lastLetter) &&
        !placesChain.some(p => p.simpleName.toLowerCase() === placeName.name.toLowerCase())
    );

    if (availablePlacesForComputer.length > 0) {
      const computerPlaceName =
        availablePlacesForComputer[Math.random() * availablePlacesForComputer.length | 0];
      try {
        
        
          const wikipediaData = await fetchWikipediaData(computerPlaceName.name);

          const newPlace = {
            place_id: computerPlaceName.place_id,
            name: titleCase(computerPlaceName.name),
            simpleName: computerPlaceName.name,
            coordinates: [parseFloat(computerPlaceName.coordinates[1]), parseFloat(computerPlaceName.coordinates[0])],
            summary: wikipediaData.summary,
            imageUrl: wikipediaData.imageUrl,
            wikipediaUrl: wikipediaData.wikipediaUrl,
          };

          setPlacesChain(prevChain => [...prevChain, newPlace]);
          setAvailablePlaces(prevAvailable => {
            const newAvailable = new Set(prevAvailable);
            newAvailable.add(computerPlaceName.name.toLowerCase());
            return newAvailable;
          });
          setScores(prevScores => ({
            ...prevScores,
            [PLAYER_NAMES.PLAYER_2]: prevScores[PLAYER_NAMES.PLAYER_2] + 1,
          }));
          setLastEnteredPlace(newPlace);
          setMessage(`Computer chose: ${newPlace.name}. Now it's ${PLAYER_NAMES.PLAYER_1}'s turn.`);
          switchPlayer();
       
      } catch (error) {
        setMessage("An error occurred during computer's turn. Player 1 wins!");
        setGameOver(true);
      }
    } else {
      setMessage('Computer has no moves left! Player 1 wins!');
      setGameOver(true);
    }
    setIsProcessingAI(false);
  }, [setIsProcessingAI, setMessage, placesChain, setPlacesChain, setAvailablePlaces, setScores, setLastEnteredPlace, switchPlayer, fetchWikipediaData]);

  const handlePlaceSubmit = useCallback(async (placeInput) => {
    if (gameOver) {
      setMessage('Game is over. Please start a new game.');
      return;
    }

    const normalizedPlaceInput = placeInput.toLowerCase();

    if (availablePlaces.has(normalizedPlaceInput)) {
      setMessage(`"${placeInput}" has already been used. Try again, ${currentPlayer}.`);
      return;
    }

    let foundPlaces = searchPrefix(allPlaces, normalizedPlaceInput);
    if( foundPlaces === undefined || foundPlaces.length === 0) {
      setMessage(`"${placeInput}" is not a recognized place. Try again, ${currentPlayer}.`);
      return;
    }

    if (foundPlaces.length > 1) {
      foundPlaces = foundPlaces.filter(place => place.name.toLowerCase() === normalizedPlaceInput);
    }

    if( foundPlaces.length !== 1) {
      setMessage(`"${placeInput}" is not a recognized place. Try again, ${currentPlayer}.`);
      return;
    }
    const foundPlace = foundPlaces[0];

    try {
      if (placesChain.length > 0) {
        const lastPlaceName = placesChain[placesChain.length - 1].name;
        const lastLetter = lastPlaceName.slice(-1).toLowerCase();
        const firstLetterOfNewPlace = normalizedPlaceInput.charAt(0);

        if (firstLetterOfNewPlace !== lastLetter) {
          setMessage(
            `"${placeInput}" does not start with the last letter of "${lastPlaceName}" (${lastLetter.toUpperCase()}). Try again, ${currentPlayer}.`
          );
          return;
        }
      }

      const wikipediaData = await fetchWikipediaData(foundPlace.name);

      const newPlace = {
        place_id: foundPlace.place_id,
        name: titleCase(foundPlace.name),
        simpleName: foundPlace.name,
        coordinates: [parseFloat(foundPlace.coordinates[1]), parseFloat(foundPlace.coordinates[0])],
        summary: wikipediaData.summary,
        imageUrl: wikipediaData.imageUrl,
        wikipediaUrl: wikipediaData.wikipediaUrl,
      };

      setPlacesChain(prevChain => [...prevChain, newPlace]);
      setAvailablePlaces(prevAvailable => {
        const newAvailable = new Set(prevAvailable);
        newAvailable.add(normalizedPlaceInput);
        return newAvailable;
      });

      setScores(prevScores => ({
        ...prevScores,
        [currentPlayer]: prevScores[currentPlayer] + 1,
      }));

      setLastEnteredPlace(newPlace);

      setMessage(`Good job, ${currentPlayer}! Now it's ${currentPlayer === PLAYER_NAMES.PLAYER_1 ? PLAYER_NAMES.PLAYER_2 : PLAYER_NAMES.PLAYER_1}'s turn.`);
      switchPlayer();

    } catch (error) {
      setMessage('An error occurred while validating the place. Please try again.');
    }
  }, [gameOver, availablePlaces, placesChain, currentPlayer, fetchWikipediaData, setMessage, setAvailablePlaces, setPlacesChain, setScores, setLastEnteredPlace, switchPlayer]);

  const handleGiveUp = () => {
    if (gameOver) {
      setMessage('Game is already over.');
      return;
    }
    setGameOver(true);
    setMessage(`${currentPlayer} gave up! Game Over. Final Scores: ${PLAYER_NAMES.PLAYER_1}: ${scores[PLAYER_NAMES.PLAYER_1]}, ${PLAYER_NAMES.PLAYER_2}: ${scores[PLAYER_NAMES.PLAYER_2]}.`);
  };

  const handleNewGame = () => {
    setPlacesChain([]);
    setAvailablePlaces(new Set());
    setCurrentPlayer(PLAYER_NAMES.PLAYER_1);
    setScores({ [PLAYER_NAMES.PLAYER_1]: 0, [PLAYER_NAMES.PLAYER_2]: 0 });
    setMessage(`Welcome to Places Chain Game! ${PLAYER_NAMES.PLAYER_1}, start by entering a place name.`);
    setGameOver(false);
    setLastEnteredPlace(null);
  };

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PLACES_CHAIN, JSON.stringify(placesChain));
      localStorage.setItem(LOCAL_STORAGE_KEYS.AVAILABLE_PLACES, JSON.stringify(Array.from(availablePlaces)));
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_PLAYER, JSON.stringify(currentPlayer));
      localStorage.setItem(LOCAL_STORAGE_KEYS.SCORES, JSON.stringify(scores));
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_ENTERED_PLACE, JSON.stringify(lastEnteredPlace));
      localStorage.setItem(LOCAL_STORAGE_KEYS.GAME_MODE, JSON.stringify(gameMode));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [placesChain, availablePlaces, currentPlayer, scores, lastEnteredPlace, gameMode]);

  useEffect(() => {
    if (gameMode === 'playerVsComputer' && currentPlayer === PLAYER_NAMES.PLAYER_2 && !gameOver) {
      setIsProcessingAI(true);
      setMessage("Computer's turn...");
      setTimeout(() => {
        handleComputerTurn();
      }, 1500);
    }
  }, [currentPlayer, gameMode, gameOver, handleComputerTurn]);

  return {
    placesChain,
    currentPlayer,
    scores,
    message,
    gameOver,
    lastEnteredPlace,
    selectedPlace,
    gameMode,
    isProcessingAI,
    setGameMode,
    handlePlaceSubmit,
    handleGiveUp,
    handleNewGame,
    handlePlaceSelect,
  };
};

export default useGameLogic;