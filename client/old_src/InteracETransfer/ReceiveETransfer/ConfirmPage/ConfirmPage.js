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
  Account,
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

const ConfirmPage = ({ form, handleViewAccountDetails }) => {
  const history = useHistory();

  return (
    <Row>
      <Col xs={xsProp} sm={smProp} md={mdProp}>
        <PageHeader>Money accepted</PageHeader>
        <Form
          name="confirmForm"
          className="margin-top-20 max-width-600 form-bottom-space"
          layout="vertical"
          hideRequiredMark
          form={form}
        >
          <Form.Item className="input-group margin-bottom-22" {...colLayout}>
            <CheckMarkCircle30x30 className="input-group-icon-30-30" />
            <Form.Item name="notification_message" noStyle>
              <Text
                readOnly
                className="input-group-readonly-text-area font-size-14"
              >
                {`We will notify ${form.getFieldValue(
                  "senderName"
                )} that you've accepted their `}
                <i>Interac</i>
                {` e-Transfer deposit.`}
              </Text>
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="From"
            htmlFor="confirmForm_senderName"
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
            htmlFor="confirmForm_amount"
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

          <Form.Item
            label="Deposited into"
            htmlFor="confirmForm_toAccount"
            className="input-group margin-bottom-6"
            {...colLayout}
          >
            <Account className="input-group-icon-readonly" />
            <Form.Item name="toAccount" noStyle>
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
              htmlFor="beneficiaryMessage"
              className="input-group margin-bottom-30"
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

          <Text className="font-size-14">
            {`When you register for Autodeposit, funds sent by `}
            <i>Interac</i>
            {` e-Transfer will be securely deposited directly to your account, without having to answer a security question.`}
          </Text>

          <Row gutter={[16, 16]}>
            <div style={{ paddingBottom: "20px" }} />
          </Row>

          <Row gutter={[20, 25]}>
            <Col xs={24} lg={12}>
              <Button
                secondary
                block
                onClick={() => {
                  history.push(
                    "/more/interac-preferences/autodeposit/register-rule"
                  );
                }}
              >
                Register for Autodeposit
              </Button>
            </Col>
            <Col xs={24} lg={8}>
              <Button
                text
                block
                onClick={() => {
                  handleViewAccountDetails();
                }}
              >
                View account
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
};

export default ConfirmPage;
