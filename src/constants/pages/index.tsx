import {
  HomeOutlined,
  UserOutlined,
  HeartOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
  BankOutlined,
} from "@ant-design/icons";
import Home from "../../pages/Home";
import Dizimistas from "../../pages/Dizimistas";
import React from "react";
import { IPages } from "./interfaces";
import Dizimo from "../../pages/Dizimo";
import Dashboards from "../../pages/Dashboard";
import Usuarios from "../../pages/Usuarios/Index";
import Comunidades from "../../pages/Comunidades";
import Bancos from "../../pages/Bancos";

export const Pages: IPages[] = [
  {
    id: 1,
    icon: <HomeOutlined />,
    path: "inicio",
    title: "Início",
    hasSubMenu: false,
    subMenu: [],
    page: <Home />,
    allow: ["admin", "administrador", "usuario"],
  },
  {
    id: 2,
    icon: <HeartOutlined />,
    path: "dizimo",
    title: "Dizimo",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimo />,
    allow: ["admin", "administrador", "usuario"],
  },
  {
    id: 3,
    icon: <UserOutlined />,
    path: "dizimistas",
    title: "Dizimistas",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimistas />,
    allow: ["admin", "administrador", "usuario"],
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
        allow: ["admin", "administrador"],
      },
      {
        id: 5.2,
        icon: <BankOutlined />,
        path: "bancos",
        title: "Bancos",
        hasSubMenu: false,
        subMenu: [],
        page:<Bancos />,
        allow: ["admin", "administrador"],
      },
      {
        id: 5.3,
        icon: <TeamOutlined />,
        path: "usuarios",
        title: "Usuários",
        hasSubMenu: false,
        subMenu: [],
        page:<Usuarios />,
        allow: ["admin", "administrador"],
      },
    ],
    page: <></>,
    allow: ["admin", "administrador"],
  },
];
