import React, { useContext } from "react";
import { Form } from "antd";
import AddRecipientModal from "./AddRecipientModal";
import { AddRecipientContext } from "./AddRecipientProvider";

const AddRecipient = () => {
  const { addRecipient } = useContext(AddRecipientContext);
  const { onFormFinish } = addRecipient;

  return (
    <Form.Provider onFormFinish={onFormFinish}>
      <div>
        <AddRecipientModal />
      </div>
    </Form.Provider>
  );
};

export default AddRecipient;
