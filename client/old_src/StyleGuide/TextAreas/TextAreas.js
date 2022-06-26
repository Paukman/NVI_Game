/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from "react";
import { Row, Col, Card, Form, Input } from "antd";

import { Message } from "../Components/Icons";
import { Button, TextAreaWithCounter } from "../Components";

const { TextArea } = Input;

const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 7 },
    lg: { span: 5 }
  }
};

const colLayout = {
  wrapperCol: {
    xs: { span: 24 }
  }
};

const xsProp = {
  offset: 1,
  span: 22
};
const smProp = {
  offset: 1,
  span: 22
};
const mdProp = {
  offset: 2,
  span: 20
};

const COUNT_400 = 400;
const COUNT_32 = 32;

const TextAreas = () => {
  const [form] = Form.useForm();
  const [helperText, setHelperText] = useState("");
  const [noteText, setNoteText] = useState("");

  const onFinish = async values => {
    console.log(values);
  };

  const updateText = text => {
    setHelperText(text);
  };

  const updateNoteText = text => {
    setNoteText(text);
  };

  return (
    <>
      <Card>
        <Row className="padding-top-10">
          <Col xs={xsProp} sm={smProp} md={mdProp}>
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                beneficiaryMessage: "",
                count: `0/${COUNT_400}`,
                note: "",
                noteCount: `0/${COUNT_32}`
              }}
            >
              <Form.Item
                label="Message to sender (optional)"
                htmlFor="beneficiaryMessage"
                className="input-group margin-bottom-32"
                help={helperText}
                {...colLayout}
              >
                <Message className="input-group-icon-text-area" />
                <Form.Item
                  htmlFor="count"
                  className="input-group-textarea-count"
                >
                  <Form.Item name="count" noStyle>
                    <TextArea
                      readOnly
                      bordered={false}
                      style={{
                        resize: "none"
                      }}
                      className="font-size-12"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item name="beneficiaryMessage" noStyle>
                  <TextAreaWithCounter form={form} updateText={updateText} />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Note (optional)"
                htmlFor="note"
                className="input-group margin-bottom-32"
                help={noteText}
                {...colLayout}
              >
                <Message className="input-group-icon-text-area" />
                <Form.Item
                  htmlFor="noteCount"
                  className="input-group-textarea-count"
                >
                  <Form.Item name="noteCount" noStyle>
                    <TextArea
                      readOnly
                      bordered={false}
                      style={{
                        resize: "none"
                      }}
                      className="font-size-12"
                    />
                  </Form.Item>
                </Form.Item>
                <Form.Item name="note" noStyle>
                  <TextAreaWithCounter
                    form={form}
                    rows={2}
                    maxLength={COUNT_32}
                    fieldName="noteCount"
                    helperText="Note max chars reached."
                    updateText={updateNoteText}
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item {...tailLayout} className="margin-top-20">
                <Button primary htmlType="submit">
                  Submit values
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TextAreas;
