import BaseMap from "@components/Map/BaseMap";
import React from "react";

const MapTest = () => {
  return (
    <div className="w-full h-full">
      <BaseMap center={[121, 14.6]} zoom={4} />
    </div>
  );
};

export default MapTest;
