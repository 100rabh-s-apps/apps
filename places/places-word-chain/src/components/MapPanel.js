import React, { useRef, useEffect } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Zoom, Attribution } from 'ol/control';
import './MapPanel.css';

function MapPanel({ places, selectedPlace, lastEnteredPlace }) {
  const mapRef = useRef();
  const mapInstance = useRef(null);
  const vectorSource = useRef(new VectorSource());
  const previousPlacesLength = useRef(0);

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://{a-z}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
              attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
            }),
          }),
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
        controls: [
          new Zoom({
            target: mapRef.current,
          }),
          new Attribution({
            target: mapRef.current,
            collapsed: false,
          }),
        ],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource.current,
        style: new Style({
          image: new Circle({
            radius: 7,
            fill: new Fill({
              color: '#FFD166', // New accent color for markers
            }),
            stroke: new Stroke({
              color: 'white',
              width: 2,
            }),
          }),
        }),
      });
      mapInstance.current.addLayer(vectorLayer);
    }
  }, []);

  useEffect(() => {
    vectorSource.current.clear();
    if (places && places.length > 0) {
      const features = places.map(place => {
        return new Feature({
          geometry: new Point(fromLonLat(place.coordinates)),
        });
      });
      vectorSource.current.addFeatures(features);

      // Check if a new place was added
      const isNewPlaceAdded = places.length > previousPlacesLength.current;
      previousPlacesLength.current = places.length;

      if (isNewPlaceAdded && lastEnteredPlace) {
        // Focus on the last entered place
        const view = mapInstance.current.getView();
        view.animate({
          center: fromLonLat(lastEnteredPlace.coordinates),
          zoom: 4,
          duration: 1000,
        });
      } else {
        // Fit to all places if no new place was added or lastEnteredPlace is not available
        const extent = vectorSource.current.getExtent();
        if (!isNaN(extent[0])) { // Check if extent is valid
          mapInstance.current.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            duration: 1000,
            maxZoom: 4,
          });
        }
      }
    } else {
      // Reset view if no places
      mapInstance.current.getView().setCenter([0, 0]);
      mapInstance.current.getView().setZoom(2);
      previousPlacesLength.current = 0;
    }
  }, [places, lastEnteredPlace]);

  useEffect(() => {
    if (selectedPlace && mapInstance.current) {
      const view = mapInstance.current.getView();
      view.animate({
        center: fromLonLat(selectedPlace.coordinates),
        zoom: 4,
        duration: 1000,
      });
    }
  }, [selectedPlace]);

  return (
    <div data-testid="map-container" className="map-panel border rounded" ref={mapRef}></div>
  );
}

export default MapPanel;
