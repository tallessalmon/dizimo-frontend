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
import Informativos from "../../pages/Informativos/Index";
import { BsBrush, BsMegaphone } from "react-icons/bs";
import ThemeCustomization from "../../pages/Custom";

export const Pages: IPages[] = [
  {
    id: 1,
    icon: <HomeOutlined />,
    path: "inicio",
    title: "Início",
    hasSubMenu: false,
    subMenu: [],
    page: <Home />,
    allow: ["administrador", "usuario"],
  },
  {
    id: 2,
    icon: <PiHandHeartLight />,
    path: "oferta",
    title: "Ofertório",
    hasSubMenu: false,
    subMenu: [],
    page: <Ofertorio />,
    allow: ["administrador", "usuario"],
  },
  {
    id: 3,
    icon: <UserOutlined />,
    path: "dizimistas",
    title: "Dizimistas",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimistas />,
    allow: ["administrador", "usuario"],
  },
  {
    id: 4,
    icon: <BarChartOutlined />,
    path: "dashboard",
    title: "Dashboard",
    hasSubMenu: false,
    subMenu: [],
    page: <Dashboards />,
    allow: ["administrador"],
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
        allow: ["administrador", "usuario"],
      },
      {
        id: 5.2,
        icon: <></>,
        path: "relatorio/ofertorio",
        title: "Ofertório",
        hasSubMenu: false,
        subMenu: [],
        page:<RelOfertorio />,
        allow: ["administrador", "usuario"],
      },
    ],
    page: <></>,
    allow: ["administrador", "usuario"],
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
        allow: ["administrador"],
      },
      {
        id: 6.2,
        icon: <BankOutlined />,
        path: "bancos",
        title: "Bancos",
        hasSubMenu: false,
        subMenu: [],
        page:<Bancos />,
        allow: ["administrador"],
      },
      {
        id: 6.3,
        icon: <BsMegaphone />,
        path: "mensagens",
        title: "Mensagens",
        hasSubMenu: false,
        subMenu: [],
        page:<Informativos />,
        allow: ["administrador"],
      },
      {
        id: 6.4,
        icon: <BsBrush />,
        path: "custom",
        title: "Customizar",
        hasSubMenu: false,
        subMenu: [],
        page:<ThemeCustomization />,
        allow: ["administrador"],
      },
      {
        id: 6.5,
        icon: <TeamOutlined />,
        path: "usuarios",
        title: "Usuários",
        hasSubMenu: false,
        subMenu: [],
        page:<Usuarios />,
        allow: ["administrador"],
      },
    ],
    page: <></>,
    allow: ["administrador"],
  },
];
