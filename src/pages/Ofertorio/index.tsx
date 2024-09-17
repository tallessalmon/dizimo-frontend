import React, { useEffect, useState } from "react";
import api from "../../services/api";
import locale from "antd/es/date-picker/locale/pt_BR";
import { IDizimista } from "../Dizimistas/interfaces";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import moment from "moment-timezone";
import dayjs from "dayjs";
import { IBanks } from "../Bancos/interface";
import { RangePickerProps } from "antd/es/date-picker";
import { useAuth } from "../../context/AuthProvider/useAuth";

const Ofertorio: React.FC = () => {
  const [payment, setPayment] = useState<String>('')
  const [form] = Form.useForm();
  const user = getProfileLocalStorage()

  const auth = useAuth()
  if (user && user.exp && user.exp < Math.floor(Date.now() / 1000)) {
    auth.logout()
  }
  
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
    const newUser = await api.post("/offertory", {
      ...data,
      community: user.community,
      user_id: user.sub,
    });

    if (newUser.status === 201) {
      message.success("Ofertório cadastrado com sucesso!!\n Que Deus multiplique na vida de todos 🙏🏼❤️", 5);
      form.resetFields();
    } else {
      message.error(
        "Ops!! Não consegui cadastrar o ofertório, por favor confira as informações ou tente mais tarde.."
      );
    }
  };


  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day')
  };

  return (
    <>
      <h2>OFERTÓRIO</h2>

      <Form
        {...formItemLayout}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          label="Data"
          name="date"
          rules={[
            { required: true, message: "Favor inserir o dia de referencia" },
          ]}
        >
          <DatePicker disabledDate={disabledDate} locale={locale} format="DD/MM/YYYY" placeholder=""/>
        </Form.Item>

        <Form.Item
          label="Valor"
          name="value"
          rules={[
            { required: true, message: "Favor inserir o valor do ofertório" },
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
export default Ofertorio;
