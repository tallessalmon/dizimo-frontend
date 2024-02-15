import { Button, Form, Input, message, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthProvider/useAuth";
import { useNavigate } from "react-router-dom";
import React from "react";

export const Login = () => {
  const auth = useAuth();
  const history = useNavigate();
  const [form] = Form.useForm();

  async function onFinish(values: { username: string; password: string }) {
    try {
      await auth.authenticate(values.username, values.password);
      history("/");
    } catch (error) {
      message.error("Usuario e/ou senha invalidos");
    }
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: "100vh",
        backgroundColor: "rgba(230, 230, 230, 0.863)",
      }}
    >
      <Col
        style={{
          backgroundColor: "#ffffff",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 80,
          paddingRight: 80,
          margin: 0,
          borderRadius: "7px",
        }}
      >
        <div style={{textAlign: 'center', backgroundColor: "#B47D76", borderRadius: 30}}>
          <img
            src="/logo.jpg"
            alt="Logo"
            height={"100px"}
          />
        </div>

        <Form form={form} name="login" onFinish={onFinish} title="Login">
          <Form.Item>
            <h1 style={{ margin: 0, textAlign: "center" }}>Login</h1>
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Favor preencher seu Usuário!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Login"
              type="text"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Favor inserir a senha!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Senha"
            />
          </Form.Item>
          <Form.Item shouldUpdate style={{ textAlign: "center" }}>
            {() => (
              <Button
                type="primary"
                htmlType="submit"
                disabled={
                  !form.isFieldsTouched(true) ||
                  !!form.getFieldsError().filter(({ errors }) => errors.length)
                    .length
                }
                style={{ paddingInline: "30%", backgroundColor: "#B47D76" }}
              >
                Entrar
              </Button>
            )}
          </Form.Item>
        </Form>
      </Col>
      <img src="/santa-rosa.png" style={{float: 'right', margin: '0 -10px 10px 10px'}}/>
    </Row>
  );
};
