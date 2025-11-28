export const getHeatIndexData = async (
  lat,
  lon,
  barangayName,
  getHeatIndexCategory
) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m&timezone=Asia/Manila`
  );

  const data = await response.json();

  const temperatureC = data.current.temperature_2m;
  const humidity = data.current.relative_humidity_2m;

  // Convert Celsius → Fahrenheit for HI formula
  const T = (temperatureC * 9) / 5 + 32;
  const R = humidity;

  // National Weather Service Heat Index Formula
  const heatIndexF =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  // Convert back to Celsius
  const heatIndexC = ((heatIndexF - 32) * 5) / 9;

  // Categorize the REAL computed HI
  const categoryData = getHeatIndexCategory(heatIndexC);

  return {
    barangay: barangayName,
    temperature: temperatureC,
    humidity: humidity,
    heatIndex: heatIndexC,
    category: categoryData.category,
    color: categoryData.color,
  };
};
