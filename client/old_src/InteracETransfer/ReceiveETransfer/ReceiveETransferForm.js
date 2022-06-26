/* eslint-disable consistent-return */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useContext } from "react";
import { Form, Typography, Row, Col, Input as AntInput } from "antd";

import { Button, Input, Skeleton } from "StyleGuide/Components";
import { PromptContext } from "Common/PromptProvider";
import { Answer, Question } from "assets/icons";
import { User, Message } from "StyleGuide/Components/Icons";
import { receiveETransferErrors } from "utils/MessageCatalog";
import { ModalContext } from "Common/ModalProvider";
import PageHeader from "Common/PageHeader";
import { ReceiveETransferContext } from "./ReceiveETransferProvider";

const { Text } = Typography;

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

const submitProps = {
  wrapperCol: {
    xs: { span: 24 },
    md: { span: 6 }
  }
};

const initialFormValues = requestData => ({
  senderName: requestData?.senderName || "",
  senderMessage: requestData?.beneficiaryMessage || "",
  securityQuestion: requestData?.eTransferSecurity?.question || ""
});

const ReceiveETransferForm = () => {
  const { receiveETransfer, userProfile } = useContext(ReceiveETransferContext);
  const { profile } = userProfile;
  const { receiveEState, authenticateTransfer } = receiveETransfer;
  const { receiveMoneyData, saving, amountFormatted } = receiveEState;
  const {
    blockLocation,
    blockClosingBrowser,
    onCommit,
    promptState,
    onCancel
  } = useContext(PromptContext);
  const modal = useContext(ModalContext);
  const { showModal } = promptState;

  const isLoading = profile.loading || !receiveMoneyData;

  const [form] = Form.useForm();

  const validateAnswer = async (_, answer) => {
    if (!answer) {
      return Promise.reject(receiveETransferErrors.MSG_RBET_017Bs);
    }
    const res = await authenticateTransfer(answer);
    if (res) {
      return Promise.reject(res.error);
    }
    // Unblock to allow page navigation
    onCommit();
  };

  const onValuesChange = () => {
    blockLocation();
    blockClosingBrowser();
  };

  const renderCancelModal = () =>
    modal.modalComponent({
      show: showModal,
      content: receiveETransferErrors.MSG_RBET_065(
        amountFormatted,
        receiveMoneyData.senderName
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
    });

  return (
    <>
      {receiveMoneyData?.senderName && renderCancelModal()}
      <Row className="title-row">
        <Col xs={xsProp} sm={smProp} md={mdProp}>
          <PageHeader loading={isLoading}>Receive money</PageHeader>
          <Skeleton
            sizeMedium
            loading={isLoading}
            className="form-skeleton margin-top-20 form-bottom-space"
            data-testid="receive-etransfer-skeleton"
          >
            <Text data-testid="receive-label">
              To accept or decline this <em>Interac</em> e-Transfer, answer the
              following security question:
            </Text>
            <Form
              className="margin-top-20 max-width-600 form-bottom-space"
              layout="vertical"
              form={form}
              hideRequiredMark
              initialValues={initialFormValues(receiveMoneyData)}
              onValuesChange={onValuesChange}
            >
              {receiveMoneyData?.senderName && (
                <Form.Item
                  label="From"
                  htmlFor="senderName"
                  className="input-group margin-top-26 margin-bottom-8"
                >
                  <User className="input-group-icon-readonly" />
                  <Form.Item name="senderName" noStyle>
                    <Input
                      readOnly
                      bordered={false}
                      className="input-group-readonly-input"
                      data-testid="senderName"
                    />
                  </Form.Item>
                </Form.Item>
              )}
              {receiveMoneyData?.beneficiaryMessage && (
                <Form.Item
                  htmlFor="senderMessage"
                  label="Message from sender"
                  className="input-group margin-bottom-8"
                >
                  <Message className="input-group-icon-readonly" />
                  <Form.Item name="senderMessage" noStyle>
                    <AntInput.TextArea
                      readOnly
                      autoSize
                      bordered={false}
                      className="input-group-readonly-text-area"
                      data-testid="senderMessage"
                    />
                  </Form.Item>
                </Form.Item>
              )}
              {receiveMoneyData?.eTransferSecurity?.question && (
                <>
                  <Form.Item
                    htmlFor="securityQuestion"
                    label="Security question"
                    className="input-group margin-bottom-8"
                  >
                    <Question className="input-group-icon-readonly" />
                    <Form.Item name="securityQuestion" noStyle>
                      <Input
                        readOnly
                        bordered={false}
                        className="input-group-readonly-input"
                        data-testid="securityQuestion"
                      />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item
                    htmlFor="answer"
                    label="Security answer"
                    className="input-group padding-bottom-24"
                  >
                    <Answer className="input-group-icon" />
                    <Form.Item
                      name="answer"
                      noStyle
                      rules={[
                        {
                          required: true,
                          validator: validateAnswer,
                          validateTrigger: ["onFinish"]
                        }
                      ]}
                    >
                      <Input data-testid="securityAnswer" autoComplete="off" />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item {...submitProps}>
                    <Button primary block htmlType="submit" loading={saving}>
                      {saving ? null : "Submit"}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Skeleton>
        </Col>
      </Row>
    </>
  );
};
export default ReceiveETransferForm;
