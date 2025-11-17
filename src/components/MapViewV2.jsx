import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapViewV2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [showElevation, setShowElevation] = useState(false);
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
        "interpolate",
        ["linear"],
        ["get", "adm4_psgc"],
        1381500001,
        "hsl(0, 70%, 50%)",
        1381500002,
        "hsl(137.5, 70%, 50%)",
        1381500003,
        "hsl(275, 70%, 50%)",
        1381500004,
        "hsl(52.5, 70%, 50%)",
        1381500005,
        "hsl(190, 70%, 50%)",
        1381500006,
        "hsl(327.5, 70%, 50%)",
        1381500007,
        "hsl(105, 70%, 50%)",
        1381500008,
        "hsl(242.5, 70%, 50%)",
        1381500009,
        "hsl(20, 70%, 50%)",
        1381500010,
        "hsl(157.5, 70%, 50%)",
        1381500011,
        "hsl(295, 70%, 50%)",
        1381500012,
        "hsl(72.5, 70%, 50%)",
        1381500013,
        "hsl(210, 70%, 50%)",
        1381500014,
        "hsl(347.5, 70%, 50%)",
        1381500015,
        "hsl(125, 70%, 50%)",
        1381500016,
        "hsl(262.5, 70%, 50%)",
        1381500017,
        "hsl(40, 70%, 50%)",
        1381500018,
        "hsl(177.5, 70%, 50%)",
        1381500019,
        "hsl(315, 70%, 50%)",
        1381500020,
        "hsl(92.5, 70%, 50%)",
        1381500021,
        "hsl(230, 70%, 50%)",
        1381500022,
        "hsl(7.5, 70%, 50%)",
        1381500023,
        "hsl(145, 70%, 50%)",
        1381500024,
        "hsl(282.5, 70%, 50%)",
        1381500025,
        "hsl(60, 70%, 50%)",
        1381500026,
        "hsl(197.5, 70%, 50%)",
        1381500027,
        "hsl(335, 70%, 50%)",
        1381500028,
        "hsl(112.5, 70%, 50%)",
        1381500029,
        "hsl(250, 70%, 50%)",
        1381500030,
        "hsl(27.5, 70%, 50%)",
        1381500031,
        "hsl(165, 70%, 50%)",
        1381500032,
        "hsl(302.5, 70%, 50%)",
        1381500033,
        "hsl(80, 70%, 50%)",
        1381500034,
        "hsl(217.5, 70%, 50%)",
        1381500035,
        "hsl(355, 70%, 50%)",
        1381500036,
        "hsl(132.5, 70%, 50%)",
        1381500037,
        "hsl(270, 70%, 50%)",
        1381500038,
        "hsl(47.5, 70%, 50%)",
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
        "interpolate",
        ["linear"],
        ["get", "adm4_psgc"],
        1381500001,
        "hsl(0, 70%, 50%)",
        1381500002,
        "hsl(137.5, 70%, 50%)",
        1381500003,
        "hsl(275, 70%, 50%)",
        1381500004,
        "hsl(52.5, 70%, 50%)",
        1381500005,
        "hsl(190, 70%, 50%)",
        1381500006,
        "hsl(327.5, 70%, 50%)",
        1381500007,
        "hsl(105, 70%, 50%)",
        1381500008,
        "hsl(242.5, 70%, 50%)",
        1381500009,
        "hsl(20, 70%, 50%)",
        1381500010,
        "hsl(157.5, 70%, 50%)",
        1381500011,
        "hsl(295, 70%, 50%)",
        1381500012,
        "hsl(72.5, 70%, 50%)",
        1381500013,
        "hsl(210, 70%, 50%)",
        1381500014,
        "hsl(347.5, 70%, 50%)",
        1381500015,
        "hsl(125, 70%, 50%)",
        1381500016,
        "hsl(262.5, 70%, 50%)",
        1381500017,
        "hsl(40, 70%, 50%)",
        1381500018,
        "hsl(177.5, 70%, 50%)",
        1381500019,
        "hsl(315, 70%, 50%)",
        1381500020,
        "hsl(92.5, 70%, 50%)",
        1381500021,
        "hsl(230, 70%, 50%)",
        1381500022,
        "hsl(7.5, 70%, 50%)",
        1381500023,
        "hsl(145, 70%, 50%)",
        1381500024,
        "hsl(282.5, 70%, 50%)",
        1381500025,
        "hsl(60, 70%, 50%)",
        1381500026,
        "hsl(197.5, 70%, 50%)",
        1381500027,
        "hsl(335, 70%, 50%)",
        1381500028,
        "hsl(112.5, 70%, 50%)",
        1381500029,
        "hsl(250, 70%, 50%)",
        1381500030,
        "hsl(27.5, 70%, 50%)",
        1381500031,
        "hsl(165, 70%, 50%)",
        1381500032,
        "hsl(302.5, 70%, 50%)",
        1381500033,
        "hsl(80, 70%, 50%)",
        1381500034,
        "hsl(217.5, 70%, 50%)",
        1381500035,
        "hsl(355, 70%, 50%)",
        1381500036,
        "hsl(132.5, 70%, 50%)",
        1381500037,
        "hsl(270, 70%, 50%)",
        1381500038,
        "hsl(47.5, 70%, 50%)",
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

      map.current.on("click", "combined-fill-3d", (e) => {
        if (e.features.length > 0) {
          const clickedFeature = e.features[0];
          const clickedPsgc = clickedFeature.properties.adm4_psgc;

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

          console.log("Clicked barangay:", clickedPsgc);
          console.log("Elevation ON:", isElevationOn);
          console.log("Center:", centerLon, centerLat);

          if (isElevationOn) {
            console.log("Zooming to barangay...");
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
                  "interpolate",
                  ["linear"],
                  ["get", "adm4_psgc"],
                  1381500001,
                  "hsl(0, 70%, 50%)",
                  1381500002,
                  "hsl(137.5, 70%, 50%)",
                  1381500003,
                  "hsl(275, 70%, 50%)",
                  1381500004,
                  "hsl(52.5, 70%, 50%)",
                  1381500005,
                  "hsl(190, 70%, 50%)",
                  1381500006,
                  "hsl(327.5, 70%, 50%)",
                  1381500007,
                  "hsl(105, 70%, 50%)",
                  1381500008,
                  "hsl(242.5, 70%, 50%)",
                  1381500009,
                  "hsl(20, 70%, 50%)",
                  1381500010,
                  "hsl(157.5, 70%, 50%)",
                  1381500011,
                  "hsl(295, 70%, 50%)",
                  1381500012,
                  "hsl(72.5, 70%, 50%)",
                  1381500013,
                  "hsl(210, 70%, 50%)",
                  1381500014,
                  "hsl(347.5, 70%, 50%)",
                  1381500015,
                  "hsl(125, 70%, 50%)",
                  1381500016,
                  "hsl(262.5, 70%, 50%)",
                  1381500017,
                  "hsl(40, 70%, 50%)",
                  1381500018,
                  "hsl(177.5, 70%, 50%)",
                  1381500019,
                  "hsl(315, 70%, 50%)",
                  1381500020,
                  "hsl(92.5, 70%, 50%)",
                  1381500021,
                  "hsl(230, 70%, 50%)",
                  1381500022,
                  "hsl(7.5, 70%, 50%)",
                  1381500023,
                  "hsl(145, 70%, 50%)",
                  1381500024,
                  "hsl(282.5, 70%, 50%)",
                  1381500025,
                  "hsl(60, 70%, 50%)",
                  1381500026,
                  "hsl(197.5, 70%, 50%)",
                  1381500027,
                  "hsl(335, 70%, 50%)",
                  1381500028,
                  "hsl(112.5, 70%, 50%)",
                  1381500029,
                  "hsl(250, 70%, 50%)",
                  1381500030,
                  "hsl(27.5, 70%, 50%)",
                  1381500031,
                  "hsl(165, 70%, 50%)",
                  1381500032,
                  "hsl(302.5, 70%, 50%)",
                  1381500033,
                  "hsl(80, 70%, 50%)",
                  1381500034,
                  "hsl(217.5, 70%, 50%)",
                  1381500035,
                  "hsl(355, 70%, 50%)",
                  1381500036,
                  "hsl(132.5, 70%, 50%)",
                  1381500037,
                  "hsl(270, 70%, 50%)",
                  1381500038,
                  "hsl(47.5, 70%, 50%)",
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
                "#22577A", // Bright red for selected
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
          "line-color": [
            "match",
            ["get", "id"],
            1381500001,
            "hsl(0, 70%, 40%)",
            1381500002,
            "hsl(137.5, 70%, 40%)",
            1381500003,
            "hsl(275, 70%, 40%)",
            1381500004,
            "hsl(52.5, 70%, 40%)",
            1381500005,
            "hsl(190, 70%, 40%)",
            1381500006,
            "hsl(327.5, 70%, 40%)",
            1381500007,
            "hsl(105, 70%, 40%)",
            1381500008,
            "hsl(242.5, 70%, 40%)",
            1381500009,
            "hsl(20, 70%, 40%)",
            1381500010,
            "hsl(157.5, 70%, 40%)",
            1381500011,
            "hsl(295, 70%, 40%)",
            1381500012,
            "hsl(72.5, 70%, 40%)",
            1381500013,
            "hsl(210, 70%, 40%)",
            1381500014,
            "hsl(347.5, 70%, 40%)",
            1381500015,
            "hsl(125, 70%, 40%)",
            1381500016,
            "hsl(262.5, 70%, 40%)",
            1381500017,
            "hsl(40, 70%, 40%)",
            1381500018,
            "hsl(177.5, 70%, 40%)",
            1381500019,
            "hsl(315, 70%, 40%)",
            1381500020,
            "hsl(92.5, 70%, 40%)",
            1381500021,
            "hsl(230, 70%, 40%)",
            1381500022,
            "hsl(7.5, 70%, 40%)",
            1381500023,
            "hsl(145, 70%, 40%)",
            1381500024,
            "hsl(282.5, 70%, 40%)",
            1381500025,
            "hsl(60, 70%, 40%)",
            1381500026,
            "hsl(197.5, 70%, 40%)",
            1381500027,
            "hsl(335, 70%, 40%)",
            1381500028,
            "hsl(112.5, 70%, 40%)",
            1381500029,
            "hsl(250, 70%, 40%)",
            1381500030,
            "hsl(27.5, 70%, 40%)",
            1381500031,
            "hsl(165, 70%, 40%)",
            1381500032,
            "hsl(302.5, 70%, 40%)",
            1381500033,
            "hsl(80, 70%, 40%)",
            1381500034,
            "hsl(217.5, 70%, 40%)",
            1381500035,
            "hsl(355, 70%, 40%)",
            1381500036,
            "hsl(132.5, 70%, 40%)",
            1381500037,
            "hsl(270, 70%, 40%)",
            1381500038,
            "hsl(47.5, 70%, 40%)",
            "#FFFFFF",
          ],
          "line-width": 2.5,
        },
      });

      geojsons.forEach((geojson) => {
        const features = geojson.features || [geojson];

        features.forEach((feature, index) => {
          if (
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            let coords = [];
            if (feature.geometry.type === "Polygon") {
              coords = feature.geometry.coordinates[0];
            } else if (feature.geometry.type === "MultiPolygon") {
              coords = feature.geometry.coordinates[0][0];
            }

            const isPointInPolygon = (point, polygon) => {
              let inside = false;
              for (
                let i = 0, j = polygon.length - 1;
                i < polygon.length;
                j = i++
              ) {
                const xi = polygon[i][0],
                  yi = polygon[i][1];
                const xj = polygon[j][0],
                  yj = polygon[j][1];
                const intersect =
                  yi > point[1] !== yj > point[1] &&
                  point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
                if (intersect) inside = !inside;
              }
              return inside;
            };

            let area = 0;
            let centroidLon = 0;
            let centroidLat = 0;

            for (let i = 0; i < coords.length - 1; i++) {
              const [x0, y0] = coords[i];
              const [x1, y1] = coords[i + 1];
              const a = x0 * y1 - x1 * y0;
              area += a;
              centroidLon += (x0 + x1) * a;
              centroidLat += (y0 + y1) * a;
            }

            area *= 0.5;
            centroidLon /= 6 * area;
            centroidLat /= 6 * area;

            if (!isPointInPolygon([centroidLon, centroidLat], coords)) {
              let minLon = Infinity,
                maxLon = -Infinity;
              let minLat = Infinity,
                maxLat = -Infinity;

              coords.forEach(([lon, lat]) => {
                minLon = Math.min(minLon, lon);
                maxLon = Math.max(maxLon, lon);
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
              });

              centroidLon = (minLon + maxLon) / 2;
              centroidLat = (minLat + maxLat) / 2;
            }

            const name = feature.properties?.adm4_en || `Barangay ${index + 1}`;

            const labelSourceId = `label-${
              feature.properties?.adm4_psgc || index
            }`;
            map.current.addSource(labelSourceId, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [centroidLon, centroidLat],
                },
                properties: {
                  name: name,
                },
              },
            });

            map.current.addLayer({
              id: `label-layer-${feature.properties?.adm4_psgc || index}`,
              type: "symbol",
              source: labelSourceId,
              layout: {
                "text-field": ["get", "name"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-offset": [0, 0],
                "text-anchor": "center",
              },
              paint: {
                "text-color": "#000000",
                "text-halo-color": "#FFFFFF",
                "text-halo-width": 2,
              },
            });
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
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
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

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      />
    </div>
  );
};

export default MapViewV2;
