import React, { useEffect, useState } from "react";
import { LogoutOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, Row, Spin } from "antd";
import './style.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider/useAuth';
import Home from '../../pages/Home';
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { Pages } from "../pages";
import api from "../../services/api";

const { Header, Content, Footer, Sider } = Layout;

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const [isHovered, setIsHovered] = useState(false);
    const [page, setPage] = useState<JSX.Element>(<Home />);
    const [primary, setPrimary] = useState('#000000');
    const [secundary, setSecundary] = useState('#000000');
    const [siderBg, setSiderBg] = useState('#000000');
    const [subMenuItemBg, setSubMenuItemBg] = useState('#000000');
    const [darkItemBg, setDarkItemBg] = useState('#000000');
    const [darkSubMenuItemBg, setDarkSubMenuItemBg] = useState('#000000');

    const [loading, setLoading] = useState(true);

    const userInfo: any = getProfileLocalStorage();
    const access = String(userInfo?.profile);

    const handleMenuClick = (navigator: any) => {
        setPage(navigator.page || <></>);
        navigate('/#' + navigator.path.toLowerCase());
    };

    const menu: MenuProps['items'] | any = Pages.map((navigator) => {
        const render = navigator.allow.includes(access);
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
                    key: navigator.path,
                    icon: navigator.icon,
                    title: navigator.title,
                    label: navigator.title,
                    children: navigator.subMenu?.map((item) => {
                        if (item.allow.includes(access)) {
                            return {
                                key: item.path,
                                label: item.title,
                                title: item.title,
                                icon: item.icon,
                                onClick: () => handleMenuClick(item)
                            };
                        }
                    }),
                }
            );
        }
    });

    menu.push({
        key: 99,
        icon: <LogoutOutlined />,
        title: "Sair",
        label: "Sair",
        danger: true,
        className: 'button',
        style: {
            position: 'absolute',
            bottom: '2vh',
            border: `1px solid ${isHovered ? '#f0e9e9' : '#af2727'}`,
            color: isHovered ? '#fff0f0' : '#af2727',
            backgroundColor: isHovered ? '#af2727' : "#f0e9e9",
            transition: 'background-color 0.3s, color 0.3s'
        },
        onClick: () => auth.logout(),
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false)
    });

    useEffect(() => {
        api.get('theme').then(({ data }: any) => {
            setPrimary(data[0].primary);
            setSecundary(data[0].secundary);
            setSiderBg(data[0].siderBg);
            setSubMenuItemBg(data[0].subMenuItemBg);
            setDarkItemBg(data[0].darkItemBg);
            setDarkSubMenuItemBg(data[0].darkSubMenuItemBg);

            setLoading(false);
        });

        const path = window.location.hash.substring(1);
        menu.map((o: any) => {
            if (o && !o.children && o.key === path) {
                o.onClick();
            }
            if (o && o.children) {
                o.children.map((c: any) => {
                    if (c && c.key === path) {
                        c.onClick();
                    }
                });
            }
        });
    }, []);

    if (loading) {
        return (
            <>
                <Row
                    justify="center"
                    align="middle"
                    style={{
                        height: "100vh",
                        backgroundColor: "rgba(230, 230, 230, 0.863)",
                    }}
                >
                    <Spin tip="Carregando.." size="large" />
                </Row>
            </>
        )
    }

    return (
        <ConfigProvider
            theme={{
                token: { colorPrimary: primary },
                components: {
                    Layout: { siderBg: siderBg },
                    Menu: { subMenuItemBg: subMenuItemBg, darkItemBg: darkItemBg, darkSubMenuItemBg: darkSubMenuItemBg },
                },
            }}
        >
            <Layout hasSider>
                <Sider
                    theme="dark"
                    breakpoint="lg"
                    collapsedWidth="0"
                    style={{ minHeight: "100vh", botton: 0 }}
                >
                    <div className="logo" style={{ background: secundary }}>
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
                    <Footer style={{ textAlign: 'center', margin: 0 }}>Created By Talles Salmon - 2024 - <strong>v 1.0.0</strong></Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default Navbar;
