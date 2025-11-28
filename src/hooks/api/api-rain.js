import { getWeatherDescription } from "@helpers/weatherHelpers";

export const getRainData = async (lat, lon, barangayName) => {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,rain,showers,weather_code&timezone=Asia/Manila`
  );

  const data = await response.json();

  const temperature = data.current.temperature_2m;
  const precipitation = data.current.precipitation ?? 0;
  const rain = data.current.rain ?? 0;
  const showers = data.current.showers ?? 0;
  const weatherCode = data.current.weather_code;

  const weatherDescription = getWeatherDescription(weatherCode);

  return {
    barangay: barangayName,
    temperature,
    precipitation,
    rain,
    showers,
    weatherCode,
    weatherDescription,
  };
};
