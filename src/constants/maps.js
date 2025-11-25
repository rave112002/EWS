const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;
const JAWG_KEY = import.meta.env.VITE_JAWG_KEY;

export const MAP_STYLES = {
  satellite: `https://api.maptiler.com/tiles/satellite-v2/tiles.json?key=${MAPTILER_KEY}`,
  light: `https://api.jawg.io/styles/jawg-sunny.json?access-token=${JAWG_KEY}`,
  dark: `https://api.jawg.io/styles/4300a91b-b03a-451a-b7ce-f02640d7d30a.json?access-token=${JAWG_KEY}`,
  eox: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
};
