import React from "react";
import ActionButton from "./Button/ActionButton";

const MapButtons = ({
  is3D,
  showElevation,
  showWeather,
  showPAR,
  showHeatIndex,
  selectedBarangay,
  onToggle2D3D,
  onToggleElevation,
  onToggleWeather,
  onTogglePAR,
  onToggleHeatIndex,
  onReset,
  showRain,
  onToggleRain,
}) => {
  return (
    <div className="absolute z-1000 flex gap-2.5 bg-white rounded-lg p-2.5 shadow-md top-2.5 left-2.5">
      <ActionButton
        label="2D"
        onClick={onToggle2D3D}
        className={`${
          !is3D
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        label="3D"
        onClick={onToggle2D3D}
        className={`${
          is3D
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        activeLabel="Elevation ON"
        inactiveLabel="Elevation OFF"
        isActive={showElevation}
        onClick={onToggleElevation}
        className={`${
          showElevation
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        activeLabel="Weather ON"
        inactiveLabel="Weather OFF"
        isActive={showWeather}
        onClick={onToggleWeather}
        className={`${
          showWeather
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        activeLabel="Wind ON"
        inactiveLabel="Wind OFF"
        className="bg-gray-100 text-gray-800 hover:text-gray-800"
      />

      <ActionButton
        activeLabel="Heat Index ON"
        inactiveLabel="Heat Index OFF"
        isActive={showHeatIndex}
        onClick={onToggleHeatIndex}
        className={`${
          showHeatIndex
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        activeLabel="Rain ON"
        inactiveLabel="Rain OFF"
        isActive={showRain}
        onClick={onToggleRain}
        className={`${
          showRain
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      <ActionButton
        activeLabel="PAR ON"
        inactiveLabel="PAR OFF"
        isActive={showPAR}
        onClick={onTogglePAR}
        className={`${
          showPAR
            ? "bg-blue-500 text-white hover:text-white"
            : "bg-gray-100 text-gray-800 hover:text-gray-800"
        }`}
      />

      {selectedBarangay && (
        <ActionButton
          label="Reset"
          onClick={onReset}
          className="py-2.5 px-5 rounded-md border-0 bg-red-500 text-white font-semibold cursor-pointer transition-all duration-300 ease-in-out text-[14px]"
        />
      )}
    </div>
  );
};

export default MapButtons;
