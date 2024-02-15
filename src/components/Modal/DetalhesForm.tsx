import { Button, Form, Input, InputNumber, Select, Switch, message } from "antd";
import { Option } from "antd/es/mentions";
import api from "../../services/api";
import { IForm, IProps } from "./interfaces";
import React, { useState } from "react";
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { getProfileLocalStorage } from "../../context/AuthProvider/util";

const DetalhesForm = (props: IProps) => {
  const [phone, setPhone] = useState('')

  function handlePhone(props) {
    setPhone(phoneMask(props))
  }

    const phoneMask = createNumberMask({
      prefix: '(',
      suffix: ')',
      includeThousandsSeparator: false,
      allowDecimal: false,
      allowNegative: false,
      integerLimit: 11,
      mask: '99) 9999-9999',
    });
    
    const formatPhoneNumber = (value) => {
      const cleanedValue = value.replace(/\D/g, '');
      return cleanedValue.length > 10 ? phoneMask.mask : '(99) 9999-9999';
    };

  const onFinish = async (data: IForm) => {
    console.log(data)
    const newUser = await api.post('/tithers', {
      fullName: data.fullName,
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
      user_id: getProfileLocalStorage()?.sub
      })
    
      if (newUser.status === 201) {
        message.success('Usuário cadastrado com sucesso!!')
        props.handleCancel()
      } else {
        message.error('Ops!! Não consegui cadastrar o usuário, por favor confira as informações')
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
      <Form.Item label="Nome Completo" name="fullName" rules={[
              {
                required: true,
                message: `Por favor insira o nome completo do dizimista!`,
              },
            ]}>
        <Input style={{width: 500}}/>
      </Form.Item>

      <Form.Item label="CPF" name="cpf" rules={[
              {
                required: true,
                message: `Por favor insira o CPF!`,
              },
            ]}>
        <Input maxLength={11} style={{width: 200}}/>
      </Form.Item>

      <Form.Item label="Data de Nascimento" name="birthday" rules={[
              {
                required: true,
                message: `Por favor insira a cidade de residência!`,
              },
            ]}>
        <Input type="date"  style={{width: 200}}/>
      </Form.Item>

      <Form.Item label="Sexo" name="gender" rules={[
              {
                required: true,
                message: `Por favor indique o sexo!`,
              },
            ]}>
        <Select  style={{width: 200}}>
          <Option value="Masculino" />
          <Option value="Feminino" />
        </Select>
      </Form.Item>

      <Form.Item label="Telefone" name="phone" rules={[{}]}>
          {/* <InputNumber maxLength={11} style={{width: 200}} onChange={handlePhone} value={phone} type="phone" /> */}
          <Input
        placeholder="(99) 9999-9999"
      />
      </Form.Item>
      <Form.Item label="E-mail" name="email" rules={[{ type: 'email' }]}>
        <Input style={{width: 300}} />
      </Form.Item>

      <Form.Item label="Endereço" name="address" rules={[
              {
                required: true,
                message: `Por favor insira o endereço!`,
              },
            ]}>
        <Input  style={{width: 500}}/>
      </Form.Item>

      <Form.Item label="Número" name="number" rules={[
              {
                required: true,
                message: `Por favor insira número da residência!`,
              },
            ]}>
        <InputNumber maxLength={5} />
      </Form.Item>

      <Form.Item label="Bairro" name="district" rules={[
              {
                required: true,
                message: `Por favor insira o bairro da residência!`,
              },
            ]}>
        <Input  style={{width: 200}}/>
      </Form.Item>
      
      <Form.Item label="Cidade" name="city" rules={[
              {
                required: true,
                message: `Por favor insira a cidade de residência!`,
              },
            ]}>
        <Input  style={{width: 200}}/>
      </Form.Item>
      
      <Form.Item label="CEP" name="zip" rules={[
              {
                required: true,
                message: `Por favor insira o CEP da residência!`,
              },
            ]}>
        <Input  style={{width: 200}}/>
      </Form.Item>

      <Form.Item label="Comunidade" name="community" rules={[
              {
                required: true,
                message: `Por favor indique a comunidade!`,
              },
            ]}>
        <Select  style={{width: 200}}>
          <Option value="Com. Matriz" />
          <Option value="Com. Nossa Senhora Aparecida" />
          <Option value="Com. Nossa Senhora da Conceição" />
          <Option value="Com. São Sebastião" />
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
