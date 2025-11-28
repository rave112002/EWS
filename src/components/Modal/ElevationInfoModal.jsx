import React from "react";

const ElevationInfoModal = ({ visible, onClose, elevationData, loading }) => {
  if (!visible) return null;
  return (
    <div className="absolute top-2.5 right-2.5 w-80 bg-white rounded-xl shadow-lg overflow-y-auto p-6 z-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-bold text-gray-800">Elevation Info</h3>

        <button
          onClick={onClose}
          className="text-gray-500 text-2xl w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
      </div>
      {loading ? (
        <div className="text-center p-5">
          <div className="border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full w-10 h-10 mx-auto animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading weather data...</p>
        </div>
      ) : elevationData?.error ? (
        <div className="p-5 text-center text-red-600">
          <p>{elevationData.error}</p>
        </div>
      ) : elevationData ? (
        <div>
          <div className="mb-4 justify-center items-center text-center">
            <h4 className="font-semibold text-lg  text-gray-700 mb-2">
              {elevationData.barangay}
            </h4>
          </div>
          <div className="p-3 bg-pink-100 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Elevation</div>
            <div className="text-lg font-semibold text-pink-600">
              {elevationData.elevation.toFixed(2)} meters
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

export default ElevationInfoModal;
