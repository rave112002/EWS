import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { WEATHER_CODES } from "../constants/weatherCode";
import { BARANGAY_COLORS } from "../constants/mapColors";

const MapViewV2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [showElevation, setShowElevation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const elevationCacheRef = useRef({});
  const showElevationRef = useRef(false);

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

    if (showElevation) {
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
        "#990F02", // default color
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
        "#990F02"
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
    setSelectedBarangay(null); // Reset selection when toggling
    setShowModal(false);

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
        "#990F02", // default color
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
        "#990F02"
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
    setLoadingWeather(true);
    try {
      // Using Open-Meteo API (free, no API key needed)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia/Manila`
      );
      const data = await response.json();

      // Get elevation from cache
      const elevation = elevationCacheRef.current[psgc] || 0;

      setWeatherData({
        barangay: barangayName,
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        precipitation: data.current.precipitation,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        elevation: elevation,
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeatherData({
        barangay: barangayName,
        error: "Unable to fetch weather data",
      });
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

      const parGeoJSON = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: "Philippine Area of Responsibility (PAR)",
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [115, 5],
                  [115, 15],
                  [120, 21],
                  [120, 25],
                  [135, 25],
                  [135, 5],
                  [115, 5],
                ],
              ],
            },
          },
        ],
      };

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
          "fill-extrusion-color": "#990F02",
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
        minzoom: 10, // optional: show earlier if you want

        layout: {
          "text-field": ["get", "adm4_en"],
          "text-font": ["Open Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 0],
          "text-anchor": "center",

          // 👇 VERY IMPORTANT
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

          // Fetch weather data and show modal
          fetchWeatherData(centerLat, centerLon, barangayName, clickedPsgc);
          setShowModal(true);

          if (isElevationOn) {
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
            // When elevation is ON, keep the colorful scheme but highlight selected
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                // Bright red for selected
                [
                  "match",
                  ["get", "adm4_psgc"],
                  ...Object.entries(BARANGAY_COLORS).flatMap(
                    ([psgc, color]) => [parseInt(psgc), color]
                  ),
                  "#990F02",
                ],
              ]
            );
          } else {
            // When elevation is OFF, change from dark red to bright red for selected
            map.current.setPaintProperty(
              "combined-fill-3d",
              "fill-extrusion-color",
              [
                "case",
                ["==", ["get", "adm4_psgc"], clickedPsgc],
                "#22577A", // Blue for selected
                "#990F02", // Dark red for others
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
      "top-right"
    );

    map.current.dragRotate.enable();
    map.current.touchZoomRotate.enableRotation();
  }, [showElevation]);

  return (
    <div style={{ position: "relative", width: "100%", height: "88vh" }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            display: "flex",
            gap: "10px",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <button
            onClick={toggle2D3D}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: !is3D ? "#FF0000" : "#f0f0f0",
              color: !is3D ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
            }}
          >
            2D
          </button>
          <button
            onClick={toggle2D3D}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: is3D ? "#FF0000" : "#f0f0f0",
              color: is3D ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
            }}
          >
            3D
          </button>
          <button
            onClick={toggleElevation}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: showElevation ? "#2196F3" : "#f0f0f0",
              color: showElevation ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
            }}
          >
            {showElevation ? "Elevation ON" : "Elevation OFF"}
          </button>

          <button
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: showElevation ? "#2196F3" : "#f0f0f0",
              color: showElevation ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: "14px",
            }}
          >
            Weather
          </button>
          {selectedBarangay && (
            <button
              onClick={resetSelection}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#4CAF50",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "14px",
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* Weather Modal - Inside Map on Right Side */}
        {showModal && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              bottom: "20px",
              width: "380px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              overflowY: "auto",
              padding: "24px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "24px", color: "#333" }}>
                {weatherData?.barangay || "Loading..."}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "28px",
                  cursor: "pointer",
                  color: "#666",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  lineHeight: "30px",
                }}
              >
                ×
              </button>
            </div>

            {loadingWeather ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div
                  style={{
                    border: "4px solid #f3f3f3",
                    borderTop: "4px solid #3498db",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto",
                  }}
                ></div>
                <p style={{ marginTop: "10px", color: "#666" }}>
                  Loading weather data...
                </p>
              </div>
            ) : weatherData?.error ? (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#e74c3c",
                }}
              >
                <p>{weatherData.error}</p>
              </div>
            ) : weatherData ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Temperature
                    </div>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#FF6B6B",
                      }}
                    >
                      {weatherData.temperature}°C
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Humidity
                    </div>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: "bold",
                        color: "#4ECDC4",
                      }}
                    >
                      {weatherData.humidity}%
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#e3f2fd",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Wind Speed
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#2196F3",
                      }}
                    >
                      {weatherData.windSpeed} km/h
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#e8f5e9",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Precipitation
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#4CAF50",
                      }}
                    >
                      {weatherData.precipitation} mm
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      backgroundColor: "#fce4ec",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                      }}
                    >
                      Elevation
                    </div>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        color: "#E91E63",
                      }}
                    >
                      {weatherData.elevation.toFixed(2)} meters
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#fff3e0",
                    borderRadius: "8px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "4px",
                    }}
                  >
                    Weather Condition
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#FF9800",
                    }}
                  >
                    {getWeatherDescription(weatherData.weatherCode)}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    textAlign: "center",
                    marginTop: "8px",
                  }}
                >
                  Data from Open-Meteo API • Asia/Manila timezone
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div
          ref={mapContainer}
          style={{ width: "100%", height: "100%", borderRadius: "8px" }}
        />
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
