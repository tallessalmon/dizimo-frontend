import {
  Button,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { IForm, IProps } from "./interfaces";
import React, { useEffect, useState } from "react";
import api from "../../../../services/api";

const DetalhesForm = (props: IProps) => {
  const [community, setCommunity] = useState<ICommunity[]>([]);


  useEffect(() => {
    api.get("/community").then((result) => {
      setCommunity(result.data);
    });
  }, []);


  const onFinish = async (data: IForm) => {
    const newUser = await api.post("/users", {
      username: data.username,
      profile: data.profile,
      password: data.password,
      name: data.name,
      community: data.community,
      phone: data.phone,
      email: data.email || undefined,
      status: true
    });

    if (newUser.status === 201) {
      message.success("Usuário cadastrado com sucesso!!");
      props.handleCancel();
    } else {
      message.error(
        "Ops!! Não consegui cadastrar o usuário, por favor confira as informações"
      );
    }
  };
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 24 }}
      layout="horizontal"
      onFinish={onFinish}
      style={{ marginTop: 20 }}
    >
      <Form.Item
        label="Nome Completo"
        name="name"
        rules={[
          {
            required: true,
            message: `Por favor, insira o nome completo`,
          },
        ]}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      <Form.Item
        label="Perfil"
        name="profile"
        rules={[
          {
            required: true,
            message: `Por favor indique o Perfil`,
          },
        ]}
      >
        <Select style={{ width: 200 }}>
          <Select.Option value="administrador" children="Administrador" />
          <Select.Option value="usuario" children="Usuário" />
        </Select>
      </Form.Item>

      <Form.Item label="Usuário" name="username" rules={[{}]}>
        <Input />
      </Form.Item>

      <Form.Item label="Senha" name="password" rules={[{}]}>
        <Input type="password"/>
      </Form.Item>

      <Form.Item label="Telefone" name="phone" rules={[{}]}>
        <Input placeholder="(31)99999-9999"/>
      </Form.Item>
      
      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          { type: "email", message: "Por favor, insira um email válido" },
        ]}
      >
        <Input style={{ width: 300 }} />
      </Form.Item>

      <Form.Item
        label="Comunidade"
        name="community"
        rules={[
          {
            required: true,
            message: `Por favor, indique a comunidade!`,
          },
        ]}
      >
        <Select>
          {community.map((comm) => {
            if (comm.status) {
              return (
                <Select.Option
                  key={comm.id}
                  value={comm.name}
                  children={comm.name}
                />
              );
            }
          })}
        </Select>
      </Form.Item>

      <Form.Item style={{ display: "flex", justifyContent: "end" }}>
        <Button
          type="default"
          onClick={props.handleCancel}
          style={{ marginRight: 10 }}
        >
          Cancelar
        </Button>
        <Button type="primary" htmlType="submit">
          Adicionar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DetalhesForm;
