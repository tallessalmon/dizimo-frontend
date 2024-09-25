import React, { useEffect, useState } from 'react';
import { Button, ColorPicker, Form, message, Row, Space, Spin } from 'antd';
import { getProfileLocalStorage } from '../../context/AuthProvider/util';
import api from '../../services/api';
import { ITheme } from './interface';

const ThemeCustomization = () => {
  const [primary, setPrimary] = useState(null);
  const [secundary, setSecundary] = useState(null);
  const [siderBg, setSiderBg] = useState(null);
  const [subMenuItemBg, setSubMenuItemBg] = useState(null);
  const [darkItemBg, setDarkItemBg] = useState(null);
  const [darkSubMenuItemBg, setDarkSubMenuItemBg] = useState(null);

  useEffect(() => {
    api.get('theme').then(({ data }: any) => {
      setPrimary(data[0].primary);
      setSecundary(data[0].secundary);
      setSiderBg(data[0].siderBg);
      setSubMenuItemBg(data[0].subMenuItemBg);
      setDarkItemBg(data[0].darkItemBg);
      setDarkSubMenuItemBg(data[0].darkSubMenuItemBg);
    });
  }, []);

  const user = getProfileLocalStorage();
  const onFinish = (data: ITheme) => {
    api.post('theme', {
      primary: data.primary || primary,
      secundary: data.secundary || secundary,
      siderBg: data.siderBg || siderBg,
      subMenuItemBg: data.subMenuItemBg || subMenuItemBg,
      darkItemBg: data.darkItemBg || darkItemBg,
      darkSubMenuItemBg: data.darkSubMenuItemBg || darkSubMenuItemBg,
      user_id: user?.sub,
    })
      .then(() => {
        message.success('Tema atualizado com sucesso');
      })
      .catch(() => {
        message.error('Houve um erro ao tentar atualizar');
      });
  };

  // Verifica se as cores foram carregadas
  const isLoading = [primary, secundary, siderBg, subMenuItemBg, darkItemBg, darkSubMenuItemBg].some(
    (color) => color === null
  );

  return (
    <div>
      <h2>CUSTOMIZAR TEMA</h2>
      <Space direction="vertical">
        {isLoading ? (
          <>
          <Row
            justify="center"
            align="middle"
            style={{
              height: "100vh",
              width: "100vw",
              margin: 0,
              backgroundColor: "rgba(230, 230, 230, 0.863)",
            }}
          >
            <Spin tip="Carregando.." size="large" />
          </Row>
        </>
        ) : (
          <Form onFinish={onFinish} layout="vertical">
            <Form.Item
              name="primary"
              label="Primária"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={primary} showText allowClear />
            </Form.Item>
            <Form.Item
              name="secundary"
              label="Fundo Logo"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={secundary} showText allowClear />
            </Form.Item>
            <Form.Item
              name="siderBg"
              label="Cor de Fundo do Menu"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={siderBg} showText allowClear />
            </Form.Item>
            <Form.Item
              name="subMenuItemBg"
              label="subMenuItemBg"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={subMenuItemBg} showText allowClear disabled />
            </Form.Item>
            <Form.Item
              name="darkItemBg"
              label="Cor do Fundo dos itens do menu"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={darkItemBg} showText allowClear />
            </Form.Item>
            <Form.Item
              name="darkSubMenuItemBg"
              label="Cor do Fundo dos itens do Sub-Menu"
              getValueFromEvent={(color) => {
                return '#' + color.toHex();
              }}
            >
              <ColorPicker defaultValue={darkSubMenuItemBg} showText allowClear />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type='primary'>Atualizar</Button>
            </Form.Item>
          </Form>
        )}
      </Space>
    </div>
  );
};

export default ThemeCustomization;
