/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import { Card, Form, Input, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import cross from "assets/icons/Cross/cross.svg";
import { Button } from "../Components";

const Modals = () => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const confirm = () => {
    Modal.confirm({
      keyboard: false, // required to disable esc for confirm & info
      centered: true, // confirm and info to be centered
      title: "Confirm",
      icon: null, // no icons used for confirm and info
      content: "Confirming something",
      okText: "Ok does this wrap nicely?",
      okType: "link",
      okButtonProps: { className: "ant-btn-link md-link" },
      cancelText: "Cancel does this wrap too",
      cancelButtonProps: { className: "ant-btn-link md-link" },
    });
  };

  const info = () => {
    Modal.info({
      keyboard: false, // required to disable esc for confirm & info
      centered: true, // required to center info and confirm
      title: "Info",
      icon: null, // no icons used for confirm and info
      content: "Some details",
      okText: "Ok",
      okType: "link",
      okButtonProps: { className: "ant-btn-link md-link" },
    });
  };

  return (
    <>
      <Card>
        <Button primary onClick={() => { setShow(true); }}>
          Basic Modal
        </Button>
        <Modal
          title="Basic Modal with a very long title so we can see what that looks like"
          visible={show}
          maskClosable={false} // disable ability to close base modal by clicking on modal mask
          closeIcon={<img src={cross} alt="close" />} // use close icon supplied by UX
          onCancel={() => {
            setShow(false);
          }}
          footer={[
            <Button primary onClick={() => { setShow(false); }}>
              Submit
            </Button>,
            <Button text onClick={() => { setShow(false); }}>
              Cancel and close
            </Button>
          ]}
        >
          <p>
            Getting the margin around the header bottom border would require
            custom css
          </p>
          <p>Moving buttons to the left would require custom css</p>
          <p>What are the expectations of the background? Clickable?</p>
        </Modal>
      </Card>
      <Card>
        <Button primary onClick={() => { confirm(); }}>
          Confirmation
        </Button>
      </Card>
      <Card>
        <Button primary onClick={() => { info(); }}>
          Information
        </Button>
      </Card>
      <Card>
        <Button primary onClick={() => { setShowForm(true); }}>
          Form Modal
        </Button>
        <Modal
          title="Form Modal"
          visible={showForm}
          maskClosable={false} // disable ability to close modal by clicking on mask
          closeIcon={<img src={cross} alt="close" />} // use close icon supplied by UX
          onCancel={() => { setShowForm(false); }}
          footer={[
            <Button primary onClick={() => { setShowForm(false); }}>
              Submit
            </Button>,
            <Button text onClick={() => { setShowForm(false); }}>
              Cancel and close
            </Button>
          ]}
        >
          <Form layout="vertical">
            <Form.Item
              label="First name"
              className="input-group margin-bottom-24"
            >
              <CheckCircleOutlined
                className="input-group-icon"
                style={{ fontSize: "24px" }}
              />
              <Form.Item name="firstName" noStyle>
                <Input size="large" />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="Last name"
              className="input-group margin-bottom-24"
            >
              <CheckCircleOutlined
                className="input-group-icon"
                style={{ fontSize: "24px" }}
              />
              <Form.Item name="lastName" noStyle>
                <Input size="large" />
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </>
  );
};

export default Modals;
