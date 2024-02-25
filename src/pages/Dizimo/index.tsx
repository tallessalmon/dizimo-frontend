import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { IDizimista } from "../Dizimistas/interfaces";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";

const Dizimo: React.FC = () => {
  const [tithers, setTithers] = useState<IDizimista[]>([]);
  const [form] = Form.useForm();

  const getTithers = () => {
    api.get("/tithers").then((result) => {
      setTithers(result.data);
    });
  };

  useEffect(() => {
    getTithers();
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };

  const onFinish = async (data: any) => {
    data.value = Number(data.value.replace(",", "."));
    const user: any = getProfileLocalStorage();
    const newUser = await api.post("/tithe", {
      ...data,
      community: user.community,
      user_id: user.sub,
    });

    if (newUser.status === 201) {
      message.success("Dizimo cadastrado com sucesso!!\n Deus abençoe sua devolução 🙏🏼❤️", 5);
      form.resetFields();
    } else {
      message.error(
        "Ops!! Não consegui cadastrar o dízimo, por favor confira as informações ou tente mais tarde.."
      );
    }
  };

  return (
    <>
      <h2>DÍZIMO</h2>

      <Form
        {...formItemLayout}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label="Dizimista"
          name="tither_id"
          rules={[{ required: true, message: "Favor selecionar o dizimista" }]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (
                String(option?.children)
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(
                    /[\u0300-\u036f|\u00b4|\u0060|\u005e|\u007e]/g,
                    ""
                  ) ?? ""
              ).includes(input)
            }
            filterSort={(optionA, optionB) =>
              (String(optionA?.children) ?? "")
                .toLowerCase()
                .localeCompare((String(optionB?.children) ?? "").toLowerCase())
            }
          >
            {tithers.map((thither) => {
              return (
                <Select.Option
                  key={thither.id}
                  value={thither.id}
                  children={thither.fullName}
                />
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Mes de Referência"
          name="date"
          rules={[
            { required: true, message: "Favor inserir o mês de referencia" },
          ]}
        >
          <DatePicker picker="month" format="MM/YYYY" placeholder="" />
        </Form.Item>

        <Form.Item
          label="Valor"
          name="value"
          rules={[
            { required: true, message: "Favor inserir o valor do dizimo" },
            { validateTrigger: "" },
          ]}
        >
          <Input prefix="R$" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Gravar
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Dizimo;
