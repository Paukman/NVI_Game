import React from "react";
import PropTypes from "prop-types";
import { Input, Button, DynamicButton } from "StyleGuide/Components";
import { Form, Typography } from "antd";
import { mfaSecurityMessages } from "utils/MessageCatalog";
import success from "StyleGuide/ant-styles/icons/outlined/check-circle-success-color.svg";
import useCode from "./useCode";
import ChallengeSystemError from "../ChallengeSystemError";

const { Paragraph } = Typography;

const isSixDigits = code => /^\d{6}$/.test(code);

const validateCode = async (_, code) => {
  if (!isSixDigits(code)) {
    throw Error(mfaSecurityMessages.MSG_RB_AUTH_040);
  }
};

const EnterCodeForm = ({
  rsaHeaders,
  changeMethod = () => {},
  onCancel = () => {},
  onFailure = () => {},
  onSuccess = () => {},
  phone,
  method,
  inApp = false
}) => {
  EnterCodeForm.propTypes = {
    rsaHeaders: PropTypes.shape({}).isRequired,
    phone: PropTypes.shape({
      default: PropTypes.bool.isRequired,
      defaultChallengeType: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      registeredForIvr: PropTypes.bool.isRequired,
      registeredForSms: PropTypes.bool.isRequired
    }).isRequired,
    method: PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      msg: PropTypes.string.isRequired
    }).isRequired,
    inApp: PropTypes.bool,
    changeMethod: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func
  };

  const {
    sendCode,
    sendingCode,
    verifyCode,
    verifyingCode,
    codeError
  } = useCode({
    rsaHeaders,
    onFailure,
    onCancel,
    onSuccess,
    inApp
  });
  const [form] = Form.useForm();

  const setCodeFieldErrors = (...errors) => {
    form.setFields([{ name: "code", errors }]);
  };

  const handleOnFinish = async values => {
    await verifyCode(values, setCodeFieldErrors);
  };

  return (
    <>
      <ChallengeSystemError inApp={inApp}>{codeError}</ChallengeSystemError>
      <Form
        style={{ textAlign: "left" }}
        layout="vertical"
        onFinish={handleOnFinish}
        form={form}
        className="rebank-form sms-form"
        validateTrigger={["onBlur", "onSubmit"]}
      >
        <Form.Item
          label="Enter your six-digit code"
          name="code"
          rules={[{ validator: validateCode }]}
          className={inApp ? "fixed-width" : ""}
        >
          <Input autoFocus />
        </Form.Item>

        {inApp && !sendingCode && !codeError && (
          <Paragraph className="font-size-12 padding-top-12">
            <img src={success} alt="success" className="success-img" />
            {mfaSecurityMessages.MSG_RB_AUTH_038(phone.name, method.msg)}
          </Paragraph>
        )}

        <Paragraph className="font-size-12 padding-top-20">
          Didn&apos;t get the code?
        </Paragraph>

        <Form.Item className="margin-top-4 margin-bottom-2">
          <Button
            link
            data-testid="sendNewCode"
            loading={sendingCode}
            onClick={() => {
              sendCode(phone, method);
              setCodeFieldErrors();
            }}
            className="enter-code-btn"
          >
            Send new code
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            link
            data-testid="changeContact"
            onClick={changeMethod}
            className="enter-code-btn"
          >
            Change contact method
          </Button>
        </Form.Item>

        <DynamicButton
          primary
          block={!inApp}
          blockBreakpoint="xs"
          htmlType="submit"
          loading={verifyingCode}
          id="submitESCode"
        >
          Submit code
        </DynamicButton>

        {!inApp && (
          <Form.Item className="margin-top-20">
            <Button block text onClick={() => onCancel({ confirm: true })}>
              Cancel
            </Button>
          </Form.Item>
        )}
      </Form>
    </>
  );
};

export default EnterCodeForm;
