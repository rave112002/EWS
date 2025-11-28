import {
  AppstoreOutlined,
  CloudOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Dashboard from "@pages/Dashboard";
import Map from "@pages/maps/Map";
import MapTest from "@pages/maps/MapTest";
import Mapv2 from "@pages/maps/Mapv2";
import Weather from "@pages/weather/Weather";
import Wind from "@pages/weather/Wind";
import WindV2 from "@pages/weather/WindV2";
import { Cloud, LayoutDashboard, MapIcon, MapPlus } from "lucide-react";

export const MODULES = [
  {
    type: "item",
    icon: <LayoutDashboard />,
    value: "dashboard",
    label: "Dashboard",
    link: "/admin/dashboard",
    element: <Dashboard />,
  },
  // {
  //   type: "item",
  //   icon: <MapIcon />,
  //   value: "finalmap",
  //   label: "Final Map",
  //   link: "/admin/finalmap",
  //   // element: <Finalmap />,
  // },
  {
    type: "group",
    icon: <MapPlus />,
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
        label: "Map V2",
        icon: <GlobalOutlined />,
        link: "/admin/maps/mapv2",
        element: <Mapv2 />,
      },
      {
        value: "mapTest",
        label: "MapTest",
        icon: <CloudOutlined />,
        link: "/admin/maps/mapTest",
        element: <MapTest />,
      },
    ],
  },
  {
    type: "group",
    icon: <Cloud />,
    value: "weather",
    label: "Weather",
    children: [
      // {
      //   value: "weatherV1",
      //   label: "WeatherV1",
      //   icon: <CloudOutlined />,
      //   link: "/admin/weather/weatherv1",
      //   element: <Weather />,
      // },
      {
        value: "wind",
        label: "Wind",
        icon: <CloudOutlined />,
        link: "/admin/weather/wind",
        element: <Wind />,
      },
      // {
      //   value: "windV2",
      //   label: "WindV2",
      //   icon: <CloudOutlined />,
      //   link: "/admin/weather/windv2",
      //   element: <WindV2 />,
      // },
    ],
  },
];
