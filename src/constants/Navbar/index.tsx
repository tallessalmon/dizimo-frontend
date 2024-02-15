import React, { useEffect, useState } from "react";
import {
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu } from "antd";
import './style.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';
import Home from '../../pages/Home';
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { Pages } from "../pages";

const { Header, Content, Footer, Sider } = Layout;

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const [isHovered, setIsHovered] = useState(false);
  const [page, setPage] = useState<JSX.Element>(<Home />)
  const userInfo:any = getProfileLocalStorage()

  const access = String(userInfo?.profile)

  const handleMenuClick = (navigator: any) => {
      setPage(navigator.page || <></>);
      navigate('/#' + navigator.path.toLowerCase());
  };

  // eslint-disable-next-line array-callback-return
  const menu: MenuProps['items'] | any = Pages.map((navigator) => {
      const render = navigator.allow.includes(access)
      if (render) {
          return !navigator.hasSubMenu ? (
              {
                  key: navigator.path,
                  icon: navigator.icon,
                  label: navigator.title,
                  title: navigator.title,
                  onClick: () => handleMenuClick(navigator)
              }
          ) : (
              {
                  key:navigator.path,
                  icon:navigator.icon,
                  title:navigator.title,
                  label: navigator.title,
                  // eslint-disable-next-line array-callback-return
                  children: navigator.subMenu?.map((item) => {
                      if(item.allow.includes(access)){
                      return (
                          {
                              key: item.path,
                              label: item.title,
                              title: item.title,
                              icon: item.icon,
                              onClick: () => handleMenuClick(item)
                          }
                      )} 
                  }),
              }
          )
      }
      
  })

  menu.push({
      key: 99,
      icon: <LogoutOutlined />,
      title: "Sair",
      label: "Sair",
      danger: true,
      className: 'button',
      style:{
          position: 'absolute',
          bottom: '2vh',
          border: `1px solid ${isHovered ? '#f0e9e9' : '#af2727'}`,
          color: isHovered ? '#fff0f0': '#af2727',
          backgroundColor: isHovered ? '#af2727': "#f0e9e9",
          transition: 'background-color 0.3s, color 0.3s'},
      onClick: () => auth.logout(),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false)
  })

  useEffect(() => {
      const path = window.location.hash.substring(1)
      // eslint-disable-next-line array-callback-return
      menu.map((o:any) => {
          if(o && !o.children && o.key === path) {
              o.onClick()
          }
          if(o && o.children) {
              // eslint-disable-next-line array-callback-return
              o.children.map((c:any) => {
                  if(c && c.key === path) {
                      c.onClick()
                  }
              } )
          }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#E7C88F" },
        // token: {colorPrimary: "#B47D75"},
        components: {
          Layout: { siderBg: "#4A4947" },
          Menu: { subMenuItemBg: "#7d774d", darkItemBg: "#4A4947" },
        },
      }}
    >
      <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
          <div className="logo">
            <img src="/logo.jpg" alt="Logo" height={"50px"} />
          </div>
          <Menu 
                    theme={"dark"}
                    mode={"inline"}
                    defaultSelectedKeys={[window.location.hash.substring(1).toLowerCase() || 'inicio']}
                    activeKey='label'
                    items={menu}
                >
                </Menu>                
            </Sider>
            <Layout className="site-layout">
                <Header style={{ padding: 0, height: 0 }} />
                <Content style={{ margin: "10px 10px 0", overflow: "initial" }}>
                    <div
                        style={{ padding: 24, minHeight: "92vh", borderRadius: 7 }}
                        className="site-layout-background"
                    >
                        {page}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', margin: 0 }}>Created By Talles Salmon - 2023 - <strong>v 1.0.0</strong></Footer>
            </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Navbar;
