import React from "react";
import { Form } from "antd";

import Stepper from "Common/Stepper";
import Create from "./Create";
import Review from "./Review";

const CreateTransfer = () => {
  const [form] = Form.useForm();

  const tabs = [
    {
      title: "Create",
      render: () => <Create form={form} />
    },
    { title: "Review", render: () => <Review /> },
    { title: "Complete", render: () => {} }
  ];

  return (
    <div className="stepper-padding-status">
      <Stepper
        onEdit={() => {}}
        tabs={tabs}
        id="global-transfers-create"
        className="global-transfer"
      />
    </div>
  );
};

export default CreateTransfer;
