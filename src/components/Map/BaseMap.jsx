import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "@constants/maps";

const BaseMap = ({
  center = [121.0, 14.6],
  zoom = 12,
  style = "dark",
  projection = "globe",
  onMapLoad = () => {},
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Setup map only once
  useEffect(() => {
    if (mapInstance.current) return;

    const styleUrl = MAP_STYLES[style] || MAP_STYLES["dark"];
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center,
      zoom,
      projection,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapInstance.current.addControl(new maplibregl.GlobeControl(), "top-right");

    // Initial sources/layers
    mapInstance.current.on("load", () => {
      // mapInstance.current.setFog({
      //   range: [-1, 2],
      //   color: "white",
      //   "high-color": "#d8f2ff",
      //   "horizon-blend": 0.1,
      //   "space-color": "#000010",
      //   "star-intensity": 0.5,
      // });

      // --- PAR BORDER ---
      fetch("/data/par.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          if (!mapInstance.current) return;
          if (!mapInstance.current.getSource("par-outline")) {
            mapInstance.current.addSource("par-outline", {
              type: "geojson",
              data: geojson,
            });
          }
          if (!mapInstance.current.getLayer("par-border")) {
            mapInstance.current.addLayer({
              id: "par-border",
              type: "line",
              source: "par-outline",
              paint: {
                "line-color": "#808080",
                "line-width": 3,
                "line-dasharray": [2, 2],
              },
            });
          }
        });

      // --- Taguig boundary and auto-zoom ---
      fetch("/data/taguig.geojson")
        .then((res) => res.json())
        .then((geojson) => {
          if (!mapInstance.current) return;
          if (!mapInstance.current.getSource("taguig-boundary")) {
            mapInstance.current.addSource("taguig-boundary", {
              type: "geojson",
              data: geojson,
            });
          }
          if (!mapInstance.current.getLayer("taguig-fill")) {
            mapInstance.current.addLayer({
              id: "taguig-fill",
              type: "fill",
              source: "taguig-boundary",
              paint: {
                "fill-color": "#008000",
                "fill-opacity": 0.3,
              },
            });
          }
          if (!mapInstance.current.getLayer("taguig-border")) {
            mapInstance.current.addLayer({
              id: "taguig-border",
              type: "line",
              source: "taguig-boundary",
              paint: {
                "line-color": "#fff",
                "line-width": 2.5,
              },
            });
          }
          if (!mapInstance.current.getLayer("taguig-label")) {
            mapInstance.current.addLayer({
              id: "taguig-label",
              type: "symbol",
              source: "taguig-boundary",
              layout: {
                "text-field": ["get", "adm4_en"],
                "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
                "text-size": 12,
                "text-anchor": "center",
                "text-allow-overlap": false,
              },
              paint: {
                "text-color": "#000",
                "text-halo-color": "#ffffff",
                "text-halo-width": 2,
              },
            });
          }
          // --- Auto zoom to show all features ---
          const bounds = new maplibregl.LngLatBounds();
          const features =
            geojson.type === "FeatureCollection" ? geojson.features : [geojson];
          features.forEach((f) => {
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
        });

      onMapLoad(mapInstance.current);
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [style, center, zoom, onMapLoad]);

  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;

    const handleZoom = () => {
      const zoom = map.getZoom();

      // Hide/show taguig label
      if (map.getLayer("taguig-label")) {
        map.setLayoutProperty(
          "taguig-label",
          "visibility",
          zoom > 10 ? "visible" : "none"
        );
      }

      // Hide/show taguig border
      if (map.getLayer("taguig-border")) {
        map.setLayoutProperty(
          "taguig-border",
          "visibility",
          zoom > 8 ? "visible" : "none"
        );
      }

      // Hide/show taguig fill
      if (map.getLayer("taguig-fill")) {
        map.setLayoutProperty(
          "taguig-fill",
          "visibility",
          zoom > 8 ? "visible" : "none"
        );
      }
    };

    map.on("zoom", handleZoom);

    handleZoom();

    return () => {
      map.off("zoom", handleZoom);
    };
  }, []);

  // useEffect(() => {
  //   if (mapInstance.current) {
  //     const map = mapInstance.current;

  //     const logZoom = () => {
  //       console.log("Zoom level:", map.getZoom());
  //     };

  //     map.on("zoom", logZoom);

  //     // Cleanup
  //     return () => {
  //       map.off("zoom", logZoom);
  //     };
  //   }
  // }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default BaseMap;
