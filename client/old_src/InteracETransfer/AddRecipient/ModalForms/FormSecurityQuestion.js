import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Form, Checkbox, Row, Col } from "antd";
import answerIcon from "assets/icons/Answer/answer.svg";
import questionIcon from "assets/icons/Question/question.svg";
import { Button, Input } from "StyleGuide/Components";

import { AddRecipientContext } from "../AddRecipientProvider";

import {
  SECURITY_QUESTION_FORM,
  validateAnswer,
  validateQuestion,
  validateSameAnswerAndQuestion,
  MAX_CHARS_QUESTION,
  MAX_CHARS_ANSWER
} from "../utils";

const FormSecurityQuestion = ({ form }) => {
  FormSecurityQuestion.propTypes = {
    form: PropTypes.shape({}).isRequired
  };

  const { addRecipient } = useContext(AddRecipientContext);
  const { state, updateHelperText } = addRecipient;

  return (
    <>
      <Form
        name={SECURITY_QUESTION_FORM}
        layout="vertical"
        form={form}
        initialValues={{
          saveRecipient: true
        }}
        onValuesChange={changedValue => {
          updateHelperText(changedValue);
        }}
      >
        <Form.Item
          label="Security question"
          className="input-group-modal"
          htmlFor={`${SECURITY_QUESTION_FORM}_securityQuestion`}
          help={state.questionHelpMessage}
        >
          <img
            src={questionIcon}
            alt="Security question"
            className="input-group-icon-modal"
          />
          <Form.Item
            name="securityQuestion"
            noStyle
            rules={[{ validator: validateQuestion }]}
          >
            <Input size="large" maxLength={MAX_CHARS_QUESTION} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Security answer"
          className="input-group-modal"
          htmlFor={`${SECURITY_QUESTION_FORM}_securityAnswer`}
          help={state.answerHelpMessage}
        >
          <img
            src={answerIcon}
            alt="Security answer"
            className="input-group-icon-modal"
          />
          <Form.Item
            name="securityAnswer"
            noStyle
            rules={[
              { validator: validateAnswer },
              ({ getFieldValue }) =>
                validateSameAnswerAndQuestion(getFieldValue)
            ]}
            validateTrigger={["onBlur", "onSubmit"]}
          >
            <Input size="large" maxLength={MAX_CHARS_ANSWER} />
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="saveRecipient"
          valuePropName="checked"
          className="checkbox-tap-height"
        >
          <Checkbox className="margin-top-20">
            Save recipient to contacts
          </Checkbox>
        </Form.Item>
        <Row>
          <Col xs={24} sm={10}>
            <Button
              primary
              block
              htmlType="submit"
              loading={state.loadingAddRecipient}
            >
              {state.loadingAddRecipient ? null : "Add recipient"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default FormSecurityQuestion;
