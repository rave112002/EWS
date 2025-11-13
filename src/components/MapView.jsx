// MapView.jsx
import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapView = ({
  center = [121.0, 14.6], // default to Metro Manila (lon, lat)
  zoom = 12,
  styleUrl = "https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
  onMapLoad = () => {},

  // 3D options
  enableTerrain = true,
  // MapTiler terrain-rgb tiles.json
  terrainSourceUrl = "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=EwtO1Ev8tHi9GJOuWxBy",
  terrainExaggeration = 1.0,
  enable3DBuildings = false,
}) => {
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
    if (mapInstance.current) return; // initialize only once

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: center,
      zoom: zoom,
    });

    // add navigation controls (zoom + rotate)
    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    // Your existing onMapLoad callback
    mapInstance.current.on("load", () => {
      onMapLoad(mapInstance.current);
    });

    // Load and render your boundary/marker data
    mapInstance.current.on("load", async () => {
      // ✅ List of GeoJSON files
      const geojsonFiles = [
        "/data/fortBonifacio.geojson",
        "/data/westernBicutan.geojson",
        "/data/centralBicutan.geojson",
      ];

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

      // Add as a map source
      mapInstance.current.addSource("combinedBoundaries", {
        type: "geojson",
        data: combinedGeoJSON,
      });

      // Fill layer
      mapInstance.current.addLayer({
        id: "combined-fill",
        type: "fill",
        source: "combinedBoundaries",
        paint: {
          "fill-color": "#FF0000",
          "fill-opacity": 0.25,
        },
      });

      // Border line layer
      mapInstance.current.addLayer({
        id: "combined-border",
        type: "line",
        source: "combinedBoundaries",
        paint: {
          "line-color": "#FF0000",
          "line-width": 2.5,
        },
      });

      // Add point markers (if any features are Points)
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
              .addTo(mapInstance.current);
          }
        });
      });

      // ✅ Auto zoom to show all features
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

      // after you add the "terrain-dem" source
      if (!mapInstance.current.getSource("hillshade-dem")) {
        mapInstance.current.addSource("hillshade-dem", {
          type: "raster-dem",
          url: terrainSourceUrl, // can reuse MapTiler terrain-rgb
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

      // Terrain control (MapLibre 5+)
      mapInstance.current.addControl(
        new maplibregl.TerrainControl({
          source: "terrain-dem",
          exaggeration: terrainExaggeration,
        })
      );

      // --- 3D TERRAIN (MapTiler) ---
      if (enableTerrain && terrainSourceUrl) {
        if (!mapInstance.current.getSource("terrain-dem")) {
          mapInstance.current.addSource("terrain-dem", {
            type: "raster-dem",
            url: terrainSourceUrl, // MapTiler terrain-rgb tiles.json
            tileSize: 512,
            maxzoom: 14,
          });
        }
        mapInstance.current.setTerrain({
          source: "terrain-dem",
          exaggeration: terrainExaggeration,
        });

        // Optional: sky + pitch for better 3D effect
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

        mapInstance.current.setPitch(70);
        mapInstance.current.setBearing(-45);
        mapInstance.current.zoomTo(14, { duration: 1000 });

        // Tilt the camera so elevation is visible
        mapInstance.current.setPitch(
          Math.max(mapInstance.current.getPitch(), 60)
        );
      }

      // --- 3D BUILDINGS (optional) ---
      if (enable3DBuildings) {
        const info = findBuildingSourceInfo(mapInstance.current);
        const labelLayerId = getFirstSymbolLayerId(mapInstance.current);

        const sourceId = info?.source || "composite";
        const sourceLayer = info?.sourceLayer || "building";

        if (!mapInstance.current.getLayer("3d-buildings")) {
          mapInstance.current.addLayer(
            {
              id: "3d-buildings",
              type: "fill-extrusion",
              source: sourceId,
              "source-layer": sourceLayer,
              minzoom: 15,
              paint: {
                "fill-extrusion-color": "#aaa",
                "fill-extrusion-height": [
                  "coalesce",
                  ["get", "render_height"],
                  ["get", "height"],
                  20,
                ],
                "fill-extrusion-base": [
                  "coalesce",
                  ["get", "render_min_height"],
                  ["get", "min_height"],
                  0,
                ],
                "fill-extrusion-opacity": 0.6,
              },
            },
            labelLayerId || undefined
          );
        }
      }
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

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapView;
