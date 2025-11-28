import RainCircleLoader from "@components/Loader/RainCircleLoader";
import React from "react";

const WeatherInfoModal = ({
  visible,
  onClose,
  weatherData,
  loading,
  getWeatherDescription,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute top-2.5 right-2.5 w-[380px] bg-white rounded-xl shadow-lg overflow-y-auto p-6 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-800">Weather Info</h3>
        <button
          onClick={onClose}
          className="text-gray-500 text-2xl w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <RainCircleLoader />
        </div>
      ) : weatherData?.error ? (
        <div className="p-5 text-center text-red-600">
          <p>{weatherData.error}</p>
        </div>
      ) : weatherData ? (
        <div>
          <div className="mb-4 justify-center items-center text-center">
            <h4 className="font-semibold text-lg  text-gray-700 mb-2">
              {weatherData.barangay}
            </h4>
          </div>
          <div className="flex flex-col gap-4">
            {/* Temperature & Humidity */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Temperature</div>
                <div className="text-2xl font-bold text-red-400">
                  {weatherData.temperature}°C
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">Humidity</div>
                <div className="text-2xl font-bold text-teal-400">
                  {weatherData.humidity}%
                </div>
              </div>
            </div>

            {/* Wind Speed & Precipitation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Wind Speed</div>
                <div className="text-lg font-semibold text-blue-500">
                  {weatherData.windSpeed} km/h
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">Precipitation</div>
                <div className="text-lg font-semibold text-green-500">
                  {weatherData.precipitation} mm
                </div>
              </div>
            </div>

            {/* Elevation */}
            {/* <div className="p-3 bg-pink-100 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Elevation</div>
            <div className="text-lg font-semibold text-pink-600">
              {weatherData.elevation.toFixed(2)} meters
            </div>
          </div> */}

            {/* Weather Condition */}
            <div className="p-4 bg-orange-100 rounded-lg text-center">
              <div className="text-sm text-gray-500 mb-1">
                Weather Condition
              </div>
              <div className="text-lg font-semibold text-orange-500">
                {getWeatherDescription(weatherData.weatherCode)}
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 text-center mt-2">
              Data from Open-Meteo API • Asia/Manila timezone
            </div>
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400 text-center mt-2">
          No weather data available.
        </div>
      )}
    </div>
  );
};

export default WeatherInfoModal;
