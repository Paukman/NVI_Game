/* eslint-disable no-console */
import React from "react";
import { Row, Col, Card, Form, Typography, Checkbox, Space } from "antd";

import { Account, Calculator } from "../Components/Icons";
import { Button } from "../Components";
import "./styles.less";

const { Title } = Typography;

const tailLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 7 },
    lg: { span: 5 }
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

const Checkboxes = () => {
  const [form] = Form.useForm();
  const onFinish = async values => {
    console.log(values);
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
                basicDefault: false,
                basicActive: true,
                basicError: false,
                basicDisabled: false,
                basicDisabledTrue: true,
                basicSemilongText: false,
                basicLongText: false,
                basicAgreement: false,
                noAnimation: false,
                animation: false,
                withIconShort: false,
                withIconLong: false
              }}
            >
              <Space direction="vertical">
                <Title level={5}>Default</Title>
              </Space>
              <Form.Item
                className="margin-top-20 checkbox-tap-height"
                name="basicDefault"
                valuePropName="checked"
              >
                <Checkbox>Default</Checkbox>
              </Form.Item>

              <Form.Item
                name="basicActive"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox>Active by default</Checkbox>
              </Form.Item>

              <Form.Item
                name="basicError"
                valuePropName="checked"
                className="checkbox-tap-height"
                rules={[
                  {
                    required: true,
                    transform: value => value || undefined,
                    type: "boolean",
                    message: "Please check the box"
                  }
                ]}
              >
                <Checkbox>With Error</Checkbox>
              </Form.Item>

              <Form.Item
                name="basicDisabled"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox disabled>Disabled</Checkbox>
              </Form.Item>

              <Form.Item
                name="basicDisabledTrue"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox disabled>Disabled checked</Checkbox>
              </Form.Item>

              <Form.Item
                name="basicSemilongText"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox className="max-width-600">
                  Semi long line, semi long line, semi long line, semi long
                  line, semi long line, semi long line..
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="basicLongText"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox className="max-width-600">
                  Very long line, very long line, very long line, very long
                  line, very long line, very long line, very long line, very
                  long line, very long line.
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="basicAgreement"
                valuePropName="checked"
                className="checkbox-tap-height"
                rules={[
                  {
                    required: true,
                    transform: value => value || undefined,
                    type: "boolean",
                    message: "Please agree the terms and conditions."
                  }
                ]}
              >
                <Checkbox>
                  I have read and agree to the terms and Conditions.
                </Checkbox>
              </Form.Item>

              <Space direction="vertical" className="margin-top-10">
                <Title level={5}>Animation</Title>
              </Space>
              <Form.Item
                className="margin-top-20 checkbox-tap-height"
                name="noAnimation"
                valuePropName="checked"
              >
                <Checkbox>Without animation</Checkbox>
              </Form.Item>

              <Form.Item
                name="animation"
                valuePropName="checked"
                className="checkbox-tap-height"
              >
                <Checkbox className="animation">
                  With Animation (do NOT use just for demo)
                </Checkbox>
              </Form.Item>

              <Space className="margin-top-10" direction="vertical">
                <Title level={5}>With Icons</Title>
              </Space>
              <Form.Item
                className="checkbox-group margin-top-20"
                name="withIconShort"
                valuePropName="checked"
              >
                <Account className="checkbox-group-icon" />
                <Form.Item name="name" noStyle>
                  <Checkbox>Short text</Checkbox>
                </Form.Item>
              </Form.Item>
              <Form.Item
                className="checkbox-group"
                name="withIconLong"
                valuePropName="checked"
              >
                <Calculator className="checkbox-group-icon" />
                <Form.Item name="name" noStyle>
                  <Checkbox>
                    Modesto tamen et circumspecto iudicio de tantis viris
                    pronuntiandum est, ne, quod plerisque accidit, damnent quae
                    non intellegunt
                  </Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item {...tailLayout} className="margin-top-20">
                <Button primary htmlType="submit">
                  Collect Values
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default Checkboxes;
