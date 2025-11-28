import FireCircleLoader from "@components/Loader/FireCircleLoader";
import React from "react";

const HeatIndexInfoModal = ({ visible, onClose, heatIndexData, loading }) => {
  if (!visible) return null;
  return (
    <div
      className={`absolute top-2.5 right-2.5 bg-white rounded-lg shadow-lg p-5 w-80 transition-all duration-300 z-50 `}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">Heat Index Info</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <FireCircleLoader />
        </div>
      ) : heatIndexData ? (
        heatIndexData.error ? (
          <div className="text-red-500">{heatIndexData.error}</div>
        ) : (
          <div>
            <div className="mb-4 justify-center items-center text-center">
              <h4 className="font-semibold text-lg  text-gray-700 mb-2">
                {heatIndexData.barangay}
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Temperature:</span>
                <span className="font-semibold text-gray-800">
                  {heatIndexData.temperature.toFixed(1)}°C
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-gray-600">Humidity:</span>
                <span className="font-semibold text-gray-800">
                  {heatIndexData.humidity}%
                </span>
              </div>

              <div
                className="flex justify-between items-center p-3 rounded"
                style={{ backgroundColor: heatIndexData.color + "40" }}
              >
                <span className="text-gray-600">Heat Index:</span>
                <span className="font-bold text-gray-800">
                  {heatIndexData.heatIndex.toFixed(1)}°C
                </span>
              </div>

              <div
                className="p-3 rounded text-center font-semibold"
                style={{
                  backgroundColor: heatIndexData.color,
                  color: heatIndexData.color === "#FFFF00" ? "#000" : "#fff",
                }}
              >
                {heatIndexData.category}
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p className="font-semibold mb-1">Heat Index Categories:</p>
                <p>🟡 &lt;27°C: Caution</p>
                <p>🟠 27-32°C: Extreme Caution</p>
                <p>🔴 32-41°C: Danger</p>
                <p>🔴 &gt;41°C: Extreme Danger</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="text-gray-500 text-center py-4">
          Click on a barangay to view heat index data
        </div>
      )}
    </div>
  );
};

export default HeatIndexInfoModal;
