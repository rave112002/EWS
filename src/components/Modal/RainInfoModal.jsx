import React from "react";

const RainInfoModal = ({ visible, onClose, rainData, loading }) => {
  if (!visible) return null;

  return (
    <div className="absolute top-2.5 right-2.5 bg-white rounded-lg shadow-xl p-6 z-40 max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          {rainData?.barangay || "Loading..."}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : rainData?.error ? (
        <div className="text-red-600">{rainData.error}</div>
      ) : rainData ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-4xl">🌧️</span>
            <div>
              <p className="text-sm text-gray-600">Conditions</p>
              <p className="text-lg font-semibold">
                {rainData.weatherDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Temperature</p>
              <p className="text-xl font-bold text-blue-600">
                {rainData.temperature}°C
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Precipitation</p>
              <p className="text-xl font-bold text-blue-600">
                {rainData.precipitation} mm
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Rain</p>
              <p className="text-xl font-bold text-blue-600">
                {rainData.rain} mm
              </p>
            </div>

            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-600">Showers</p>
              <p className="text-xl font-bold text-blue-600">
                {rainData.showers} mm
              </p>
            </div>
          </div>

          {rainData.weatherCode >= 95 && (
            <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
              <p className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
                ⚡ Thunderstorm Warning
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Stay indoors and avoid outdoor activities
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default RainInfoModal;
