// MapView.jsx
import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapView = ({
  center = [121.0, 14.6], // default to Metro Manila coordinates (lon, lat)
  zoom = 12,
  styleUrl = "https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=dyAlxp8V4w8FBKBi4Sbus1xMvIg6ojhrGV2mcZu0NacG33dYSdUP4aYMF9rSZS83",
  onMapLoad = () => {},
}) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

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

    mapInstance.current.on("load", () => {
      onMapLoad(mapInstance.current);
    });

    mapInstance.current.on("load", async () => {
      // ✅ List of GeoJSON files
      const geojsonFiles = [
        "/data/fortBonifacio.geojson",
        "/data/westernBicutan.geojson",
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

      // Inside map.current.on("load", async () => {
      geojsons.forEach((geojson, i) => {
        const features = geojson.features || [geojson];

        features.forEach((feature) => {
          // Check if this is a label point
          if (feature.geometry.type === "Point") {
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
        mapInstance.current.fitBounds(bounds, { padding: 40 });
      }
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [styleUrl, center, zoom, onMapLoad]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
};

export default MapView;
