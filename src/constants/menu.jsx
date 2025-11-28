import {
  AppstoreOutlined,
  CloudOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Dashboard from "@pages/Dashboard";
import Map from "@pages/Map";
import MapTest from "@pages/MapTest";
import Mapv2 from "@pages/Mapv2";
import Weather from "@pages/Weather";
import Wind from "@pages/Wind";
import WindV2 from "@pages/WindV2";

export const MODULES = [
  {
    type: "item",
    icon: <AppstoreOutlined />,
    value: "dashboard",
    label: "Dashboard",
    link: "/admin/dashboard",
    element: <Dashboard />,
  },
  {
    type: "group",
    icon: <GlobalOutlined />,
    value: "maps",
    label: "Maps",
    children: [
      {
        value: "map1",
        label: "Map",
        icon: <GlobalOutlined />,
        link: "/admin/maps/map1",
        element: <Map />,
      },
      {
        value: "mapv2",
        label: "Mapv2",
        icon: <GlobalOutlined />,
        link: "/admin/maps/mapv2",
        element: <Mapv2 />,
      },
    ],
  },
  {
    type: "group",
    icon: <GlobalOutlined />,
    value: "weather",
    label: "Weather",
    children: [
      {
        value: "weatherV1",
        label: "WeatherV1",
        icon: <CloudOutlined />,
        link: "/admin/weather/weatherv1",
        element: <Weather />,
      },
      {
        value: "mapTest",
        label: "MapTest",
        icon: <CloudOutlined />,
        link: "/admin/weather/mapTest",
        element: <MapTest />,
      },
      {
        value: "wind",
        label: "Wind",
        icon: <CloudOutlined />,
        link: "/admin/weather/wind",
        element: <Wind />,
      },
      {
        value: "windV2",
        label: "WindV2",
        icon: <CloudOutlined />,
        link: "/admin/weather/windv2",
        element: <WindV2 />,
      },
    ],
  },
];
