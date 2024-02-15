import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import Home from "../../pages/Home";
import Dizimistas from "../../pages/Dizimistas";
import React from "react";
import { IPages } from "./interfaces";

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
    icon: <UserOutlined />,
    path: "dizimistas",
    title: "Dizimistas",
    hasSubMenu: false,
    subMenu: [],
    page: <Dizimistas />,
    allow: ["admin", "administracao"],
  },
];
