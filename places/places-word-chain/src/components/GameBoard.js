import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
// import { faWikipediaW } from '@fortawesome/free-brands-svg-icons'; // For Wikipedia icon
import PlaceInfoPanel from './PlaceInfoPanel';
import './GameBoard.css'; // Import the new CSS file

function GameBoard({ places, onPlaceSelect }) { // No onPlaceClick prop needed anymore
  const [expandedPlaceId, setExpandedPlaceId] = useState(null); // State to track expanded place

  const handlePlaceClick = (place) => {
    const newExpandedId = expandedPlaceId === place.place_id ? null : place.place_id;
    setExpandedPlaceId(newExpandedId);
    onPlaceSelect(newExpandedId === null ? null : place); // Pass the place or null to App.js
  };

  // Reverse the places array to show newest first
  const reversedPlaces = [...places].reverse();

  return (
    <div className="game-board p-3 mb-3 border rounded">
      <h3>Place Chain</h3>
      <ul className="list-group">
        {reversedPlaces.map((place) => (
          <li key={place.place_id} className="list-group-item"> {/* Now place_id is guaranteed to be present and unique */}
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            <button
              className="place-name-clickable btn btn-link"
              onClick={() => handlePlaceClick(place)}
            >
              {place.name}
            </button>

            {expandedPlaceId === place.place_id && (
              <PlaceInfoPanel place={place} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GameBoard;
