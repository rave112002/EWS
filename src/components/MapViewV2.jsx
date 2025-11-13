import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapViewV2 = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [is3D, setIs3D] = useState(true);

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

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
      zoom: 14.5,
      center: [121.0527, 14.5176],
      pitch: 60, // Tilt the map (0-85 degrees)
      bearing: -17.6, // Rotate the map
      antialias: true, // Enable smooth 3D rendering
    });

    map.current.on("load", async () => {
      // Add 3D buildings layer
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      )?.id;

      // Add 3D building extrusions
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

      // ✅ List of GeoJSON files
      const geojsonFiles = ["/data/taguig.geojson"];

      // Fetch all files
      const geojsons = await Promise.all(
        geojsonFiles.map(async (url) => {
          const response = await fetch(url);
          return response.json();
        })
      );

      // ✅ Combine all features into one FeatureCollection
      const combinedGeoJSON = {
        type: "FeatureCollection",
        features: geojsons.flatMap((g) => g.features || [g]),
      };

      // ✅ Add Philippine Area of Responsibility (PAR) polygon
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

      // Add PAR source
      map.current.addSource("parBoundary", {
        type: "geojson",
        data: parGeoJSON,
      });

      // Add PAR fill layer (only visible when zoomed out)
      map.current.addLayer({
        id: "par-fill",
        type: "fill",
        source: "parBoundary",
        maxzoom: 8, // Only show when zoom level is below 8
        paint: {
          "fill-color": "#0066FF",
          "fill-opacity": 0.15,
        },
      });

      // Add PAR border layer (only visible when zoomed out)
      map.current.addLayer({
        id: "par-border",
        type: "line",
        source: "parBoundary",
        maxzoom: 8, // Only show when zoom level is below 8
        paint: {
          "line-color": "#0066FF",
          "line-width": 2,
          "line-dasharray": [3, 2],
        },
      });

      // Add as a map source
      map.current.addSource("combinedBoundaries", {
        type: "geojson",
        data: combinedGeoJSON,
      });

      // Fill layer with 3D extrusion (different color per barangay)
      map.current.addLayer({
        id: "combined-fill-3d",
        type: "fill-extrusion",
        source: "combinedBoundaries",
        paint: {
          "fill-extrusion-color": [
            "match",
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
            "#FF0000", // fallback
          ],
          "fill-extrusion-opacity": 0.4,
          "fill-extrusion-height": 150, // Height in meters
          "fill-extrusion-base": 0,
        },
      });

      // Border line layer (matching colors)
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
            "#CC0000", // fallback
          ],
          "line-width": 2.5,
        },
      });

      // ✅ Generate colors for each barangay
      const generateColor = (index) => {
        const hue = (index * 137.5) % 360; // Golden angle for good distribution
        return `hsl(${hue}, 70%, 50%)`;
      };

      // ✅ Calculate centroid and add markers for each barangay
      geojsons.forEach((geojson) => {
        const features = geojson.features || [geojson];

        features.forEach((feature, index) => {
          if (
            feature.geometry.type === "Polygon" ||
            feature.geometry.type === "MultiPolygon"
          ) {
            // Calculate centroid
            let coords = [];
            if (feature.geometry.type === "Polygon") {
              coords = feature.geometry.coordinates[0];
            } else if (feature.geometry.type === "MultiPolygon") {
              coords = feature.geometry.coordinates[0][0];
            }

            // Simple centroid calculation
            let lonSum = 0,
              latSum = 0;
            coords.forEach(([lon, lat]) => {
              lonSum += lon;
              latSum += lat;
            });
            const centroidLon = lonSum / coords.length;
            const centroidLat = latSum / coords.length;

            const name = feature.properties?.adm4_en || `Barangay ${index + 1}`;
            const color = generateColor(index);

            // Create marker element
            const el = document.createElement("div");
            el.className = "marker";
            el.style.width = "16px";
            el.style.height = "16px";
            el.style.backgroundColor = color;
            el.style.borderRadius = "50%";
            el.style.border = "2px solid white";
            el.style.cursor = "pointer";
            el.style.boxShadow = "0 0 5px rgba(0,0,0,0.4)";
            el.style.transition = "transform 0.2s";

            el.onmouseenter = () => {
              el.style.transform = "scale(1.3)";
            };
            el.onmouseleave = () => {
              el.style.transform = "scale(1)";
            };

            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
              `<strong>${name}</strong><br/>Area: ${
                feature.properties?.area_km2 || "N/A"
              } km²`
            );

            new maplibregl.Marker(el)
              .setLngLat([centroidLon, centroidLat])
              .setPopup(popup)
              .addTo(map.current);
          }
        });
      });

      // ✅ Auto zoom to show all features
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
          pitch: 60,
          bearing: -17.6,
        });
      }
    });

    // Add navigation controls (zoom, rotation, pitch)
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      }),
      "top-right"
    );

    // Enable map rotation with right-click + drag
    map.current.dragRotate.enable();
    // Enable pitch with Ctrl + drag
    map.current.touchZoomRotate.enableRotation();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "88vh" }}>
      {/* 2D/3D Toggle Buttons */}
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
      </div>

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "100%", borderRadius: "8px" }}
      />
    </div>
  );
};

export default MapViewV2;
