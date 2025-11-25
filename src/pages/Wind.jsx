import React, { useEffect, useRef } from "react";
import { Map, config, MapStyle } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { WindLayer } from "@maptiler/weather";

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

const Wind = () => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const windLayerRef = useRef(null);

  useEffect(() => {
    config.apiKey = MAPTILER_KEY; // <-- This works with @maptiler/sdk

    mapRef.current = new Map({
      container: mapContainer.current,
      style: MapStyle.DARK, // or MapStyle.BACKDROP, etc.
      center: [121, 14.6],
      zoom: 4,
      projection: "globe",
      projectionControl: true,
    });

    windLayerRef.current = new WindLayer();
    mapRef.current.on("load", () => {
      mapRef.current.addLayer(windLayerRef.current);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Wind;
