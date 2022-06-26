import React, { useContext } from "react";
import { Modal } from "antd";
import cross from "assets/icons/Cross/cross.svg";
import { AddRecipientContext } from "./AddRecipientProvider";

const AddRecipientModal = () => {
  const { addRecipient } = useContext(AddRecipientContext);
  const { state, onCancel } = addRecipient;

  if (state.formToRender !== null) {
    return (
      <Modal
        title="Add recipient"
        visible
        centered
        footer={null}
        onCancel={onCancel}
        maskClosable={false}
        closeIcon={<img src={cross} alt="close" />}
      >
        <>{state.formToRender}</>
      </Modal>
    );
  }
  return null;
};
export default AddRecipientModal;
