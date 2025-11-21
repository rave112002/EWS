import React from "react";

const WarningLegend = ({ data }) => {
  return (
    <div className="space-y-1 text-xs">
      {data.map((level) => (
        <div key={level.label} className="flex items-center gap-2">
          <div className={`w-6 h-4 rounded bg-[${level.color}]`}></div>
          <span>{level.label}</span>
        </div>
      ))}
    </div>
  );
};

export default WarningLegend;
