import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { WEATHER_CODES } from "../constants/weatherCode";
import { BARANGAY_COLORS } from "../constants/mapColors";
import ActionButton from "./Button/ActionButton";
import WeatherInfoModal from "./Modal/WeatherInfoModal";
import ElevationInfoModal from "./Modal/ElevationInfoModal";

const MapViewV2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [showElevation, setShowElevation] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showPAR, setShowPAR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [elevationData, setElevationData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const elevationCacheRef = useRef({});
  const showElevationRef = useRef(false);
  const showWeatherRef = useRef(false);
  const parBoundsRef = useRef(null);
  const defaultBoundsRef = useRef(null);

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

  const resetSelection = () => {
    if (!map.current) return;

    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);

    if (showElevation || showWeather) {
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
      map.current.setPaintProperty("combined-fill-3d", "fill-extrusion-color", [
        "match",
        ["get", "adm4_psgc"],
        ...Object.entries(BARANGAY_COLORS).flatMap(([psgc, color]) => [
          parseInt(psgc),
          color,
        ]),
        "#8AFF8A", // default color
      ]);
    } else {
      // Reset to flat uniform height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      // Set to dark red color
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

  const toggleElevation = () => {
    if (!map.current) return;

    const newShowElevation = !showElevation;
    setShowElevation(newShowElevation);
    showElevationRef.current = newShowElevation;
    setShowWeather(false); // Turn off weather when elevation is toggled
    showWeatherRef.current = false;
    setShowPAR(false); // Turn off PAR when elevation is toggled
    setSelectedBarangay(null); // Reset selection when toggling
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);

    if (newShowElevation) {
      // Zoom to default bounds
      if (defaultBoundsRef.current && !defaultBoundsRef.current.isEmpty()) {
        map.current.fitBounds(defaultBoundsRef.current, {
          padding: 40,
          pitch: 0,
          bearing: 0,
          duration: 1000,
        });
      }

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
        "#8AFF8A", // default color
      ]);
    } else {
      // Show uniform flat height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      // Set to dark red color
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
    setShowElevation(false); // Turn off elevation when weather is toggled
    showElevationRef.current = false;
    setShowPAR(false); // Turn off PAR when weather is toggled
    setSelectedBarangay(null); // Reset selection when toggling
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);

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
      map.current.setPaintProperty("combined-fill-3d", "fill-extrusion-color", [
        "match",
        ["get", "adm4_psgc"],
        ...Object.entries(BARANGAY_COLORS).flatMap(([psgc, color]) => [
          parseInt(psgc),
          color,
        ]),
        "#8AFF8A", // default color
      ]);
    } else {
      // Show uniform flat height
      map.current.setPaintProperty(
        "combined-fill-3d",
        "fill-extrusion-height",
        150
      );
      // Set to dark red color
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
    setShowElevation(false); // Turn off elevation when PAR is toggled
    showElevationRef.current = false;
    setShowWeather(false); // Turn off weather when PAR is toggled
    showWeatherRef.current = false;
    setSelectedBarangay(null);
    setShowModal(false);
    setWeatherData(null);
    setElevationData(null);

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
      // Set to dark red color
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

  const fetchWeatherData = async (lat, lon, barangayName, psgc) => {
    setLoadingWeather(true);
    try {
      // Get elevation from cache
      const elevation = elevationCacheRef.current[psgc] || 0;

      // Only fetch weather if weather mode is on
      if (showWeatherRef.current) {
        // Using Open-Meteo API (free, no API key needed)
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
        // Only show elevation data
        setElevationData({
          barangay: barangayName,
          elevation: elevation,
        });
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      if (showWeatherRef.current) {
        setWeatherData({
          barangay: barangayName,
          error: "Unable to fetch weather data",
        });
      }
    } finally {
      setLoadingWeather(false);
    }
  };

  const getWeatherDescription = (code) => {
    return WEATHER_CODES[code] || "Unknown";
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
        id: "par-fill",
        type: "fill",
        source: "parBoundary",
        maxzoom: 8,
        paint: {
          "fill-color": "#0066FF",
          "fill-opacity": 0.15,
        },
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

          // Use ref to get current elevation state
          const isElevationOn = showElevationRef.current;
          const isWeatherOn = showWeatherRef.current;

          // Fetch weather data and show modal only if either mode is on
          if (isElevationOn || isWeatherOn) {
            fetchWeatherData(centerLat, centerLon, barangayName, clickedPsgc);
            setShowModal(true);
          }

          if (isElevationOn || isWeatherOn) {
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
          if (isElevationOn || isWeatherOn) {
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
              ]
            );
          } else {
            // When both are OFF, change from dark red to blue for selected
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                "#22577A", // Blue for selected
                "#8AFF8A", // Dark red for others
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
  }, [showElevation, showWeather]);

  return (
    <div className="relative w-full h-[88vh]">
      <div className="relative w-full h-full">
        <div className="absolute z-1000 flex gap-2.5 bg-white rounded-lg p-2.5 shadow-md top-2.5 left-2.5">
          <ActionButton
            label="2D"
            onClick={toggle2D3D}
            className={`${
              !is3D
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            label="3D"
            onClick={toggle2D3D}
            className={`${
              is3D
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="Elevation ON"
            inactiveLabel="Elevation OFF"
            isActive={showElevation}
            onClick={toggleElevation}
            className={`${
              showElevation
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="Weather ON"
            inactiveLabel="Weather OFF"
            isActive={showWeather}
            onClick={toggleWeather}
            className={`${
              showWeather
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="PAR ON"
            inactiveLabel="PAR OFF"
            isActive={showPAR}
            onClick={togglePAR}
            className={`${
              showPAR
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="Wind ON"
            inactiveLabel="Wind OFF"
            // isActive={showPAR}
            // onClick={togglePAR}
            className={`${
              showPAR
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="Heat ON"
            inactiveLabel="Heat OFF"
            // isActive={showPAR}
            // onClick={togglePAR}
            className={`${
              showPAR
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          <ActionButton
            activeLabel="Rain ON"
            inactiveLabel="Rain OFF"
            // isActive={showPAR}
            // onClick={togglePAR}
            className={`${
              showPAR
                ? "bg-blue-500 text-white hover:text-white"
                : "bg-gray-100 text-gray-800 hover:text-gray-800"
            }`}
          />

          {selectedBarangay && (
            <ActionButton
              label="Reset"
              onClick={resetSelection}
              className="py-2.5 px-5 rounded-md border-0 bg-red-500 text-white font-semibold cursor-pointer transition-all duration-300 ease-in-out text-[14px]"
            />
          )}
        </div>

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
            loading={loadingWeather}
            getWeatherDescription={getWeatherDescription}
          />
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
