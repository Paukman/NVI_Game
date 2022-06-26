import React, { useContext } from "react";
import { Modal } from "antd";
import cross from "assets/icons/Cross/cross.svg";
import { AddRecipientContext } from "./AddRecipientProvider";
import FormEditSecurityQuestionAnswer from "./ModalForms/FormEditSecurityQuestionAnswer";

const EditSecurityQuestionAnswerModal = () => {
  const { editSecurityQuestionAnswer } = useContext(AddRecipientContext);
  const { onCancel } = editSecurityQuestionAnswer;

  return (
    <Modal
      title="Edit security info"
      visible
      centered
      footer={null}
      onCancel={onCancel}
      maskClosable={false}
      closeIcon={<img src={cross} alt="close" />}
    >
      <FormEditSecurityQuestionAnswer />
    </Modal>
  );
};
export default EditSecurityQuestionAnswerModal;
