// default props will be depricated with the use of es6 defaults
/* eslint-disable react/require-default-props */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { Form, Row, Col, Typography, Select, Input as AntInput } from "antd";
import {
  Input,
  Button,
  Select as SelectComponent,
  TextAreaWithCounter
} from "StyleGuide/Components";
import {
  User,
  CircledDollarSign,
  Account,
  Message
} from "StyleGuide/Components/Icons";
import {
  requestETransferErrors,
  receiveETransferErrors
} from "utils/MessageCatalog";
import { ModalContext } from "Common/ModalProvider";
import PageHeader from "Common/PageHeader";
import { AccountSelectionContext } from "./AccountSelectionProvider";

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = AntInput;

const COUNT_400 = 400;

const ACCOUNT_RULES = [
  {
    required: true,
    message: requestETransferErrors.MSG_RBET_002
  }
];

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

const AccountSelectionForm = ({ handleOnDecline, form }) => {
  const [helperText, setHelperText] = useState("");

  const updateText = text => {
    setHelperText(text);
  };

  const {
    receiveEState,
    deposit,
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel
  } = useContext(AccountSelectionContext);
  const { depositing, declining } = deposit;

  const {
    receiveMoneyData,
    eligibleAccountsFormatted,
    amountFormatted
  } = receiveEState;
  const { senderName } = receiveMoneyData;
  const modal = useContext(ModalContext);
  const { showModal } = promptState;

  const onValuesChange = () => {
    blockLocation();
    blockClosingBrowser();
  };
  return (
    <>
      {modal.modalComponent({
        show: showModal,
        content: receiveETransferErrors.MSG_RBET_065(
          amountFormatted,
          senderName
        ),
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                modal.hide();
                onCancel();
              }}
            >
              Back
            </button>
            <button
              type="button"
              className="ui button basic"
              onClick={async () => {
                onCommit();
                modal.hide();
              }}
            >
              Confirm
            </button>
          </>
        )
      })}
      <Row>
        <Col xs={xsProp} sm={smProp} md={mdProp}>
          <PageHeader>Receive money</PageHeader>
          <Text>
            Select the account for the deposit, or you can choose to decline the{" "}
            <em>Interac</em> e-Transfer.
          </Text>
          <Form
            name="accountSelectionForm"
            className="margin-top-20 max-width-600 form-bottom-space"
            layout="vertical"
            form={form}
            initialValues={{
              senderName,
              amount: amountFormatted || "",
              toAccounts: "",
              beneficiaryMessage: null,
              count: `0/${COUNT_400}`
            }}
            hideRequiredMark
            onValuesChange={onValuesChange}
          >
            <Form.Item
              label="From"
              htmlFor="accountSelectionForm_senderName"
              className="input-group-readonly margin-bottom-6"
              {...colLayout}
            >
              <User className="input-group-icon-readonly" />
              <Form.Item name="senderName" noStyle>
                <Input
                  readOnly
                  bordered={false}
                  className="input-group-readonly-input"
                />
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="Amount"
              htmlFor="accountSelectionForm_amount"
              className="input-group-readonly margin-bottom-6"
              {...colLayout}
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
              label="Deposit into"
              htmlFor="accountSelectionForm_toAccounts"
              className="input-group padding-bottom-4"
              {...colLayout}
            >
              <Account className="input-group-icon" />
              <Form.Item name="toAccounts" noStyle rules={ACCOUNT_RULES}>
                <SelectComponent>
                  {eligibleAccountsFormatted.map(item => (
                    <Option key={item.key}>{item.text}</Option>
                  ))}
                </SelectComponent>
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="Message to sender (optional)"
              htmlFor="accountSelectionForm_beneficiaryMessage"
              className="input-group margin-bottom-32"
              help={helperText}
              {...colLayout}
            >
              <Message className="input-group-icon-text-area" />
              <Form.Item
                htmlFor="accountSelectionForm_count"
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

            <Row gutter={[20, 25]} className="padding-top-20">
              <Col xs={24} lg={8}>
                <Button primary block htmlType="submit" loading={depositing}>
                  {depositing ? null : "Deposit now"}
                </Button>
              </Col>
              <Col xs={24} lg={6}>
                <Button
                  secondary
                  block
                  onClick={handleOnDecline}
                  loading={declining}
                >
                  {declining ? null : "Decline"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AccountSelectionForm;
