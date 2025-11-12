import { Routes, Route } from "react-router-dom";
import LandingLayout from "@pages/layouts/LandingLayout";
import Login from "@pages/Login";
import Home from "@pages/Home";
import Map from "@pages/Map";
import MapV2 from "@pages/Mapv2";
const NotFound = () => (
  <div className="h-dvh bg-header flex flex-col items-center justify-center">
    <span className="text-5xl font-bold text-white text-shadow-lg/30">
      404 - Page Not Found
    </span>
    <p className="text-white mt-2">Return to home using the menu.</p>
  </div>
);

const Routers = () => {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Login />} />

      {/* Admin route inside layout */}
      <Route element={<LandingLayout />}>
        <Route path="admin" element={<Home />} />
        <Route path="map" element={<Map />} />
        <Route path="mapv2" element={<MapV2 />} />
      </Route>

      {/* Catch-all 404 with redirect */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
