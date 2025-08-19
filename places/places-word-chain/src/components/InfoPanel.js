import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function InfoPanel({ currentPlayer, score, message, gameOver, onNewGame, lastEnteredPlace }) {
  return (
    <div className="info-panel p-3 mb-3 border rounded" data-testid="info-panel">
      <h3><FontAwesomeIcon icon={faInfoCircle} /> Game Info</h3>
      <p><strong>Current Player:</strong> {currentPlayer}</p>
      <p><strong>Score:</strong> {score}</p>
      <p className="message">{message}</p>
      {lastEnteredPlace && (
        <div className="last-place-info mt-3" data-testid="last-place-info">
          <p><strong>Last Place:</strong> {lastEnteredPlace.name}</p>
        </div>
      )}
      {gameOver && (
        <button className="btn btn-primary mt-3" onClick={onNewGame}>
          Start New Game
        </button>
      )}
    </div>
  );
}

export default InfoPanel;
