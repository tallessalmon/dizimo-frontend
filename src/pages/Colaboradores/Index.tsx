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
import { Option } from "antd/es/mentions";
import {
  CloseCircleOutlined,
  EditOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import DetalhesModal from "../../components/Modal/DetalhesModal";
import { IColaboradores } from "./interfaces";



const Colaboradores: React.FC = () => {
  const InitialData: IColaboradores[] = [];
  const [form] = Form.useForm();
  const [data, setData] = useState(InitialData);
  const [editingKey, setEditingKey] = useState("");
  const [filterNomes, setFilterNomes] = useState<IFilter>();
  const [modalOpen, setModalOpen] = useState(false);

  const getData = () => {
    api.get("/colaboradores").then((result) => {
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
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: string;
    inputType: "boolean" | "text" | "selectSex" | "selectProfile";
    record: IColaboradores;
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
      ) : inputType === "selectSex" ? (
        <Select defaultValue={record.sexo}>
          <Option value="Masculino">Masculino</Option>
          <Option value="Feminino">Feminino</Option>
        </Select>
      ) : inputType === "selectProfile" ? (
        <Select defaultValue={record.perfil}>
          <Option value="Perfil 1">Perfil 1</Option>
          <Option value="Perfil 2">Perfil 2</Option>
          <Option value="Perfil 3">Perfil 3</Option>
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

  const isEditing = (record: IColaboradores) => String(record.id) === editingKey;

  const edit = (record: Partial<IColaboradores> & { id: React.Key }) => {
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
      const row = (await form.validateFields()) as IColaboradores;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item: IColaboradores = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        await setData(newData);
        await setEditingKey("");
        const NewIndex = newData.findIndex((item) => key === item.id);
        const NewItem: IColaboradores = newData[NewIndex];
        await api.patch(`/colaboradores/${NewItem.id}`, {
          ...NewItem,
          nome: NewItem.nome.toUpperCase(),
          cracha: Number(NewItem.cracha),
          created_at: undefined,
          updated_at: undefined,
        });
        await api.post(`/colaboradores/send/${NewItem.id}`, {
          body_index: NewIndex
        })
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
      dataIndex: "nome",
      width: "20%",
      editable: true,
      sorter: (a: IColaboradores, b: IColaboradores) =>
        a.nome.localeCompare(b.nome),
      filters: filterNomes,
      filterSearch: true,
      onFilter: (value: string, record: IColaboradores) => record.nome?.startsWith(value),
    },
    {
      title: "CPF",
      dataIndex: "cpf",
      width: "10%",
      editable: true,
    },
    {
      title: "Perfil",
      dataIndex: "perfil",
      width: "10%",
      editable: true,
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      width: "10%",
      editable: true,
    },
    {
      title: "Crachá",
      dataIndex: "cracha",
      type: Number,
      width: "15%",
      editable: true,
    },
    {
      title: "Empresa",
      dataIndex: "empresa",
      width: "10%",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "5%",
      editable: true,
      render: (text: boolean) => text ? <Tag color="success">ATIVO</Tag> : <Tag color="error">INATIVO</Tag>,
      filters: [{text:'ATIVO', value: true}, {text:'INATIVO', value: false}],
      filterSearch: true,
      onFilter: (value: boolean, record: IColaboradores) => record.status === value
    },
    {
      title: "Acões",
      dataIndex: "operation",
      render: (_: any, record: IColaboradores) => {
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
      onCell: (record: IColaboradores) => ({
        record,
        inputType:
          col.dataIndex === "status"
            ? "boolean"
            : col.dataIndex === "sexo"
            ? "selectSex"
            : col.dataIndex === "perfil"
            ? "selectProfile"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <h2>COLABORADORES</h2>
      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
      >
        <Button
          title="Sincronizar"
          type="default"
          style={{ marginRight: 10 }}
          onClick={() => api.post('/colaboradores/send')}
        >
          <SyncOutlined /> Sincronizar
        </Button>
        <Button
          title="Adicionar"
          type="primary"
          style={{ backgroundColor: "#357e35" }}
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

export default Colaboradores;
