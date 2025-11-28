import React from "react";
import "../Loader/LoaderCSS/RainCircleLoader.css";

const RainCircleLoader = () => {
  const rain = [11, 12, 15, 17, 18, 13, 14, 19, 20];

  return (
    <div className="loader-wrapper">
      <div className="loader-circle"></div>
      <div className="loader">
        <div className="snow">
          {rain.map((i, idx) => (
            <span
              key={idx}
              style={{ "--i": i }}
              className="w-1 h-1 bg-gray-500 rounded-full animate-snow"
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RainCircleLoader;
