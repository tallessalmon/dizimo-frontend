import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  Popconfirm,
  QRCode,
  Select,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  HeartOutlined
} from "@ant-design/icons";
import moment from "moment-timezone";
import locale from "antd/es/date-picker/locale/pt_BR";
import _ from "lodash";

import api from "../../services/api";
import DetalhesModal from "../../components/Modal/DetalhesModal";
import { IDizimista, ITithe } from "./interfaces";
import { ICommunity } from "../Comunidades/interface";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { IBanks } from "../Bancos/interface";
import generatePix from "../../components/QRCodePix";
import { ColumnType } from "antd/es/table";

const Dizimistas: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IDizimista[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [filterNames, setFilterNames] = useState<IFilter[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [community, setCommunity] = useState<ICommunity[]>([]);
  const [banks, setBanks] = useState<IBanks[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [tither, setTither] = useState<IDizimista | null>(null);
  const [payment, setPayment] = useState<string>("");
  const [value, setValue] = useState<any>(0);
  const [bank, setBank] = useState<IBanks>();
  const [alert, contextHolder] = notification.useNotification();
  const [pixImageSrc, setPixImageSrc] = useState<string>("");

  type NotificationType = 'success' | 'info' | 'warning' | 'error';

  const showDrawer = (selectedTither: IDizimista) => {
    setTither(selectedTither);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (formData: any) => {
    try {
      formData.value = Number(formData.value.replace(",", "."));
      const user: any = getProfileLocalStorage();
      const newUser = await api.post("/tithe", {
        ...formData,
        community: user.community,
        user_id: user.sub,
        tither_id: tither?.id,
        bank_id: +formData.bank_id
      });

      if (newUser.status === 201) {
        openNotification('success', 'Dízimo lançado com sucesso', 'Dízimo cadastrado com sucesso!!\nDeus abençoe sua devolução 🙏🏼❤️');
        form.resetFields();
        onClose();
        getData();
      } else {
        openNotification('error', 'Erro ao lançar dízimo', 'Ops!! Não consegui cadastrar o dízimo, \npor favor confira as informações ou tente mais tarde.');
      }
    } catch (error) {
      openNotification('error', 'Erro ao lançar dízimo', 'Ops!! Algo deu errado, por favor tente novamente.');
    }
  };

  const openNotification = (type: NotificationType, title: string, message: string) => {
    alert[type]({
      message: title,
      description: message,
    });
  };

  const getData = async () => {
    try {
      const tithersResponse = await api.get("/tithers");
      const communitiesResponse = await api.get('/community');
      const banksResponse = await api.get("/banks");

      const tithersData = tithersResponse.data;
      setData(tithersData);

      const listNomesGrouped = _.groupBy(tithersData, "fullName");
      const listNomes: IFilter[] = Object.keys(listNomesGrouped).map(name => ({
        text: name,
        value: name,
      }));
      setFilterNames(listNomes);

      setCommunity(communitiesResponse.data);
      setBanks(banksResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const expandedRowRender = (record: IDizimista) => {
    const columnsTithe: ColumnType<ITithe>[] = [
      {
        title: "Mês Dizimo",
        dataIndex: "date",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return moment(record.date).format("MM/YYYY");
        },
      },
      {
        title: "Valor",
        dataIndex: "value",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return `R$ ${String(record.value).replace(".", ",")}`;
        },
      },
      {
        title: "Forma de Devolucao",
        dataIndex: "mode_pay",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return `${String(record.mode_pay).toUpperCase() === 'NULL' ? '' : String(record.mode_pay).toUpperCase()}`
        },
      },
      {
        title: "Banco",
        dataIndex: "bank_id",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return `${String(record.bank_id).toUpperCase() === 'NULL' ? '' :
            banks.find(bank => bank.id === record.bank_id)?.bank_name.toUpperCase()}`
        },
      },
      {
        title: "Comunidade",
        dataIndex: "community",
        align: 'right',
        width: '10%',
      },
      {
        title: "Data da devolução",
        dataIndex: "created_at",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return moment(record.created_at)
            .add(1, "days")
            .format("DD/MM/YYYY HH:mm:ss");
        },
      },
    ];

    return (
      <Table
        columns={columnsTithe}
        dataSource={record.Tithe}
        pagination={false}
        rowKey={"id"}
        scroll={{ x: "100%" }}
      />
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bank && +value != 0 && form.isFieldsTouched(['bank_id', 'value', 'date'])) {
      form
        .validateFields()
        .then((allValues) => {
          if (bank) {
            setPixImageSrc(generatePix(bank, allValues.value, allValues.date.$d))
          }
        })
    }
  }, [bank, value]);

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: "selectGender" | "text" | "selectDate" | "selectCommunity";
    record: IDizimista;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "selectGender" ? (
        <Select value={record.gender}>
          <Select.Option value="Masculino" key='1' children="Masculino" />
          <Select.Option value="Feminino" key='2' children="Feminino" />
        </Select>
      ) : inputType === "selectDate" ? (
        <Input type="date" value={moment(record.birthday).format('YYYY-MM-DD')} />
      ) : inputType === "selectCommunity" ? (
        <Select value={record.community}>
          {community.map((comm) => {
            if (comm.status) {
              return (<Select.Option key={comm.id} value={comm.name} children={comm.name} />)
            }
          })}
        </Select>
      ) : (
        <Input />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                message: `Por favor insira o ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  interface IFilter {
    text?: string;
    value?: string;
  }

  const isEditing = (record: IDizimista) => String(record.id) === editingKey;

  const edit = (record: Partial<IDizimista> & { id: React.Key }) => {
    form.setFieldsValue({
      nome: "",
      cpf: "",
      perfil: "",
      matricula: "",
      sexo: "",
      status: 1,
      ...record,
    });
    setEditingKey(String(record.id));
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IDizimista;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item: IDizimista = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
        const NewIndex = newData.findIndex((item) => key === item.id);
        const NewItem: IDizimista = newData[NewIndex];
        await api.patch(`/tithers/${NewItem.id}`, {
          ...NewItem,
          id: undefined,
          Tithe: undefined,
          created_at: undefined,
          updated_at: undefined,
        });
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "fullName",
      width: "20%",
      editable: true,
      sorter: (a: IDizimista, b: IDizimista) =>
        a.fullName.localeCompare(b.fullName),
      filters: filterNames,
      filterSearch: true,
      onFilter: (value: string, record: IDizimista) =>
        record.fullName?.startsWith(value),
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      width: "15%",
      editable: true,
    },
    {
      title: "Comunidade",
      dataIndex: "community",
      width: "15%",
      editable: true,
    },
    {
      title: "Sexo",
      dataIndex: "gender",
      width: "10%",
      editable: true,
    },
    {
      title: "Data de Nascimento",
      dataIndex: "birthday",
      type: Date,
      width: "15%",
      editable: true,
      render: (value: string, record: IDizimista) => {
        return moment(record.birthday).format("DD/MM/YYYY");
      },
    },
    {
      title: "Telefone",
      dataIndex: "phone",
      type: Date,
      width: "15%",
      editable: true,
      render: (value: string, record: IDizimista) => {
        return <a target="_blank" href={`https://wa.me/55${record.phone}`}>{record.phone}</a>
      }
    },
    {
      title: "Acões",
      dataIndex: "operation",
      render: (_: any, record: IDizimista) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              <Button type="primary">
                <SaveOutlined /> Salvar
              </Button>
            </Typography.Link>
            <Popconfirm
              title="Deseja cancelar a edição?"
              onConfirm={cancel}
              okText="Sim"
              cancelText="Voltar"
            >
              <Button type="default" danger>
                <CloseCircleOutlined /> Cancelar
              </Button>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Button type="primary" onClick={() => showDrawer(record)}>
              <HeartOutlined /> Lançar Dízimo
            </Button>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Button type="default">
                <EditOutlined /> Editar
              </Button >
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const mergedColumns: any = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IDizimista) => ({
        record,
        inputType:
          col.dataIndex === "gender"
            ? "selectGender"
            : col.dataIndex === "birthday"
              ? "selectDate"
              : col.dataIndex === "community"
                ? "selectCommunity"
                : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      {contextHolder}
      <h2>DIZIMISTAS</h2>
      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
      >
        <Button
          title="Adicionar"
          type="primary"
          onClick={() => setModalOpen(true)}
        >
          <PlusCircleOutlined /> Adicionar
        </Button>
      </div>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowKey={"id"}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          scroll={{ x: "100%" }}
          expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}
        />
      </Form>

      <DetalhesModal
        isModalVisible={modalOpen}
        handleCancel={() => setModalOpen(false)}
        width={1000}
        getData={() => getData()}
      />
      <Drawer title={tither?.fullName} onClose={onClose} open={open} destroyOnClose>
        <Form
          // {...formItemLayout}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Mes de Referência"
            name="date"
            rules={[
              { required: true, message: "Favor inserir o mês de referencia" },
            ]}
          >
            <DatePicker picker="month" locale={locale} format="MM/YYYY" placeholder="" />
          </Form.Item>

          <Form.Item
            label="Valor"
            name="value"
            rules={[
              { required: true, message: "Favor inserir o valor do dizimo" },
              { validateTrigger: "" },
            ]}
          >
            <Input prefix="R$" style={{ width: "100%" }} onChange={(e) => setValue(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Forma de Devolucão"
            name="mode_pay"
            rules={[
              { required: true, message: "Favor inserir a forma da devolucão" },
              { validateTrigger: "" },
            ]}
          >
            <Select style={{ width: "100%" }} onChange={(e) => setPayment(e)}>
              <Select.Option children='PIX' value='pix' />
              <Select.Option children='Dinheiro' value='dinheiro' />
            </Select>
          </Form.Item>

          {
            payment === 'pix' ?
              <>
                <Form.Item
                  label="Banco"
                  name="bank_id"
                  rules={[
                    { required: true, message: "Favor informar o banco que foi feito o PIX" },
                    { validateTrigger: "" },
                  ]}
                >
                  <Select style={{ width: "100%" }} onChange={(e) => banks.map((bk) => { if (bk.id == e) { setBank(bk) } })}>
                    {banks.map((bank) => {
                      if (bank.status) {
                        return (
                          <Select.Option
                            key={String(bank.id)}
                            value={String(bank.id)}
                            children={bank.bank_name}
                          />
                        );
                      };
                    })}
                  </Select>
                </Form.Item>
              </> : <></>
          }
          {
            value !== 0  && bank ?
            <Form.Item>
                  <QRCode
                    type='canvas'
                    value={pixImageSrc || ""}
                    bgColor="#fff"
                    style={{ marginBottom: 16 }}
                    icon="/logo.jpg"
                  />
                </Form.Item>
                : <></>
          }

          {/* {
            bank != null && value != 0
              ? <img src={generatePix(bank, value)} /> : <></>
          } */}


          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Gravar
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Dizimistas;
