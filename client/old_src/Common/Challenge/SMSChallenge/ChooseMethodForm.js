import React from "react";
import PropTypes from "prop-types";
import { Input, Button, DynamicButton } from "StyleGuide/Components";
import { Form, Radio, Typography } from "antd";
import useCode from "./useCode";
import ChallengeSystemError from "../ChallengeSystemError";

const { Paragraph } = Typography;

const methods = [
  {
    value: "SMS",
    label: "SMS text message",
    type: "SMSAuthentication",
    msg: "text message"
  },
  {
    value: "PhoneCall",
    label: "Automated phone call",
    type: "PhonePadAuthentication",
    msg: "phone call"
  }
];

const ChooseMethodForm = ({
  rsaHeaders,
  phone,
  phoneError,
  setSelectedMethod = () => {},
  onSuccess = () => {},
  onCancel = () => {},
  inApp = false,
  fetchPhones
}) => {
  ChooseMethodForm.propTypes = {
    rsaHeaders: PropTypes.shape({}).isRequired,
    phone: PropTypes.shape({
      default: PropTypes.bool.isRequired,
      defaultChallengeType: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      registeredForIvr: PropTypes.bool.isRequired,
      registeredForSms: PropTypes.bool.isRequired
    }),
    phoneError: PropTypes.string,
    inApp: PropTypes.bool,
    setSelectedMethod: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    fetchPhones: PropTypes.func.isRequired
  };

  const { sendCode, sendingCode, codeError } = useCode({
    rsaHeaders,
    inApp
  });
  const [form] = Form.useForm();

  const defaultMethod =
    methods.find(m => m.type === phone?.defaultChallengeType) || methods[0];

  const onFinish = async ({ sendCodeVia }) => {
    const currentMethod =
      methods.find(method => method.value === sendCodeVia) || defaultMethod;
    setSelectedMethod(currentMethod);
    if (await sendCode(phone, currentMethod)) {
      onSuccess();
    }
  };

  return (
    <>
      <ChallengeSystemError inApp={inApp}>{codeError}</ChallengeSystemError>
      <Paragraph className="text-align-left margin-bottom-18">
        To verify your identity, we&apos;ll send you a six-digit passcode to
        your mobile device.
      </Paragraph>
      <ChallengeSystemError handleClick={fetchPhones} inApp={inApp}>
        {phoneError}
      </ChallengeSystemError>

      {!phoneError && phone && (
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            sendCodeVia: defaultMethod.value,
            number: phone.number,
            name: phone.name
          }}
          onFinish={onFinish}
          className="rebank-form sms-form"
        >
          <Form.Item label="Mobile device number" name="number">
            <Input staticInput className={inApp ? "fixed-width" : ""} />
          </Form.Item>

          <Form.Item label="Device name" name="name">
            <Input staticInput className={inApp ? "fixed-width" : ""} />
          </Form.Item>

          <Form.Item label="Send code via" name="sendCodeVia">
            <Radio.Group
              options={methods}
              onChange={m => {
                setSelectedMethod(m.target);
              }}
            />
          </Form.Item>

          <DynamicButton
            primary
            block={!inApp}
            blockBreakpoint="xs"
            htmlType="submit"
            loading={sendingCode}
            id="esSendCode"
          >
            Send code
          </DynamicButton>

          {!inApp && (
            <Form.Item className="margin-top-20">
              <Button block text onClick={() => onCancel({ confirm: true })}>
                Cancel
              </Button>
            </Form.Item>
          )}
        </Form>
      )}
    </>
  );
};

export default ChooseMethodForm;
