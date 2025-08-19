import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { faWikipediaW } from '@fortawesome/free-brands-svg-icons';
import DOMPurify from 'dompurify';
import './PlaceInfoPanel.css';

function PlaceInfoPanel({ place }) {
  if (!place) {
    return (
      <div className="place-info-panel p-3 mb-3 border rounded">
        <h3><FontAwesomeIcon icon={faMapPin} /> Place Details</h3>
        <p>Click on a place in the chain to see its details here.</p>
      </div>
    );
  }

  const sanitizedSummary = DOMPurify.sanitize(place.summary);

  return (
    <div className="place-info-panel p-3 mb-3 border rounded">
      <h3><FontAwesomeIcon icon={faMapPin} /> {place.name}</h3>
      {place.imageUrl && (
        <div className="place-image-container mb-2">
          <img src={place.imageUrl} alt={place.name} className="img-fluid rounded" />
        </div>
      )}
      {place.summary && (
        <p>
          <strong>Summary:</strong> <span dangerouslySetInnerHTML={{ __html: sanitizedSummary }} />
        </p>
      )}
      {place.wikipediaUrl && (
        <p>
          <a href={place.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWikipediaW} /> Read more on Wikipedia
          </a>
        </p>
      )}
    </div>
  );
}

export default PlaceInfoPanel;
