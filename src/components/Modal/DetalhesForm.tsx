import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import api from "../../services/api";
import { IForm, IProps } from "./interfaces";
import React, { useEffect, useState } from "react";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { cpf } from "cpf-cnpj-validator";
import { ICommunity } from "../../pages/Comunidades/interface";
import locale from "antd/es/date-picker/locale/pt_BR";

const DetalhesForm = (props: IProps) => {
  const [community, setCommunity] = useState<ICommunity[]>([]);


  useEffect(() => {
    api.get("/community").then((result) => {
      setCommunity(result.data);
    });
  }, []);


  const onFinish = async (data: IForm) => {
    const newUser = await api.post("/tithers", {
      fullName: data.fullName.toUpperCase(),
      community: data.community,
      address: data.address,
      number: data.number,
      district: data.district,
      city: data.city,
      gender: data.gender,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      birthday: new Date(data.birthday),
      user_id: getProfileLocalStorage()?.sub,
    });

    if (newUser.status === 201) {
      message.success("Usuário cadastrado com sucesso!!");
      props.handleCancel();
    } else {
      message.error(
        "Ops!! Não consegui cadastrar o usuário, por favor confira as informações"
      );
    }

    props.getData()
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
        name="fullName"
        rules={[
          {
            required: true,
            message: `Por favor, insira o nome completo do dizimista!`,
          },
        ]}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      <Form.Item
        label="CPF"
        name="cpf"
        rules={[
          {
            required: false,
            // message: `Por favor, insira o CPF!`,
          },
          {
            validator: (_, value) => {
              if (value && !cpf.isValid(value)) {
                return Promise.reject(new Error("CPF inválido"));
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input maxLength={11} style={{ width: 200 }} />
      </Form.Item>

      <Form.Item
        label="Data de Nascimento"
        name="birthday"
        rules={[
          {
            required: true,
            message: `Por favor, insira a cidade de residência!`,
          },
        ]}
      >
        <DatePicker format={"DD/MM/YYYY"} locale={locale} placeholder="DD/MM/AAAA" placement="bottomLeft"/>
      </Form.Item>

      <Form.Item
        label="Sexo"
        name="gender"
        rules={[
          {
            required: false,
            // message: `Por favor indique o sexo!`,
          },
        ]}
      >
        <Select style={{ width: 200 }}>
          <Select.Option value="Masculino" children="Masculino" />
          <Select.Option value="Feminino" children="Feminino" />
          <Select.Option value="-" children="-" />
        </Select>
      </Form.Item>

      <Form.Item label="Telefone" name="phone" rules={[{}]}>
        <Input
          placeholder="(99) 9999-9999"
        />
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
        label="Endereço"
        name="address"
        rules={[
          {
            required: true,
            message: `Por favor, insira o endereço!`,
          },
        ]}
      >
        <Input style={{ width: 500 }} />
      </Form.Item>

      <Form.Item
        label="Número"
        name="number"
        rules={[
          {
            required: true,
            message: `Por favor, insira número da residência!`,
          },
        ]}
      >
        <InputNumber maxLength={5} />
      </Form.Item>

      <Form.Item
        label="Bairro"
        name="district"
        rules={[
          {
            required: true,
            message: `Por favor, insira o bairro da residência!`,
          },
        ]}
      >
        <Input style={{ width: 200 }} />
      </Form.Item>

      <Form.Item
        label="Cidade"
        name="city"
        rules={[
          {
            required: true,
            message: `Por favor, insira a cidade de residência!`,
          },
        ]}
      >
        <Input style={{ width: 200 }} />
      </Form.Item>

      <Form.Item
        label="CEP"
        name="zip"
        rules={[
          {
            required: true,
            message: `Por favor, insira o CEP da residência!`,
          },
        ]}
      >
        <Input style={{ width: 200 }} />
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
