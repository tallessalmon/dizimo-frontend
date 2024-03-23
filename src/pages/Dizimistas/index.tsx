import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  Typography,
} from "antd";
import api from "../../services/api";
import _ from "lodash";
import { Option } from "antd/es/mentions";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import DetalhesModal from "../../components/Modal/DetalhesModal";
import { IDizimista } from "./interfaces";
import moment from "moment-timezone";

const Dizimistas: React.FC = () => {
  const InitialData: IDizimista[] = [];
  const [form] = Form.useForm();
  const [data, setData] = useState(InitialData);
  const [editingKey, setEditingKey] = useState("");
  const [filterNames, setFilterNames] = useState<IFilter>();
  const [modalOpen, setModalOpen] = useState(false);
  const [community, setCommunity] = useState<ICommunity[]>([])

  const getData = () => {
    api.get("/tithers", {
    }).then((result) => {
      InitialData.push(result.data);
      const listNomesGrouped = _.groupBy(result.data, "fullName");
      const listNomes: IFilter[] = [];
      for (const name in listNomesGrouped || []) {
        listNomes.push({
          text: name,
          value: name,
        });
      }
      setFilterNames(listNomes as any);

      setData(result.data);
    });

    api.get('/community').then((result) => {
      setCommunity(result.data)
    })
  };

  const expandedRowRender = (record: IDizimista) => {
    const columnsTithe = [
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
        dataIndex: "bank",
        align: 'right',
        width: '10%',
        render: (value: string, record: any) => {
          return `${String(record.bank).toUpperCase() === 'NULL' ? '' : String(record.bank).toUpperCase()}`
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
            if(comm.status) {
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
      render: (value: string, record: IDizimista) =>  {
        return <a target="_blank" href={`https://wa.me/55${record.phone}` }>{record.phone}</a>
      }    },
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
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <Button type="default">
              <EditOutlined /> Editar
            </Button>
          </Typography.Link>
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
    </>
  );
};

export default Dizimistas;
