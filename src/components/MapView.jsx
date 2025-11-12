// MapView.jsx
import React, { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapView = ({
  center = [121.0, 14.6],   // default to Metro Manila coordinates (lon, lat)
  zoom = 12,
  styleUrl = 'https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83',
  onMapLoad = () => {}
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (mapInstance.current) return; // initialize only once

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: center,
      zoom: zoom
    });
    

    // add navigation controls (zoom + rotate)
    mapInstance.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    mapInstance.current.on('load', () => {
      onMapLoad(mapInstance.current);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [styleUrl, center, zoom, onMapLoad]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MapView;
