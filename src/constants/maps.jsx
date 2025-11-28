const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const JAWG_KEY = import.meta.env.VITE_JAWG_KEY;
import { MoonIcon, Satellite, Sun } from "lucide-react";

export const MAP_STYLES = {
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`,
  light: `https://api.maptiler.com/maps/019abfa7-5268-7354-984b-b7222cce4e44/style.json?key=${MAPTILER_KEY}`,
  dark: `https://api.maptiler.com/maps/019abfaa-a3df-7750-9413-2d94e96af2f4/style.json?key=${MAPTILER_KEY}`,
};

export const MAP_OPTIONS = [
  {
    label: (
      <span className="flex items-center h-full">
        <Sun size={20} />
      </span>
    ),
    value: "light",
  },
  {
    label: (
      <span className="flex items-center h-full">
        <MoonIcon size={20} />
      </span>
    ),
    value: "dark",
  },
  {
    label: (
      <span className="flex items-center h-full">
        <Satellite size={20} />
      </span>
    ),
    value: "satellite",
  },
];
