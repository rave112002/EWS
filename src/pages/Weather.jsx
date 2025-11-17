// Weather.jsx
import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Button } from "antd";
import { Mountain, MountainSnow, Cloud, Wind } from "lucide-react";

const Weather = ({
  center = [121.0, 14.6], // default to Metro Manila (lon, lat)
  zoom = 12,
  styleUrl = "https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
  onMapLoad = () => {},

  // 3D
  terrainExaggeration = 1.0,
  enable3DBuildings = false,
}) => {
  const [terrainEnabled, setTerrainEnabled] = useState(false);
  const [cloudsEnabled, setCloudsEnabled] = useState(true);
  const [windEnabled, setWindEnabled] = useState(true);

  const OPENWEATHER_API_KEY = "fc458895bd9b40aa34c1f632f8e06a28";

  const terrainSourceUrl = terrainEnabled
    ? "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=EwtO1Ev8tHi9GJOuWxBy"
    : "";

  const enableTerrain = terrainEnabled;

  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Helper: first symbol layer (to insert 3D layers below labels)
  const getFirstSymbolLayerId = (map) => {
    const layers = map.getStyle()?.layers || [];
    const symbolLayer = layers.find((l) => l.type === "symbol");
    return symbolLayer?.id;
  };

  // Helper: try to find an existing building source/layer in the style
  const findBuildingSourceInfo = (map) => {
    const layers = map.getStyle()?.layers || [];
    for (const l of layers) {
      const srcLayer = l["source-layer"];
      if (srcLayer && /building/i.test(srcLayer) && l.source) {
        return { source: l.source, sourceLayer: srcLayer };
      }
    }
    return null;
  };

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: center,
      zoom: zoom,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapInstance.current.on("load", () => {
      onMapLoad(mapInstance.current);
    });

    mapInstance.current.on("load", async () => {
      // Load GeoJSON boundaries
      const geojsonFiles = ["/data/taguig.geojson"];

      const geojsons = await Promise.all(
        geojsonFiles.map(async (url) => {
          const response = await fetch(url);
          return response.json();
        })
      );

      const combinedGeoJSON = {
        type: "FeatureCollection",
        features: geojsons.flatMap((g) => g.features || [g]),
      };

      mapInstance.current.addSource("combinedBoundaries", {
        type: "geojson",
        data: combinedGeoJSON,
      });

      mapInstance.current.addLayer({
        id: "combined-fill",
        type: "fill",
        source: "combinedBoundaries",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.25,
        },
      });

      mapInstance.current.addLayer({
        id: "combined-border",
        type: "line",
        source: "combinedBoundaries",
        paint: {
          "line-color": "#fff",
          "line-width": 2.5,
        },
      });

      mapInstance.current.addLayer({
        id: "combined-labels",
        type: "symbol",
        source: "combinedBoundaries",
        layout: {
          "text-field": ["get", "adm4_en"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 14,
          "text-anchor": "center",
          "text-allow-overlap": false,
        },
        paint: {
          "text-color": "#333333",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
        },
      });

      // Fit bounds
      const bounds = new maplibregl.LngLatBounds();
      combinedGeoJSON.features.forEach((f) => {
        if (f.geometry?.type === "Polygon") {
          f.geometry.coordinates[0].forEach(([lon, lat]) =>
            bounds.extend([lon, lat])
          );
        } else if (f.geometry?.type === "MultiPolygon") {
          f.geometry.coordinates
            .flat(2)
            .forEach(([lon, lat]) => bounds.extend([lon, lat]));
        }
      });

      if (!bounds.isEmpty()) {
        mapInstance.current.fitBounds(bounds, { padding: 40 });
      }

      // --- HILLSHADE ---
      if (!mapInstance.current.getSource("hillshade-dem")) {
        mapInstance.current.addSource("hillshade-dem", {
          type: "raster-dem",
          url: terrainSourceUrl,
          tileSize: 512,
        });
      }
      if (!mapInstance.current.getLayer("hillshade")) {
        mapInstance.current.addLayer({
          id: "hillshade",
          type: "hillshade",
          source: "hillshade-dem",
          paint: { "hillshade-shadow-color": "#473B24" },
        });
      }

      // --- TERRAIN ---
      if (enableTerrain && terrainSourceUrl) {
        if (!mapInstance.current.getSource("terrain-dem")) {
          mapInstance.current.addSource("terrain-dem", {
            type: "raster-dem",
            url: terrainSourceUrl,
            tileSize: 512,
            maxzoom: 14,
          });
        }
        mapInstance.current.setTerrain({
          source: "terrain-dem",
          exaggeration: terrainExaggeration,
        });

        if (!mapInstance.current.getLayer("sky")) {
          mapInstance.current.addLayer({
            id: "sky",
            type: "sky",
            paint: {
              "sky-type": "atmosphere",
              "sky-atmosphere-sun": [0.0, 0.0],
              "sky-atmosphere-sun-intensity": 12,
            },
          });
        }

        mapInstance.current.setPitch(
          Math.max(mapInstance.current.getPitch(), 60)
        );
      }

      // ********************************************************************
      // 🌥️ OPENWEATHER — CLOUD & WIND LAYERS
      // ********************************************************************

      // CLOUDS
      mapInstance.current.addSource("clouds", {
        type: "raster",
        tiles: [
          `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        ],
        tileSize: 256,
      });

      mapInstance.current.addLayer({
        id: "clouds-layer",
        type: "raster",
        source: "clouds",
        paint: {
          "raster-opacity": 0.6,
        },
      });

      // WIND
      mapInstance.current.addSource("wind", {
        type: "raster",
        tiles: [
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`,
        ],
        tileSize: 256,
      });

      mapInstance.current.addLayer({
        id: "wind-layer",
        type: "raster",
        source: "wind",
        paint: {
          "raster-opacity": 0.55,
        },
      });

      // Initial toggle states
      mapInstance.current.setLayoutProperty(
        "clouds-layer",
        "visibility",
        cloudsEnabled ? "visible" : "none"
      );
      mapInstance.current.setLayoutProperty(
        "wind-layer",
        "visibility",
        windEnabled ? "visible" : "none"
      );
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [
    styleUrl,
    center,
    zoom,
    onMapLoad,
    enableTerrain,
    terrainSourceUrl,
    terrainExaggeration,
    enable3DBuildings,
  ]);

  // Toggle clouds layer
  const toggleClouds = () => {
    const map = mapInstance.current;
    const newState = !cloudsEnabled;
    setCloudsEnabled(newState);
    map.setLayoutProperty(
      "clouds-layer",
      "visibility",
      newState ? "visible" : "none"
    );
  };

  // Toggle wind layer
  const toggleWind = () => {
    const map = mapInstance.current;
    const newState = !windEnabled;
    setWindEnabled(newState);
    map.setLayoutProperty(
      "wind-layer",
      "visibility",
      newState ? "visible" : "none"
    );
  };

  return (
    <>
      {/* Terrain Toggle */}
      <Button
        style={{ position: "absolute", zIndex: 1 }}
        onClick={() => setTerrainEnabled((prev) => !prev)}
        className="right-4 top-44 p-0 px-2"
      >
        {terrainEnabled ? <Mountain size={16} /> : <MountainSnow size={16} />}
      </Button>

      {/* Clouds Toggle */}
      <Button
        style={{ position: "absolute", zIndex: 1 }}
        onClick={toggleClouds}
        className="right-4 top-56 p-0 px-2"
      >
        <Cloud size={16} />
      </Button>

      {/* Wind Toggle */}
      <Button
        style={{ position: "absolute", zIndex: 1 }}
        onClick={toggleWind}
        className="right-4 top-68 p-0 px-2"
      >
        <Wind size={16} />
      </Button>

      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </>
  );
};

export default Weather;
