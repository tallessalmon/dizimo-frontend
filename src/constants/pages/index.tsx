import {
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Home from "../../pages/Home";
import Dizimistas from "../../pages/Dizimistas";
import React from "react";
import { IPages } from "./interfaces";
import Dizimo from "../../pages/Dizimo";
import Dashboards from "../../pages/Dashboard";
import Usuarios from "../../pages/Usuarios/Index";
import Comunidades from "../../pages/Comunidades";

export const Pages: IPages[] = [
  {
    id: 1,
    icon: <HomeOutlined />,
    path: "inicio",
    title: "Início",
    hasSubMenu: false,
    subMenu: [],
    page: <Home />,
    allow: ["admin", "administracao"],
  },
  {
    id: 2,
    icon: <HeartOutlined />,
    path: "dizimo",
    title: "Dizimo",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimo />,
    allow: ["admin", "administracao"],
  },
  {
    id: 3,
    icon: <UserOutlined />,
    path: "dizimistas",
    title: "Dizimistas",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimistas />,
    allow: ["admin", "administracao"],
  },
  {
    id: 4,
    icon: <BarChartOutlined />,
    path: "dashboard",
    title: "Dashboard",
    hasSubMenu: false,
    subMenu: [],
    page: <Dashboards />,
    allow: ["admin", "administracao"],
  },
  {
    id: 5,
    icon: <SettingOutlined />,
    path: "#",
    title: "Configurações",
    hasSubMenu: true,
    subMenu: [
      {
        id: 5.1,
        icon: <HomeOutlined />,
        path: "comunidades",
        title: "Comunidades",
        hasSubMenu: false,
        subMenu: [],
        page: <Comunidades />,
        allow: ["admin", "administracao"],
      },
      {
        id: 5.2,
        icon: <TeamOutlined />,
        path: "usuarios",
        title: "Usuários",
        hasSubMenu: false,
        subMenu: [],
        page:<Usuarios />,
        allow: ["admin", "administracao"],
      },
    ],
    page: <></>,
    allow: ["admin", "administracao"],
  },
];
