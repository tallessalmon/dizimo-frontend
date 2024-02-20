import { HomeOutlined, UserOutlined, HeartOutlined, BarChartOutlined } from "@ant-design/icons";
import Home from "../../pages/Home";
import Dizimistas from "../../pages/Dizimistas";
import React from "react";
import { IPages } from "./interfaces";
import Dizimo from "../../pages/Dizimo";
import Dashboards from "../../pages/Dashboard";

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
];
