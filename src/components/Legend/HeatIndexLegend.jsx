import WarningLegend from "@components/WarningLegend";
import React from "react";

const HeatIndexLegend = ({ data }) => {
  return (
    <div className="absolute bottom-2.5 left-2.5 bg-white rounded-lg shadow-lg p-4 z-40">
      <h4 className="text-sm font-bold text-gray-800 mb-2">Heat Index Scale</h4>
      <WarningLegend data={data} />
    </div>
  );
};

export default HeatIndexLegend;
