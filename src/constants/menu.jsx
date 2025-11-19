import {
  AppstoreOutlined,
  CloudOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import Home from "@pages/Home";
import Map from "@pages/Map";
import Mapv2 from "@pages/Mapv2";
import NotFound from "@pages/NotFound";
import Weather from "@pages/Weather";

export const MODULES = [
  {
    type: "item",
    icon: <AppstoreOutlined />,
    value: "dashboard",
    label: "Dashboard",
    link: "/admin/dashboard",
    element: <Home />,
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
      {
        value: "weather",
        label: "Weather",
        icon: <CloudOutlined />,
        link: "/admin/maps/weather",
        element: <Weather />,
      },
    ],
  },
];
