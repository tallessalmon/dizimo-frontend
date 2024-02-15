import { Col, Row } from "antd";
import Button from "antd/es/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getUserLocalStorage } from "../../context/AuthProvider/util";

export const ProtectedLayout = ({ children }: { children: JSX.Element }) => {
    const navigate = useNavigate();
    const user = getUserLocalStorage()
      
    if (!user || user === 'null') {
        return (
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh"
                }}
            >
                <Col span={12}>
                    <h1>Você não tem acesso a esta página</h1>
                    <Button onClick={() => navigate('/login')}>Ir para o Login</Button>
                </Col>
            </Row>
        );
    }

    return children;
}