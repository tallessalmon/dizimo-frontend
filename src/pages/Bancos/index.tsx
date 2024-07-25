import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button, Drawer, Form, Input, InputNumber, Switch, Table, TableProps, message } from "antd";
import { IBanks } from "./interface";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const Bancos: React.FC = () => {
  const [bank, setBanks] = useState<IBanks[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false)
  const [form] = Form.useForm();

  const getBanks = () => {
    api.get("/banks").then((result) => {
      setBanks(result.data);
    });
  };


  useEffect(() => {
    getBanks();
  }, []);

  const onClose = () => {
    setOpenDrawer(false)
  }

  const onFinish = async (data: any) => {
    const newUser = await api.post("/banks", {
      ...data,
    });

    if (newUser.status === 201) {
      message.success("Banco cadastrado com sucesso", 5);
      form.resetFields();
      getBanks();
      onClose()
    } else {
      message.error(
        "Ops!! Não consegui cadastrar o banco! por favor, tente mais tarde.."
      );
    }
  };

  const columns: TableProps<IBanks>["columns"] = [
    {
      title: "Banco",
      dataIndex: "bank_name",
      key: "bank_name",
    },
    {
      title: "Código",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Agencia",
      dataIndex: "agency",
      key: "agency",
    },
    {
      title: "Conta",
      dataIndex: "account",
      key: "account",
    },
    {
      title: "Chave PIX",
      dataIndex: "pix_key",
      key: "pix_key",
    },
    {
      title: "Ativar/Inativar",
      key: "status",
      render: (_, record) => <Switch defaultValue={record.status} onChange={() => api.patch(`banks/${record.id}`, { status: !record.status })} />,
    },
  ];

  return (
    <>
      <h2>BANCOS</h2>

      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30, width: '100%', boxSizing: 'border-box' }}
      >
        <Button type="primary" onClick={() => setOpenDrawer(true)}>
          Adicionar
        </Button>
      </div>
      <Table rowKey={"id"} columns={columns} dataSource={bank} scroll={{ x: "100%" }} />
      <Drawer open={openDrawer} onClose={onClose} destroyOnClose>
        <h2>CADASTRO DE BANCO</h2>
        <Form
          style={{ maxWidth: 600, marginTop: 30 }}
          onFinish={onFinish}
          form={form}
          layout="inline"
        >
          <Form.Item
            label="Banco"
            name="bank_name"
            rules={[
              { required: true, message: "Favor inserir o nome do Banco" },
            ]}
          >
            <Input style={{ width: '100%'}} />
          </Form.Item>

          <Form.Item
            label="Nome do Proprietário"
            name="owner_account_name"
            rules={[
              { required: true, message: "Favor inserir o nome do Proprietário da Conta" },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Código do Banco"
            name="code"
            rules={[
              { required: true, message: "Favor inserir o código do Banco" },
            ]}
          >
            <InputNumber style={{ width: '100%' }}/>
          </Form.Item>

          <Form.Item
            label="Agencia"
            name="agency"
            rules={[
              { required: true, message: "Favor inserir a agencia" },
            ]}
          >
            <Input style={{ width: '100%' }}/>
          </Form.Item>

          <Form.Item
            label="Conta"
            name="account"
            rules={[
              { required: true, message: "Favor inserir a conta" },
            ]}
          >
            <Input style={{ width: '100%' }}/>
          </Form.Item>

          <Form.Item
            label="Chave Pix"
            name="pix_key"
            rules={[
              { required: true, message: "Favor inserir a chave pix referente a esta conta" },
            ]}
          >
            <Input style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default Bancos;
