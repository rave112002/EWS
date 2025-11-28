import React, { useEffect, useState } from "react";

const ThunderEffect = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const triggerFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);

      const nextFlash = Math.random() * 5000 + 3000;
      setTimeout(triggerFlash, nextFlash);
    };

    const initialDelay = setTimeout(triggerFlash, Math.random() * 3000 + 1000);

    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-100 ${
        flash ? "opacity-30" : "opacity-0"
      }`}
      style={{ backgroundColor: "#FFFFFF" }}
    />
  );
};

export default ThunderEffect;
