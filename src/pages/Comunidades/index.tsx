import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { IDizimista } from "../Dizimistas/interfaces";
import { Button, Form, Input, Switch, Table, TableProps, message } from "antd";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";

interface ICommunity {
  id: number;
  name: string;
  status?: boolean;
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const Comunidades: React.FC = () => {
  const [community, setCommunitys] = useState<ICommunity[]>([]);
  const [form] = Form.useForm();

  const getCommunitys = () => {
    api.get("/community").then((result) => {
      setCommunitys(result.data);
    });
  };

  useEffect(() => {
    getCommunitys();
  }, []);

  const onFinish = async (data: any) => {
    const newUser = await api.post("/community", {
      ...data,
    });

    if (newUser.status === 201) {
      message.success("Comunidade cadastrada com sucesso", 5);
      form.resetFields();
      getCommunitys();
    } else {
      message.error(
        "Ops!! Não consegui cadastrar a comunidade! por favor, tente mais tarde.."
      );
    }
  };

  const columns: TableProps<ICommunity>["columns"] = [
    {
      title: "Comunidade",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ativar/Inativar",
      key: "status",
      render: (_, record) => <Switch value={record.status} />,
    },
  ];

  return (
    <>
      <h2>COMUNIDADES</h2>

      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
      >
        <Form
          style={{ maxWidth: 600, marginTop: 50 }}
          onFinish={onFinish}
          form={form}
          layout="inline"
        >
          <Form.Item
            label="Comunidade"
            name="name"
            rules={[
              { required: true, message: "Favor inserir o nome da Comunidade" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{}}>
            <Button type="primary" htmlType="submit">
              Adicionar
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Table columns={columns} dataSource={community} />
    </>
  );
};
export default Comunidades;
