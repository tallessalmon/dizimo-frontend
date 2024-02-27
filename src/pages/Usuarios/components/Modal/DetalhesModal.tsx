import { Modal } from "antd";
import React from "react";
import DetalhesForm from "./DetalhesForm";
import { IProps } from "./interfaces";

const DetalhesModal: React.FC<IProps>=(props) => {
  return (
    <>
      <Modal
        title="Cadastro de Usuário"
        open={props.isModalVisible}
        width={props.width}
        footer={null}
        onCancel={props.handleCancel}
        destroyOnClose
      >
        <DetalhesForm handleCancel={props.handleCancel} getData={props.getData}/>
      </Modal>
    </>
  );
};
export default DetalhesModal;
