import React, { useEffect, useState } from "react";
import { getProfileLocalStorage } from "../../context/AuthProvider/util";
import { PlusCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  Form,
  GetProp,
  Image,
  Input,
  Pagination,
  Select,
  SelectProps,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
  message as messageApi,
  notification,
} from "antd";
import { IInformation } from "./interfaces";
import api from "../../services/api";
import moment from "moment-timezone";
import ImgCrop from "antd-img-crop";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';
import TextArea from "antd/es/input/TextArea";
import _ from "lodash";
const { Meta } = Card;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type TagRender = SelectProps["tagRender"];

const Informativos: React.FC = () => {
  const user = getProfileLocalStorage();
  const [open, setOpen] = useState(false);
  const [openNewInfo, setOpenNewInfo] = useState(false);
  const [dataInfo, setDataInfo] = useState<IInformation[]>([]);
  const [selectInfo, setSelectInfo] = useState<IInformation>();
  const [currentPage, setCurrentPage] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [options, setOptions] = useState<any>();

  interface IFilter {
    text?: string;
    value?: string;
  }
  
  const pageSize = 8;

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY
    },
  });

  const uuid = uuidv4();

  const [api_Notification, contextHolder] = notification.useNotification();
  const [message, contextHolderMessage] = messageApi.useMessage();

  const descricaoFormatada = selectInfo?.message
    ? formatarDescricao(selectInfo.message)
    : "";

  useEffect(() => {
    initialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialData = () => {
    api.get("/tasks").then((e) => {
      setDataInfo(e.data);
    });

    api.get('community').then(({data}) => {
      const listCommunityGrouped = _.groupBy(data, "name");
      const dataCommunity: IFilter[] = [];
      for (const community in listCommunityGrouped || []) {
        dataCommunity.push({
          value: community,
          text: community,
        });
      }
      setOptions(dataCommunity)
    })
  };


  const tagRender: TagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={"blue"}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    );
  };

  const onClose = () => {
    setFileList([]);
    setDataInfo([]);
    setSelectInfo(undefined);
    initialData();
    setOpen(false);
  };

  const onCloseNewInfo = () => {
    setOpenNewInfo(false);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  function formatarDescricao(descricao: string) {
    const descricaoFormatada = descricao.replace(/\n/g, "<br>");
    const estiloCSS = "font-size: 16px;";
    return `<p style="${estiloCSS}">${descricaoFormatada}</p>`;
  }

  const handleUpload = async (file: File) => {
    const newUUID = String(uuid);

    try {
      setImageUrl(`${newUUID}.${file.name.split(".").pop()}`);
      const command = new PutObjectCommand({
        Key: `${newUUID}.${file.name.split(".").pop()}`,
        Body: file,
        Bucket: "images-psrl",
      });

      setFileList([
        {
          uid: newUUID,
          name: `${newUUID}.${file.name.split(".").pop()}`,
          status: "done",
          url: `https://images-psrl.s3.amazonaws.com/${newUUID}.${file.name
            .split(".")
            .pop()}`,
        },
      ]);

      await client.send(command);

      message.success("Imagem enviada com sucesso!");
    } catch (error) {
      message.error("Erro ao enviar a imagem.");
    }
  };

  const showDrawer = async (info: IInformation) => {
      const { data } = await api.get(`/tasks/${info.id}`);
      setSelectInfo(data);
      setOpen(true);
  };

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };
  const startIndex = (currentPage - 1) * pageSize;
  const visibleDataInfo = dataInfo.slice(startIndex, startIndex + pageSize);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleForm = (data: any) => {
    try {
      api
        .post("/tasks", {
          message: data.message,
          image: imageUrl,
          user_id: user?.sub,
          group: data.group
        })
        .then(() => {
          setOpenNewInfo(false);
          setDataInfo([]);
          initialData();
          setFileList([]);
          message.success("Informativo cadastrado com sucesso");
          return;
        });
    } catch (error) {
      message.error("Erro ao incluir informativo");
      return error;
    }
  };

  return (
    <>
      {contextHolder}
      {contextHolderMessage}
      <h2>INFORMATIVOS</h2>
      <div
        style={{ display: "flex", justifyContent: "end", paddingBottom: 30 }}
      >
        <Button
          title="Adicionar"
          type="primary"
          onClick={() => setOpenNewInfo(true)}
        >
          <PlusCircleOutlined />
          Novo Informativo
        </Button>
      </div>

      <Flex
        justify="flex-start"
        gap=""
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            maxWidth: "100vw",
          }}
        >

          {visibleDataInfo.map((e) => (
            <Card
              hoverable
              style={{ maxWidth: 270, minWidth: 250, margin: 10 }}
              onClick={() => showDrawer(e)}
              key={e.id}
              cover={
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <img
                    alt="imagem de fundo do informativo"
                    src={`https://images-psrl.s3.amazonaws.com/${e.image}`}
                    style={{ maxWidth: 220, maxHeight: 110 }}
                  />
                </div>
              }
            >
              <Meta
                // title={JSON.parse(e.abrangence).map((com) => com + ' | ')}
                description={e ? JSON.parse(e?.abrangence).map((com) => <Tag key={com}>{com}</Tag>) : ""}
                style={{ marginRight: 15, marginBottom: 15 }}
              />
            { moment(e.created_at).format("DD/MM/YYYY HH:mm")}
            </Card>
          ))}
        </div>
        <Pagination
          current={currentPage}
          onChange={handleChangePage}
          pageSize={pageSize}
          total={dataInfo.length}
          style={{ textAlign: "center", marginTop: 20 }}
        />
      </Flex>
      <Drawer
        title='DETALHES DA MENSAGEM'
        width={500}
        onClose={onClose}
        open={open}
        destroyOnClose
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            alt="imagem de fundo do informativo"
            src={`https://images-psrl.s3.amazonaws.com/${selectInfo?.image}`
            }
            style={{ maxWidth: "30vh" }}
          />
        </div>

        <Divider />
        <b>ABRANGENCIA:</b> <br/><br/>
        {selectInfo ? JSON.parse(selectInfo?.abrangence).map((com) => <Tag key={com}>{com}</Tag>) : ""}
        <Divider />
        <b>MENSAGEM:</b> <br/><br/>
        <div
          dangerouslySetInnerHTML={{ __html: descricaoFormatada }}
          style={{ textAlign: "justify" }}
        />
        <Divider />
        <div style={{ textAlign: "right", fontStyle: "italic" }}>
          {"Escrito por: " + selectInfo?.user?.name}
          <p />
          {moment(selectInfo?.created_at).format("DD/MM/YYYY HH:mm")}
        </div>
        <div style={{ textAlign: "right" }}></div>
      </Drawer>

      <Drawer
        title='ENVIAR INFORMATIVO'
        width={500}
        onClose={onCloseNewInfo}
        open={openNewInfo}
        placement="left"
        destroyOnClose
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ImgCrop
            showGrid
            rotationSlider
            aspectSlider
            showReset
            modalOk="Fazer upload"
            modalCancel="Cancelar"
            resetText="Resetar"
            modalTitle="Editor"
          >
            <Upload
              listType="picture-card"
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
              onPreview={handlePreview}
              onChange={onChange}
              fileList={fileList}
            >
              {fileList.length < 1 && <CloudUploadOutlined /> &&
                " " &&
                " Upload"}
            </Upload>
          </ImgCrop>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </div>
        <Form onFinish={handleForm}>
          <Divider />
          <Form.Item
            name="group"
            label="Abrangência"
            rules={[
              {
                required: true,
                message: `Por favor informe o título`,
              },
            ]}
          >
            <Select
          mode="multiple"
          tagRender={tagRender}
          defaultValue={options}
          style={{ width: "100%" }}
          options={options}
        />
          </Form.Item>
          <Divider />
          <Form.Item
            name="message"
            label="Mensagem"
            rules={[
              {
                required: false,
                message: `Por favor informe a mensagem`,
              },
            ]}
          >
            <TextArea />
          </Form.Item>
          <Button htmlType="submit">Enviar Mensagem</Button>
        </Form>
      </Drawer>
    </>
  );
};

export default Informativos;
