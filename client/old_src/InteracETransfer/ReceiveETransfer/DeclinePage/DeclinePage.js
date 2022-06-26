/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React from "react";
import { useHistory } from "react-router-dom";
import { Form, Row, Col, Typography, Input as AntInput } from "antd";
import PageHeader from "Common/PageHeader";
import { Button } from "StyleGuide/Components";
import {
  User,
  Message,
  CircledDollarSign,
  CheckMarkCircle30x30
} from "StyleGuide/Components/Icons";

const { Text } = Typography;
const { TextArea } = AntInput;

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

const DeclinePage = ({ form }) => {
  const history = useHistory();
  return (
    <Row>
      <Col xs={xsProp} sm={smProp} md={mdProp}>
        <PageHeader>Money declined</PageHeader>
        <Form
          name="declineForm"
          className="margin-top-20 max-width-600 form-bottom-space"
          layout="vertical"
          form={form}
          hideRequiredMark
        >
          <Form.Item className="input-group margin-bottom-22" {...colLayout}>
            <CheckMarkCircle30x30 className="input-group-icon-30-30" />
            <Form.Item name="notification_message" noStyle>
              <Text
                readOnly
                className="input-group-readonly-text-area font-size-16"
              >
                {`We will notify ${form.getFieldValue(
                  "senderName"
                )} that you've declined their `}
                <i>Interac</i>
                {` e-Transfer deposit.`}
              </Text>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="From"
            htmlFor="declineForm_senderName"
            className="input-group margin-bottom-6"
            {...colLayout}
          >
            <User className="input-group-icon-readonly" />
            <Form.Item name="senderName" noStyle>
              <TextArea
                readOnly
                autoSize
                bordered={false}
                className="input-group-readonly-text-area"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Amount"
            htmlFor="declineForm_amount"
            className="input-group margin-bottom-6"
            {...colLayout}
          >
            <CircledDollarSign className="input-group-icon-readonly" />
            <Form.Item name="amount" noStyle>
              <TextArea
                readOnly
                autoSize
                bordered={false}
                className="input-group-readonly-text-area"
              />
            </Form.Item>
          </Form.Item>

          {form.getFieldValue("beneficiaryMessage") && (
            <Form.Item
              label="Message to sender"
              htmlFor="declineForm_beneficiaryMessage"
              className="input-group margin-bottom-32"
              {...colLayout}
            >
              <Message className="input-group-icon-readonly" />
              <Form.Item name="beneficiaryMessage" noStyle>
                <TextArea
                  readOnly
                  autoSize
                  bordered={false}
                  className="input-group-readonly-text-area"
                />
              </Form.Item>
            </Form.Item>
          )}

          <Row gutter={50}>
            <Col xs={24} lg={10}>
              <Button
                secondary
                block
                onClick={() => {
                  history.push("/overview");
                }}
              >
                Go to Overview
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default DeclinePage;
