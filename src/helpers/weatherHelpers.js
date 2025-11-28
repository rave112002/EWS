import { WEATHER_CODES } from "../constants/weatherCode";

export const getWeatherDescription = (code) => {
  return WEATHER_CODES[code] || "Unknown";
};
