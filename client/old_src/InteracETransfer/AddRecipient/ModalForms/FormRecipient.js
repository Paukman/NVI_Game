import React, { useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { Form, Row, Col } from "antd";
import { Person, Email } from "StyleGuide/Components/Icons";
import { Button, Input } from "StyleGuide/Components";
import { getEmailValidationTriggers, sanitizeEmail } from "utils";
import { AddRecipientContext } from "../AddRecipientProvider";
import {
  createValidateEmail,
  createValidateName,
  ADD_RECIPIENT_FORM,
  MAX_CHARS_RECIPIENT_NAME,
  MAX_CHARS_RECIPIENT_EMAIL
} from "../utils";

const FormRecipient = ({ form }) => {
  FormRecipient.propTypes = {
    form: PropTypes.shape({}).isRequired
  };
  const { addRecipient } = useContext(AddRecipientContext);
  const { state, updateHelperText, recipientList } = addRecipient;

  const handleEmailSanitize = useCallback(
    ({ type, key, target: { value } }) => {
      if (type === "keydown" && key !== "Enter") return;
      form.setFieldsValue({
        recipientEmail: sanitizeEmail(value)
      });
    },
    [form]
  );

  return (
    <Form
      name={ADD_RECIPIENT_FORM}
      layout="vertical"
      form={form}
      onValuesChange={changedValue => {
        updateHelperText(changedValue);
      }}
    >
      <Form.Item
        label="Recipient name"
        className="input-group-modal"
        htmlFor={`${ADD_RECIPIENT_FORM}_recipientName`}
        help={state.recipientNameHelpMessage}
      >
        <Person className="input-group-icon-modal" />
        <Form.Item
          name="recipientName"
          noStyle
          rules={[{ validator: createValidateName(recipientList) }]}
        >
          <Input size="large" maxLength={MAX_CHARS_RECIPIENT_NAME} />
        </Form.Item>
      </Form.Item>
      <Form.Item
        label="Recipient email"
        className="input-group-modal"
        htmlFor={`${ADD_RECIPIENT_FORM}_recipientEmail`}
        help={state.recipientEmailHelpMessage}
      >
        <Email className="input-group-icon-modal" />
        <Form.Item
          name="recipientEmail"
          noStyle
          rules={[{ validator: createValidateEmail(recipientList) }]}
          validateTrigger={getEmailValidationTriggers(form, "recipientEmail")}
        >
          <Input
            size="large"
            maxLength={MAX_CHARS_RECIPIENT_EMAIL}
            onBlur={handleEmailSanitize}
            onKeyDown={handleEmailSanitize}
          />
        </Form.Item>
      </Form.Item>
      <Row className="ant-modal-footer-row">
        <Col xs={24} sm={6}>
          <Button
            block
            primary
            htmlType="submit"
            loading={state.loadingCheckAutodeposit}
          >
            {state.loadingCheckAutodeposit ? null : "Next"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default FormRecipient;
