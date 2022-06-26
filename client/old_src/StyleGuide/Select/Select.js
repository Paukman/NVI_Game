/* eslint-disable no-console */
import React from "react";
import { Row, Col, Card, Form, Typography, Select, Divider, Space } from "antd";
import { SnippetsOutlined } from "@ant-design/icons";
import { requestETransferErrors } from "utils/MessageCatalog";
import { Account as AccountIcon } from "../Components/Icons";
import { Select as SelectComponent, Button } from "../Components";
import useLoadData from "./useLoadData";
import SearchBox from "../Components/Select/SearchBox";

const { Link, Text } = Typography;
const { Option } = Select;

const ACCOUNT_RULES = [
  {
    required: true,
    message: requestETransferErrors.MSG_RBET_002
  }
];

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

const options = [
  {
    value:
      "No-Fee All-In Account and all the extra spaces I can think off (7679) - $89,499.46"
  },
  { value: "Springboard Savings Account (1479) - $39,593.01" },
  { value: "Simple" }
];

// This is a preffered ways to list data.
// using simple array force you to create keys on fly but its not applicable
// to anything beyound simple text (like objects bellow)
const optionsWithDisabledItems = [
  {
    value: "Gazilion dollars $100000000000"
  },
  { value: "No-Fee All-In Account (7679) - $89,499.46" },
  {
    value: (
      <Divider style={{ paddingLeft: "0px" }}>Ineligible accounts</Divider>
    ),
    key: "Divider1",
    disabled: true
  },
  {
    value: "Springboard Savings Account (1479) - $39,593.01",
    disabled: true
  },
  { value: "Simple", disabled: true }
];

const optionsWithLink = [
  {
    value: (
      <Link className="not-selectable" target="_blank">
        Add payee
      </Link>
    ),
    key: "AddPayee"
  },
  { value: "No-Fee All-In Account (7679) - $89,499.46" },
  { value: "Springboard Savings Account (1479) - $39,593.01" },
  { value: "Simple" }
];

const optionsArray = ["Account1 | $100,000,000.99", "Account2 | $11.00"];
const optionsArray2 = [
  "No-Fee All-In Account (7679) - $89,499.46",
  "Springboard Savings Account (1479) - $39,593.01",
  "Account1 | $10.00",
  "Account2 | $11.00",
  "Account3 | $14.00",
  "Account4 | $101.00",
  "Account5 | $102.00",
  "Account6 | $10.00",
  "Account7 | $101.00",
  "Account8 | $145.00"
];
const optionsArray3 = [
  "No-Fee All-In Account (2000) - $89,499.46",
  "Springboard Savings Account (2000) - $39,593.01",
  "My Account"
];

const SelectStyle = () => {
  const [form] = Form.useForm();
  const { creditorsState } = useLoadData();
  const onFinish = async values => {
    console.log(values);
  };

  return (
    <>
      <Card>
        <Row className="padding-top-10">
          <Col xs={xsProp} sm={smProp} md={mdProp}>
            <Form
              name="selectionForm"
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                basicDefaultValue: optionsArray[1]
              }}
            >
              <Card>
                <Text level={4}>Search Box</Text>
                <Space direction="vertical" />
                <Form.Item
                  className="margin-bottom-10"
                  name="searchBox"
                  label="Enter payee"
                >
                  <SearchBox data={creditorsState.data} />
                </Form.Item>

                <Form.Item
                  label="Enter payee"
                  htmlFor="selectionForm_searchBoxWithIcon"
                  className="input-group"
                >
                  <AccountIcon className="input-group-icon-select" />
                  <Form.Item name="searchBoxWithIcon" noStyle>
                    <SearchBox data={creditorsState.data} />
                  </Form.Item>
                </Form.Item>
              </Card>

              <Form.Item
                className="margin-bottom-10"
                name="basicDefault"
                label="Basic"
              >
                <SelectComponent options={options} showSearch={false} />
              </Form.Item>

              <Form.Item
                className="margin-bottom-10"
                name="basicDefaultValue"
                label="Basic with default value"
              >
                <SelectComponent options={options} showSearch={false} />
              </Form.Item>

              <Form.Item
                className="margin-bottom-10"
                name="searchDefault"
                label="Basic search"
              >
                <SelectComponent>
                  {optionsArray.map(item => (
                    <Option key={`${item}1`}>{item}</Option>
                  ))}
                </SelectComponent>
              </Form.Item>

              <Form.Item
                label="With rules"
                htmlFor="selectionForm_withIcon"
                className="input-group"
              >
                <AccountIcon className="input-group-icon-select" />
                <Form.Item name="withIcon" noStyle rules={ACCOUNT_RULES}>
                  <SelectComponent>
                    {optionsArray2.map(item => (
                      <Option key={`${item}2`}>{item}</Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="With ant icon"
                htmlFor="selectionForm_withAntIcon"
                className="input-group"
              >
                <SnippetsOutlined
                  className="input-group-icon-select"
                  style={{ fontSize: "24px" }}
                />
                <Form.Item name="withAntIcon" noStyle>
                  <SelectComponent>
                    {optionsArray3.map(item => (
                      <Option key={`${item}3`}>{item}</Option>
                    ))}
                  </SelectComponent>
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="With link"
                htmlFor="selectionForm_withSearchOptions"
                className="input-group"
              >
                <AccountIcon className="input-group-icon-select" />
                <Form.Item name="withSearchOptions" noStyle>
                  <SelectComponent options={optionsWithLink} />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="Empty content"
                htmlFor="selectionForm_noContent"
                className="input-group"
              >
                <SnippetsOutlined
                  className="input-group-icon-select"
                  style={{ fontSize: "24px" }}
                />
                <Form.Item name="noContent" noStyle>
                  <SelectComponent defaultOpen />
                </Form.Item>
              </Form.Item>

              <Form.Item
                label="With options"
                htmlFor="selectionForm_withOptions"
                className="input-group"
              >
                <SnippetsOutlined
                  className="input-group-icon-select"
                  style={{ fontSize: "24px" }}
                />
                <Form.Item name="withOptions" noStyle>
                  <SelectComponent
                    options={optionsWithDisabledItems}
                    optionGroup
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item {...tailLayout} className="margin-top-20">
                <Button primary htmlType="submit">
                  Collect Values
                </Button>
              </Form.Item>

              <Row>
                <div style={{ paddingBottom: "600px" }} />
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default SelectStyle;
