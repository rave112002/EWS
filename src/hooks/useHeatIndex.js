export const fetchHeatIndexData = async (
  lat,
  lon,
  barangayName,
  getHeatIndexCategory
) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature&timezone=Asia/Manila`
  );

  const data = await response.json();

  const temperature = data.current.temperature_2m;
  const humidity = data.current.relative_humidity_2m;
  const apparentTemperature = data.current.apparent_temperature;

  const category = getHeatIndexCategory(apparentTemperature);

  return {
    barangay: barangayName,
    temperature: temperature,
    humidity: humidity,
    apparentTemperature: apparentTemperature,
    category: category.category,
    color: category.color,
  };
};
