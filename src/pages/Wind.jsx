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
    config.apiKey = MAPTILER_KEY;

    const map = new Map({
      container: mapContainer.current,
      style: MapStyle.OUTDOOR,
      center: [121, 14.6],
      zoom: 4,
      projection: "mercator",
      projectionControl: true,
    });
    mapRef.current = map;

    const wind = new WindLayer({ id: "mt-wind" });
    windLayerRef.current = wind;

    map.on("load", () => {
      map.addLayer(wind, "Country border");

      // wait until the map is idle (finished initial rendering/updates)
      map.once("idle", () => {
        if (map.getLayer("mt-wind")) {
          wind.setOpacity(0.4);
        }
      });
    });

    return () => {
      map?.remove();
      mapRef.current = null;
      windLayerRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Wind;
