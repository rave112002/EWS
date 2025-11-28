import React from "react";
import "../Loader/LoaderCSS/FireCircleLoader.css";

const FireCircleLoader = () => {
  return (
    <div className="fire-wrapper">
      {/* Circle background */}
      <div className="fire-circle"></div>

      {/* Fire animation */}
      <div className="fire">
        <div className="fire-center">
          <div className="main-fire"></div>
          <div className="particle-fire"></div>
        </div>

        <div className="fire-right">
          <div className="main-fire"></div>
          <div className="particle-fire"></div>
        </div>

        <div className="fire-left">
          <div className="main-fire"></div>
          <div className="particle-fire"></div>
        </div>

        <div className="fire-bottom">
          <div className="main-fire"></div>
        </div>
      </div>
    </div>
  );
};

export default FireCircleLoader;
