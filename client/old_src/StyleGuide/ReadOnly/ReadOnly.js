/* eslint-disable no-console */
import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Typography,
  Divider,
  Select,
  Input as AntInput
} from "antd";

import { User, Account, Message, CircledDollarSign } from "../Components/Icons";
import { Input, Button, Select as SelectComponent } from "../Components";

const { Title } = Typography;
const { Option } = Select;

const pageValues = {
  name: "Willy Wonka (willy@willywonkafactory.com)",
  amount: "$10.00",
  message: "ShortMessage",
  requesterMessage:
    "Please pay me back for the gumballs and chocolates you purchased the other day. ",
  longMessage:
    "P23456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ",
  emptyInput: "default value",
  selectOptions: [
    "No-Fee All-In Account (1000) - $89,499.46",
    "Springboard Savings Account (2000) - $39,593.01",
    "My Account"
  ]
};

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

const ReadOnlyStyle = () => {
  const [form] = Form.useForm();
  const onFinish = async values => {
    console.log(values);
  };

  return (
    <>
      <Card>
        <Row className="padding-top-10">
          <Col xs={xsProp} sm={smProp} md={mdProp}>
            <Title level={3}>Money accepted</Title>
            <Divider className="light margin-bottom-30" />
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                name: pageValues.name,
                amount: pageValues.amount,
                message: pageValues.message,
                longMessage: pageValues.longMessage,
                requesterMessage: pageValues.requesterMessage,
                emptyInput: pageValues.emptyInput,
                selectOptions: pageValues.selectOptions[2]
              }}
            >
              <Form.Item label="Input" className="input-group margin-bottom-20">
                <User className="input-group-icon" />
                <Form.Item
                  name="emptyInput"
                  noStyle
                  rules={[{ required: true, message: "Enter different value" }]}
                >
                  <Input />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Select"
                className="input-group margin-bottom-20"
              >
                <Account className="input-group-icon" />
                <Form.Item
                  name="selectOptions"
                  noStyle
                  rules={[{ required: true, message: "Enter different value" }]}
                >
                  <SelectComponent>
                    {pageValues.selectOptions.map(item => (
                      <Option key={item}>{item}</Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Requestor (readonly Input)"
                className="input-group"
              >
                <CircledDollarSign className="input-group-icon-readonly" />
                <Form.Item name="name" noStyle>
                  <Input
                    readOnly
                    bordered={false}
                    className="input-group-readonly-input"
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Amount (readonly Input)"
                className="input-group"
              >
                <CircledDollarSign className="input-group-icon-readonly" />
                <Form.Item name="amount" noStyle>
                  <Input
                    readOnly
                    bordered={false}
                    className="input-group-readonly-input"
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Message from requestor (readonly Text Area)"
                className="input-group"
                {...colLayout}
              >
                <Message className="input-group-icon-readonly" />
                <Form.Item name="requesterMessage" noStyle>
                  <AntInput.TextArea
                    readOnly
                    autoSize
                    bordered={false}
                    className="input-group-readonly-text-area"
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Very long message (readonly Text Area)"
                className="input-group"
                {...colLayout}
              >
                <Message className="input-group-icon-readonly" />
                <Form.Item name="longMessage" noStyle>
                  <AntInput.TextArea
                    readOnly
                    autoSize
                    bordered={false}
                    className="input-group-readonly-text-area"
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item {...tailLayout} className="margin-top-20">
                <Button primary htmlType="submit">
                  Change Value
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default ReadOnlyStyle;
