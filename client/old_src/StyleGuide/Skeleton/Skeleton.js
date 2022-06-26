/* eslint-disable no-console */
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Typography,
  Select,
  Switch,
  Divider,
  Radio
} from "antd";

import SkeletonComponent from "../Components/Skeleton";
import { User, Account, CircledDollarSign } from "../Components/Icons";
import { Input, Select as SelectComponent } from "../Components";

const { Title } = Typography;
const { Option } = Select;

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

const SkeletonStyle = () => {
  const [form] = Form.useForm();

  const [showloading, setShowloading] = useState(true);
  const [formSize, setFormSize] = React.useState("default");

  const onChange = e => {
    setFormSize(e.target.value);
  };

  const getSkeleton = () => {
    return (
      <Card>
        <Row className="title-row margin-top-4">
          <Col xs={xsProp} sm={smProp} md={mdProp}>
            <Title level={3}>No h3 with css last row button</Title>
            <Divider className="light margin-bottom-30" />
            <Form layout="vertical" form={form}>
              <SkeletonComponent
                active
                loading={showloading}
                round
                sizeLarge={formSize === "lg"}
                sizeMedium={formSize === "md"}
                sizeSmall={formSize === "sm"}
                className="form-skeleton"
              >
                <Form.Item
                  label="Title Input 1"
                  className="input-group margin-bottom-20"
                >
                  <User className="input-group-icon" />
                  <Form.Item name="emptyInput" noStyle>
                    <Input />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label="Title Input 2"
                  className="input-group margin-bottom-20"
                >
                  <Account className="input-group-icon" />
                  <Form.Item name="emptyInput" noStyle>
                    <Input />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label="Title Input 3"
                  className="input-group margin-bottom-20"
                >
                  <CircledDollarSign className="input-group-icon" />
                  <Form.Item name="emptyInput" noStyle>
                    <Input />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label="Title Input 4"
                  className="input-group margin-bottom-20"
                >
                  <Account className="input-group-icon" />
                  <Form.Item name="emptyInput" noStyle>
                    <SelectComponent>
                      <Option key="one">One</Option>
                      <Option key="two">Two</Option>
                      <Option key="three">Three</Option>
                    </SelectComponent>
                  </Form.Item>
                </Form.Item>
              </SkeletonComponent>
            </Form>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <>
      <Card>
        <Form layout="horizontal" form={form}>
          <Form.Item className="margin-bottom-20" label="Show skeleton:">
            <Switch
              checked={!showloading}
              onChange={checked => {
                setShowloading(!checked);
              }}
            />
          </Form.Item>
          <Form.Item className="margin-bottom-20" label="Show skeleton:">
            <Radio.Group onChange={onChange} value={formSize}>
              <Radio value="default">Default</Radio>
              <Radio value="lg">Large</Radio>
              <Radio value="md">Medium</Radio>
              <Radio value="sm">Small</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
        {getSkeleton()}
      </Card>
    </>
  );
};

export default SkeletonStyle;
