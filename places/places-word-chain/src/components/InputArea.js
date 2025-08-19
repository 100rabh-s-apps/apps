import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faFlag } from '@fortawesome/free-solid-svg-icons';
import './InputArea.css';

function InputArea({ onPlaceSubmit, onGiveUp, disabled }) {
  const [placeName, setPlaceName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (placeName.trim()) {
      onPlaceSubmit(placeName.trim());
      setPlaceName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-area-container mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter a place name"
        value={placeName}
        onChange={(e) => setPlaceName(e.target.value)}
        disabled={disabled}
      />
      <div className="mt-2">
        <button type="submit" className="btn btn-primary p-2 m-2" disabled={disabled}>
          <FontAwesomeIcon icon={faPaperPlane} /> Submit
        </button>
        <button type="button" className="btn btn-danger ml-2 p-2 m-2" onClick={onGiveUp} disabled={disabled}>
          <FontAwesomeIcon icon={faFlag} /> Give Up
        </button>
      </div>
    </form>
  );
}

export default InputArea;
