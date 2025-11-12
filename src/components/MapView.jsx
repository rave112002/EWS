import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
// import axios from "axios";
import "maplibre-gl/dist/maplibre-gl.css";

const MapView = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // prevent multiple maps

    // Initialize MapLibre
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.jawg.io/styles/b40385ad-10b5-40e2-8c6c-2459ccf5e721.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
      center: [121.0527, 14.5176], // Taguig City
      zoom: 12,
    });
  });

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "88vh", borderRadius: "8px" }}
      // className="w-full h-full"
    />
  );
};

export default MapView;
