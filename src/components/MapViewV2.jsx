import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { BARANGAY_COLORS } from "../constants/mapColors";
import ActionButton from "./Button/ActionButton";
import WeatherInfoModal from "./Modal/WeatherInfoModal";
import ElevationInfoModal from "./Modal/ElevationInfoModal";
import HeatIndexInfoModal from "./Modal/HeatIndexInfoModal";
import { HEAT_LEVELS } from "../constants/warningLevels";
import WarningLegend from "./WarningLegend";
import { getWeatherDescription } from "@helpers/weatherHelpers";
import { getHeatIndexCategory } from "../helpers/heatIndexHelpers";
import MapButtons from "./MapButtons";

const MapViewV2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [showElevation, setShowElevation] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showPAR, setShowPAR] = useState(false);
  const [showHeatIndex, setShowHeatIndex] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [elevationData, setElevationData] = useState(null);
  const [heatIndexData, setHeatIndexData] = useState(null);
  const [loading, setLoading] = useState(false);
  const elevationCacheRef = useRef({});
  const heatIndexCacheRef = useRef({});
  const parBoundsRef = useRef(null);
  const heatmapPointsRef = useRef([]);
  const defaultBoundsRef = useRef(null);
  const showElevationRef = useRef(false);
  const showWeatherRef = useRef(false);
  const showHeatIndexRef = useRef(false);

  const toggle2D3D = () => {
    if (!map.current) return;

    if (is3D) {
      // Switch to 2D
      map.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
      setIs3D(false);
    } else {
      // Switch to 3D
      map.current.easeTo({
        pitch: 60,
        bearing: -17.6,
        duration: 1000,
      });
      setIs3D(true);
    }
  };

  const toggleElevation = () => {
    if (!map.current) return;

    const newShowElevation = !showElevation;
    setShowElevation(newShowElevation);
    showElevationRef.current = newShowElevation;
    setShowWeather(false);
    showWeatherRef.current = false;
    setShowPAR(false);
    setShowHeatIndex(false);
    showHeatIndexRef.current = false;
    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);
    setHeatIndexData(null);

    // Hide heatmap layer
    if (map.current.getLayer("heat-index-heatmap")) {
      map.current.setLayoutProperty("heat-index-heatmap", "visibility", "none");
    }

    if (newShowElevation) {
      // Show elevation-based heights
      const elevationCache = elevationCacheRef.current;
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        [
          "match",
          ["get", "adm4_psgc"],
          ...Object.entries(elevationCache).flatMap(([psgc, elevation]) => [
            parseInt(psgc),
            elevation * 15,
          ]),
          150,
        ]
      );
      // Enable colors
      map.current.setPaintProperty("combined-fill-3d", "fill-extrusion-color", [
        "match",
        ["get", "adm4_psgc"],
        ...Object.entries(BARANGAY_COLORS).flatMap(([psgc, color]) => [
          parseInt(psgc),
          color,
        ]),
        "#8AFF8A",
      ]);
    } else {
      // Show uniform flat height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#8AFF8A"
      );
    }

    // Reset opacity
    map.current.setPaintProperty(
      "combined-fill-3d",
      "fill-extrusion-opacity",
      0.5
    );
  };

  const toggleWeather = () => {
    if (!map.current) return;

    const newShowWeather = !showWeather;
    setShowWeather(newShowWeather);
    showWeatherRef.current = newShowWeather;
    setShowElevation(false);
    showElevationRef.current = false;
    setShowPAR(false);
    setShowHeatIndex(false);
    showHeatIndexRef.current = false;
    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);
    setHeatIndexData(null);

    // Hide heatmap layer
    if (map.current.getLayer("heat-index-heatmap")) {
      map.current.setLayoutProperty("heat-index-heatmap", "visibility", "none");
    }

    if (newShowWeather) {
      // Show elevation-based heights for weather mode
      const elevationCache = elevationCacheRef.current;
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        [
          "match",
          ["get", "adm4_psgc"],
          ...Object.entries(elevationCache).flatMap(([psgc, elevation]) => [
            parseInt(psgc),
            elevation * 15,
          ]),
          150,
        ]
      );
      // Enable colors
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#89cff0"
      );
    } else {
      // Show uniform flat height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#8AFF8A"
      );
    }

    // Reset opacity
    map.current.setPaintProperty(
      "combined-fill-3d",
      "fill-extrusion-opacity",
      0.5
    );
  };

  const togglePAR = () => {
    if (!map.current) return;

    const newShowPAR = !showPAR;
    setShowPAR(newShowPAR);
    setShowElevation(false);
    showElevationRef.current = false;
    setShowWeather(false);
    showWeatherRef.current = false;
    setShowHeatIndex(false);
    showHeatIndexRef.current = false;
    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);
    setHeatIndexData(null);

    // Hide heatmap layer
    if (map.current.getLayer("heat-index-heatmap")) {
      map.current.setLayoutProperty("heat-index-heatmap", "visibility", "none");
    }

    if (newShowPAR) {
      // Zoom out to PAR bounds
      if (parBoundsRef.current && !parBoundsRef.current.isEmpty()) {
        map.current.fitBounds(parBoundsRef.current, {
          padding: 150,
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
      }

      // Reset to flat uniform height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#8AFF8A"
      );
    } else {
      // Zoom back to default bounds
      if (defaultBoundsRef.current && !defaultBoundsRef.current.isEmpty()) {
        map.current.fitBounds(defaultBoundsRef.current, {
          padding: 40,
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
      }
    }

    // Reset opacity
    map.current.setPaintProperty(
      "combined-fill-3d",
      "fill-extrusion-opacity",
      0.5
    );
  };

  const toggleHeatIndex = async () => {
    if (!map.current) return;

    const newShowHeatIndex = !showHeatIndex;
    setShowHeatIndex(newShowHeatIndex);
    showHeatIndexRef.current = newShowHeatIndex;
    setShowElevation(false);
    showElevationRef.current = false;
    setShowWeather(false);
    showWeatherRef.current = false;
    setShowPAR(false);
    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);
    setHeatIndexData(null);

    if (newShowHeatIndex) {
      // Use cached data if available
      const heatIndexCache = heatIndexCacheRef.current;
      const heatmapPoints = heatmapPointsRef.current;

      // Only fetch if cache is empty
      if (Object.keys(heatIndexCache).length === 0) {
        setLoading(true);
      }

      // Update or create heatmap source
      if (map.current.getSource("heat-index-points")) {
        map.current.getSource("heat-index-points").setData({
          type: "FeatureCollection",
          features: heatmapPoints,
        });
      } else {
        map.current.addSource("heat-index-points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: heatmapPoints,
          },
        });
      }

      // Add or show heatmap layer
      if (!map.current.getLayer("heat-index-heatmap")) {
        map.current.addLayer(
          {
            id: "heat-index-heatmap",
            type: "heatmap",
            source: "heat-index-points",
            maxzoom: 15,
            paint: {
              // Increase weight as diameter increases
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "intensity"],
                0,
                0,
                1,
                1,
              ],
              // Increase intensity as zoom level increases
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                15,
                3,
              ],
              // Color ramp for heatmap - yellow to orange to red
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(255, 255, 0, 0)",
                0.2,
                "rgba(255, 255, 0, 0.5)",
                0.4,
                "rgba(255, 200, 0, 0.7)",
                0.6,
                "rgba(255, 150, 0, 0.8)",
                0.8,
                "rgba(255, 100, 0, 0.9)",
                1,
                "rgba(255, 0, 0, 1)",
              ],
              // Adjust the heatmap radius by zoom level
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                20,
                15,
                40,
              ],
              // Transition from heatmap to circle layer by zoom level
              "heatmap-opacity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                7,
                0.8,
                15,
                0.6,
              ],
            },
          },
          "combined-fill-3d"
        );
      } else {
        map.current.setLayoutProperty(
          "heat-index-heatmap",
          "visibility",
          "visible"
        );
      }

      // Apply heat index colors to polygons
      map.current.setPaintProperty("combined-fill-3d", "fill-extrusion-color", [
        "match",
        ["get", "adm4_psgc"],
        ...Object.entries(heatIndexCache).flatMap(([psgc, data]) => [
          parseInt(psgc),
          data.color,
        ]),
        "#FFFF00",
      ]);

      // Use flat heights for heat index view
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );

      // Increase opacity for better visibility with heatmap
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-opacity",
        0.6
      );
    } else {
      // Hide heatmap layer
      if (map.current.getLayer("heat-index-heatmap")) {
        map.current.setLayoutProperty(
          "heat-index-heatmap",
          "visibility",
          "none"
        );
      }

      // Reset to default
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#8AFF8A"
      );
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-opacity",
        0.5
      );
    }
  };

  const resetSelection = () => {
    if (!map.current) return;

    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);
    setHeatIndexData(null);

    if (showElevation || showWeather || showHeatIndex) {
      // Reset to original elevation heights
      const elevationCache = elevationCacheRef.current;
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        [
          "match",
          ["get", "adm4_psgc"],
          ...Object.entries(elevationCache).flatMap(([psgc, elevation]) => [
            parseInt(psgc),
            elevation * 15,
          ]),
          150,
        ]
      );
      // Enable colors
      if (showHeatIndex) {
        // Restore heat index colors
        const heatIndexCache = heatIndexCacheRef.current;
        map.current.setPaintProperty(
          "combined-fill-3d",
          "fill-extrusion-color",
          [
            "match",
            ["get", "adm4_psgc"],
            ...Object.entries(heatIndexCache).flatMap(([psgc, data]) => [
              parseInt(psgc),
              data.color,
            ]),
            "#FFFF00",
          ]
        );
      } else if (showWeather) {
        // Reset weather mode to all sky blue
        map.current.setPaintProperty(
          "combined-fill-3d",
          "fill-extrusion-color",
          "#89cff0"
        );
      } else {
        map.current.setPaintProperty(
          "combined-fill-3d",
          "fill-extrusion-color",
          [
            "match",
            ["get", "adm4_psgc"],
            ...Object.entries(BARANGAY_COLORS).flatMap(([psgc, color]) => [
              parseInt(psgc),
              color,
            ]),
            "#8AFF8A", // default color
          ]
        );
      }
    } else {
      // Reset to flat uniform height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      // Set to default color
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-color",
        "#8AFF8A"
      );
    }

    // Reset opacity
    map.current.setPaintProperty(
      "combined-fill-3d",
      "fill-extrusion-opacity",
      0.5
    );
  };

  const fetchWeatherData = async (lat, lon, barangayName, psgc) => {
    setLoading(true);
    try {
      // Get elevation from cache
      const elevation = elevationCacheRef.current[psgc] || 0;

      if (showWeatherRef.current) {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia/Manila`
        );
        const data = await response.json();

        setWeatherData({
          barangay: barangayName,
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          precipitation: data.current.precipitation,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
        });
      } else if (showElevationRef.current) {
        setElevationData({
          barangay: barangayName,
          elevation: elevation,
        });
      } else if (showHeatIndexRef.current) {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=Asia/Manila`
        );
        const data = await response.json();
        const temp = data.current.temperature_2m;
        const humidity = data.current.relative_humidity_2m;
        const apparentTemp = data.current.apparent_temperature;
        const category = getHeatIndexCategory(apparentTemp);

        setHeatIndexData({
          barangay: barangayName,
          temperature: temp,
          humidity: humidity,
          apparentTemperature: apparentTemp,
          category: category.category,
          color: category.color,
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (showWeatherRef.current) {
        setWeatherData({
          barangay: barangayName,
          error: "Unable to fetch weather data",
        });
      } else if (showHeatIndexRef.current) {
        setHeatIndexData({
          barangay: barangayName,
          error: "Unable to fetch heat index data",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
      zoom: 14.5,
      center: [121.0527, 14.5176],
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.current.on("load", async () => {
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id;

      map.current.addLayer(
        {
          id: "3d-buildings",
          source: "openmaptiles",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "render_height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "render_min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );

      const geojsonFiles = ["/data/taguig.geojson"];
      const parGeojsonFile = await fetch("/data/par.geojson");

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

      const parGeoJSON = await parGeojsonFile.json();

      // Calculate PAR bounds
      const parBounds = new maplibregl.LngLatBounds();
      if (parGeoJSON.features) {
        parGeoJSON.features.forEach((f) => {
          if (f.geometry.type === "Polygon") {
            f.geometry.coordinates[0].forEach(([lon, lat]) =>
              parBounds.extend([lon, lat])
            );
          } else if (f.geometry.type === "MultiPolygon") {
            f.geometry.coordinates
              .flat(2)
              .forEach(([lon, lat]) => parBounds.extend([lon, lat]));
          }
        });
      }
      parBoundsRef.current = parBounds;

      map.current.addSource("parBoundary", {
        type: "geojson",
        data: parGeoJSON,
      });

      map.current.addLayer({
        id: "par-border",
        type: "line",
        source: "parBoundary",
        maxzoom: 8,
        paint: {
          "line-color": "#0066FF",
          "line-width": 2,
          "line-dasharray": [3, 2],
        },
      });

      map.current.addSource("combinedBoundaries", {
        type: "geojson",
        data: combinedGeoJSON,
      });

      const elevationCache = {};

      const fetchAllElevations = async () => {
        const promises = combinedGeoJSON.features.map(async (feature) => {
          let coords = [];
          if (feature.geometry.type === "Polygon") {
            coords = feature.geometry.coordinates[0];
          } else if (feature.geometry.type === "MultiPolygon") {
            coords = feature.geometry.coordinates[0][0];
          }

          let lonSum = 0,
            latSum = 0;
          coords.forEach(([lon, lat]) => {
            lonSum += lon;
            latSum += lat;
          });
          const centroidLon = lonSum / coords.length;
          const centroidLat = latSum / coords.length;

          try {
            const response = await fetch(
              `https://api.open-elevation.com/api/v1/lookup?locations=${centroidLat},${centroidLon}`
            );
            const data = await response.json();
            const elevation = data.results[0]?.elevation || 10;
            elevationCache[feature.properties.adm4_psgc] = elevation;
          } catch (error) {
            console.error("Error fetching elevation:", error);
            elevationCache[feature.properties.adm4_psgc] = 10;
          }
        });

        await Promise.all(promises);
      };

      await fetchAllElevations();

      elevationCacheRef.current = elevationCache;

      const fetchAllHeatIndex = async () => {
        const heatIndexCache = {};
        const heatmapPoints = [];

        const promises = combinedGeoJSON.features.map(async (feature) => {
          let coords = [];
          if (feature.geometry.type === "Polygon") {
            coords = feature.geometry.coordinates[0];
          } else if (feature.geometry.type === "MultiPolygon") {
            coords = feature.geometry.coordinates[0][0];
          }

          let lonSum = 0,
            latSum = 0;
          coords.forEach(([lon, lat]) => {
            lonSum += lon;
            latSum += lat;
          });
          const centroidLon = lonSum / coords.length;
          const centroidLat = latSum / coords.length;

          try {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${centroidLat}&longitude=${centroidLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=Asia/Manila`
            );
            const data = await response.json();
            const apparentTemp = data.current.apparent_temperature;
            const category = getHeatIndexCategory(apparentTemp);

            // Normalize temperature to 0-1 range (assuming 20-45°C range)
            const intensity = Math.max(
              0,
              Math.min(1, (apparentTemp - 20) / 25)
            );

            return {
              psgc: feature.properties.adm4_psgc,
              heatIndexData: {
                apparentTemp,
                color: category.color,
                level: category.level,
              },
              heatmapPoint: {
                type: "Feature",
                properties: {
                  intensity: intensity,
                },
                geometry: {
                  type: "Point",
                  coordinates: [centroidLon, centroidLat],
                },
              },
            };
          } catch (error) {
            console.error("Error fetching heat index data:", error);
            return {
              psgc: feature.properties.adm4_psgc,
              heatIndexData: {
                apparentTemp: 25,
                color: "#FFFF00",
                level: 1,
              },
              heatmapPoint: {
                type: "Feature",
                properties: {
                  intensity: 0.2,
                },
                geometry: {
                  type: "Point",
                  coordinates: [centroidLon, centroidLat],
                },
              },
            };
          }
        });

        const results = await Promise.all(promises);

        results.forEach((result) => {
          heatIndexCache[result.psgc] = result.heatIndexData;
          heatmapPoints.push(result.heatmapPoint);
        });

        return { heatIndexCache, heatmapPoints };
      };

      const { heatIndexCache, heatmapPoints } = await fetchAllHeatIndex();
      heatIndexCacheRef.current = heatIndexCache;
      heatmapPointsRef.current = heatmapPoints;

      map.current.addLayer({
        id: "combined-fill-3d",
        type: "fill-extrusion",
        source: "combinedBoundaries",
        paint: {
          "fill-extrusion-color": "#8AFF8A",
          "fill-extrusion-opacity": 0.5,
          "fill-extrusion-height": 150,
          "fill-extrusion-base": 0,
        },
      });

      // ADD BARANGAY LABELS
      map.current.addLayer({
        id: "barangay-labels",
        type: "symbol",
        source: "combinedBoundaries",
        minzoom: 10,

        layout: {
          "text-field": ["get", "adm4_en"],
          "text-font": ["Open Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 0],
          "text-anchor": "center",
          "text-allow-overlap": true,
          "text-ignore-placement": true,
        },

        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 2,
        },
      });

      map.current.on("click", "combined-fill-3d", (e) => {
        if (e.features.length > 0) {
          const clickedFeature = e.features[0];
          const clickedPsgc = clickedFeature.properties.adm4_psgc;
          const barangayName = clickedFeature.properties.adm4_en || "Unknown";

          // Find the clicked feature in combinedGeoJSON
          const fullFeature = combinedGeoJSON.features.find(
            (f) => f.properties.adm4_psgc === clickedPsgc
          );

          if (!fullFeature) return;

          setSelectedBarangay(clickedPsgc);

          // Calculate centroid from the full feature
          let coords = [];
          if (fullFeature.geometry.type === "Polygon") {
            coords = fullFeature.geometry.coordinates[0];
          } else if (fullFeature.geometry.type === "MultiPolygon") {
            coords = fullFeature.geometry.coordinates[0][0];
          }

          let centerLon = 0,
            centerLat = 0;
          coords.forEach(([lon, lat]) => {
            centerLon += lon;
            centerLat += lat;
          });
          centerLon /= coords.length;
          centerLat /= coords.length;

          // Use ref to get current state
          const isElevationOn = showElevationRef.current;
          const isWeatherOn = showWeatherRef.current;
          const isHeatIndexOn = showHeatIndexRef.current;

          // Fetch data and show modal only if a mode is on
          if (isElevationOn || isWeatherOn || isHeatIndexOn) {
            fetchWeatherData(centerLat, centerLon, barangayName, clickedPsgc);
            setShowModal(true);
          }

          if (isElevationOn || isWeatherOn || isHeatIndexOn) {
            map.current.easeTo({
              center: [centerLon, centerLat],
              zoom: 14,
              pitch: 60,
              bearing: -17.6,
              duration: 1500,
            });
            setIs3D(true);
          }

          // Update color based on selection
          if (isElevationOn) {
            // When elevation or weather is ON, keep the colorful scheme but highlight selected
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                [
                  "match",
                  ["get", "adm4_psgc"],
                  ...Object.entries(BARANGAY_COLORS).flatMap(
                    ([psgc, color]) => [parseInt(psgc), color]
                  ),
                  "#8AFF8A",
                ],
                [
                  "match",
                  ["get", "adm4_psgc"],
                  ...Object.entries(BARANGAY_COLORS).flatMap(
                    ([psgc, color]) => [parseInt(psgc), color]
                  ),
                  "#8AFF8A",
                ],
              ]
            );
          } else if (isHeatIndexOn) {
            // Keep heat index colors when clicked
            const heatIndexCache = heatIndexCacheRef.current;
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "match",
                ["get", "adm4_psgc"],
                ...Object.entries(heatIndexCache).flatMap(([psgc, data]) => [
                  parseInt(psgc),
                  data.color,
                ]),
                "#FFFF00",
              ]
            );
          } else if (isWeatherOn) {
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                "#0000FF", // Blue for clicked/selected barangay
                "#89cff0", // Sky blue for all other barangays
              ]
            );
          } else {
            // When all modes are OFF, change from default to blue for selected
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                "#22577A", // Blue for selected
                "#8AFF8A", // Default for others
              ]
            );
          }

          map.current.setPaintProperty(
            "combined-fill-3d",
            "fill-extrusion-height",
            [
              "case",
              ["==", ["get", "adm4_psgc"], clickedPsgc],
              [
                "match",
                ["get", "adm4_psgc"],
                ...Object.entries(elevationCache).flatMap(
                  ([psgc, elevation]) => [parseInt(psgc), elevation * 50]
                ),
                500,
              ],
              0,
            ]
          );

          map.current.setPaintProperty(
            "combined-fill-3d",
            "fill-extrusion-opacity",
            ["case", ["==", ["get", "adm4_psgc"], clickedPsgc], 0.8, 0.2]
          );
        }
      });

      map.current.on("mouseenter", "combined-fill-3d", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "combined-fill-3d", () => {
        map.current.getCanvas().style.cursor = "";
      });

      map.current.addLayer({
        id: "combined-border",
        type: "line",
        source: "combinedBoundaries",
        paint: {
          "line-color": "#FFFFFF",
          "line-width": 2.5,
        },
      });

      geojsons.forEach((geojson, i) => {
        const features = geojson.features || [geojson];

        features.forEach((feature) => {
          if (feature.geometry?.type === "Point") {
            const [lon, lat] = feature.geometry.coordinates;
            const name =
              feature.properties?.name ||
              geojsonFiles[i].split("/").pop().replace(".geojson", "");

            const el = document.createElement("div");
            el.className = "marker";
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.backgroundColor = "#FF0000";
            el.style.borderRadius = "50%";
            el.style.border = "2px solid white";
            el.style.cursor = "pointer";
            el.style.boxShadow = "0 0 5px rgba(0,0,0,0.3)";

            const popup = new maplibregl.Popup({ offset: 25 }).setText(name);

            new maplibregl.Marker(el)
              .setLngLat([lon, lat])
              .setPopup(popup)
              .addTo(map.current);
          }
        });
      });

      const bounds = new maplibregl.LngLatBounds();
      combinedGeoJSON.features.forEach((f) => {
        if (f.geometry.type === "Polygon") {
          f.geometry.coordinates[0].forEach(([lon, lat]) =>
            bounds.extend([lon, lat])
          );
        } else if (f.geometry.type === "MultiPolygon") {
          f.geometry.coordinates
            .flat(2)
            .forEach(([lon, lat]) => bounds.extend([lon, lat]));
        }
      });

      // Store default bounds
      defaultBoundsRef.current = bounds;

      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 40,
          pitch: 0,
          bearing: 0,
        });
      }
    });

    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      "bottom-right"
    );

    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enableRotation();
  }, [showElevation, showWeather, showHeatIndex]);

  return (
    <div className="relative w-full h-[88vh]">
      <div className="relative w-full h-full">
        <MapButtons
          is3D={is3D}
          showElevation={showElevation}
          showWeather={showWeather}
          showPAR={showPAR}
          showHeatIndex={showHeatIndex}
          selectedBarangay={selectedBarangay}
          onToggle2D3D={toggle2D3D}
          onToggleElevation={toggleElevation}
          onToggleWeather={toggleWeather}
          onTogglePAR={togglePAR}
          onToggleHeatIndex={toggleHeatIndex}
          onReset={resetSelection}
        />
        {/* Elevation Modal */}
        {showElevation && (
          <ElevationInfoModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            elevationData={elevationData}
          />
        )}

        {/* Weather Modal */}
        {showWeather && (
          <WeatherInfoModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            weatherData={weatherData}
            loading={loading}
            getWeatherDescription={getWeatherDescription}
          />
        )}

        {/* Heat Index Modal */}
        {showHeatIndex && (
          <HeatIndexInfoModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            heatIndexData={heatIndexData}
            loading={loading}
          />
        )}

        {/* Heat Index Legend */}
        {showHeatIndex && (
          <div className="absolute bottom-2.5 left-2.5 bg-white rounded-lg shadow-lg p-4 z-40">
            <h4 className="text-sm font-bold text-gray-800 mb-2">
              Heat Index Scale
            </h4>
            <WarningLegend data={HEAT_LEVELS} />
          </div>
        )}

        <div ref={mapContainer} className="w-full h-full rounded-lg" />
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default MapViewV2;
