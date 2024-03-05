import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import api from "../../services/api";
import _ from "lodash";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { IUser } from "./interface";
import moment from "moment-timezone";
import DetalhesModal from "./components/Modal/DetalhesModal";
import { ICommunity } from "../Comunidades/interface";



const Usuarios: React.FC = () => {
  const InitialData: IUser[] = [];
  const [form] = Form.useForm();
  const [data, setData] = useState(InitialData);
  const [editingKey, setEditingKey] = useState("");
  const [filterNomes, setFilterNomes] = useState<IFilter>();
  const [modalOpen, setModalOpen] = useState(false);
  const [community, setCommunity] = useState<ICommunity[]>([])

  const getData = () => {
    api.get("/users").then((result) => {
      InitialData.push(result.data);
      const listNomesGrouped = _.groupBy(result.data, "nome");
      const listNomes: IFilter[] = [];
      for (const nome in listNomesGrouped || []) {
        listNomes.push({
          text: nome,
          value: nome,
        });
      }
      setFilterNomes(listNomes as any);

      setData(result.data);
    });

    api.get('/community').then((result) => {
      setCommunity(result.data)
    })
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: "boolean" | "text" | "select" | "selectProfile" | "date";
    record: IUser;
    index: number;
    children: React.ReactNode;
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === "boolean" ? (
        <Switch
          defaultChecked={record.status}
          onChange={() => (record.status = !record.status)}
        />
      ) : inputType === "select" ? (
        <Select value={record.community}>
          {community.map((comm) => {
            if(comm.status) {
              return (<Select.Option key={comm.id} value={comm.name} children={comm.name} />)
            }
          })}
        </Select>
      ) : inputType === "selectProfile" ? (
        <Select value={record.community}>
          <Select.Option key="1" value="administrador" children="Administrador"/>
          <Select.Option key="2" value="usuario" children="Usuário" />
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
                required: true,
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

  const isEditing = (record: IUser) => String(record.id) === editingKey;

  const edit = (record: Partial<IUser> & { id: React.Key }) => {
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
      const row = (await form.validateFields()) as IUser;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item: IUser = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        await setData(newData);
        await setEditingKey("");
        const NewIndex = newData.findIndex((item) => key === item.id);
        const NewItem: IUser = newData[NewIndex];
        await api.patch(`/users/${NewItem.id}`, {
          ...NewItem,
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
      dataIndex: "name",
      width: "20%",
      editable: true,
      sorter: (a: IUser, b: IUser) =>
        a.name.localeCompare(b.name),
      filters: filterNomes,
      filterSearch: true,
      onFilter: (value: string, record: IUser) => record.name?.startsWith(value),
    },
    {
      title: "Perfil",
      dataIndex: "profile",
      width: "10%",
      editable: true,
    },
    {
      title: "Usuário",
      dataIndex: "username",
      width: "10%",
      editable: true,
    },
    {
      title: "Senha",
      dataIndex: "password",
      width: "10%",
      editable: true,
      render: () => "*********",
    },
    {
      title: "Comunidade",
      dataIndex: "community",
      width: "10%",
      editable: true,
    },
    {
      title: "Ultima Atualização",
      dataIndex: "updated_at",
      width: "15%",
      editable: false,
      render: (text: string) => text ? moment(text).format("DD/MM/YYYY HH:mm:ss") : ""
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      editable: true,
      render: (text: boolean) => text ? <Tag color="success">ATIVO</Tag> : <Tag color="error">INATIVO</Tag>,
      filters: [{text:'ATIVO', value: true}, {text:'INATIVO', value: false}],
      filterSearch: true,
      onFilter: (value: boolean, record: IUser) => record.status === value
    },
    {
      title: "Acões",
      dataIndex: "operation",
      render: (_: any, record: IUser) => {
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

  const mergedColumns:any = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IUser) => ({
        record,
        inputType:
          col.dataIndex === "status"
            ? "boolean"
            : col.dataIndex === "profile"
            ? "selectProfile"
            : col.dataIndex === "community"
            ? "select"
            : col.dataIndex === "updated_at"
            ? "date"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <h2>Usuários</h2>
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

export default Usuarios;
