
import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import InfoPanel from './components/InfoPanel';
import InputArea from './components/InputArea';
import MapPanel from './components/MapPanel';
import useGameLogic from './hooks/useGameLogic';

function App({ initialState }) {
  const {
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
  } = useGameLogic(initialState);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Places Chain Game</h1>
      </header>
      <div className="Game-container">
        <div className="game-mode-selection mb-3">
          <button
            className={`btn ${gameMode === 'playerVsPlayer' ? 'btn-primary' : 'btn-secondary'} m-lg-2`}
            onClick={() => setGameMode('playerVsPlayer')}
          >
            Player vs. Player
          </button>
          <button
            className={`btn ${gameMode === 'playerVsComputer' ? 'btn-primary' : 'btn-secondary'} m-lg-2`}
            onClick={() => setGameMode('playerVsComputer')}
          >
            Player vs. Computer
          </button>
        </div>
        <div className="main-content">
          <div className="left-column">
            <div className="info-panel-container">
              <InfoPanel
                currentPlayer={currentPlayer}
                score={scores[currentPlayer]}
                message={message}
                gameOver={gameOver}
                onNewGame={handleNewGame}
                lastEnteredPlace={lastEnteredPlace}
              />
            </div>
            <div className="map-panel-container">
              <MapPanel places={placesChain} selectedPlace={selectedPlace} lastEnteredPlace={lastEnteredPlace} />
            </div>
          </div>
          <div className="right-column">
            <div className="input-area-container">
              <InputArea
                onPlaceSubmit={handlePlaceSubmit}
                onGiveUp={handleGiveUp}
                disabled={gameOver || isProcessingAI}
              />
            </div>
            <div className="game-board-container">
              <GameBoard places={placesChain} onPlaceSelect={handlePlaceSelect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
