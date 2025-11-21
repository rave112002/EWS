export const calculateCentroid = (coords) => {
  let lonSum = 0,
    latSum = 0;
  coords.forEach(([lon, lat]) => {
    lonSum += lon;
    latSum += lat;
  });
  return {
    lon: lonSum / coords.length,
    lat: latSum / coords.length,
  };
};

export const extractCoordinates = (geometry) => {
  if (geometry.type === "Polygon") {
    return geometry.coordinates[0];
  } else if (geometry.type === "MultiPolygon") {
    return geometry.coordinates[0][0];
  }
  return [];
};
