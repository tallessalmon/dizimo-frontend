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
import Dashboards from "../../pages/Dashboard";
import Usuarios from "../../pages/Usuarios/Index";
import Comunidades from "../../pages/Comunidades";
import Bancos from "../../pages/Bancos";
import { PiHandHeartLight } from "react-icons/pi";
import { LuNewspaper } from "react-icons/lu";
import Ofertorio from "../../pages/Ofertorio";
import RelDizimo from "../../pages/Relatórios/dizimo";
import RelOfertorio from "../../pages/Relatórios/ofertorio";

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
    icon: <PiHandHeartLight />,
    path: "oferta",
    title: "Ofertório",
    hasSubMenu: false,
    subMenu: [],
    page: <Ofertorio />,
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
    icon: <LuNewspaper />,
    path: "#",
    title: "Relatórios",
    hasSubMenu: true,
    subMenu: [
      {
        id: 5.1,
        icon: <></>,
        path: "relatorio/dizimo",
        title: "Dizimo",
        hasSubMenu: false,
        subMenu: [],
        page:<RelDizimo />,
        allow: ["admin", "administrador", "usuario"],
      },
      {
        id: 5.2,
        icon: <></>,
        path: "relatorio/ofertorio",
        title: "Ofertório",
        hasSubMenu: false,
        subMenu: [],
        page:<RelOfertorio />,
        allow: ["admin", "administrador", "usuario"],
      },
    ],
    page: <></>,
    allow: ["admin", "administrador", "usuario"],
  },
  {
    id: 6,
    icon: <SettingOutlined />,
    path: "##",
    title: "Configurações",
    hasSubMenu: true,
    subMenu: [
      {
        id: 6.1,
        icon: <HomeOutlined />,
        path: "comunidades",
        title: "Comunidades",
        hasSubMenu: false,
        subMenu: [],
        page: <Comunidades />,
        allow: ["admin", "administrador"],
      },
      {
        id: 6.2,
        icon: <BankOutlined />,
        path: "bancos",
        title: "Bancos",
        hasSubMenu: false,
        subMenu: [],
        page:<Bancos />,
        allow: ["admin", "administrador"],
      },
      {
        id: 6.3,
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
