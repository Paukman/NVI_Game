import React, { useContext } from "react";
import { Form, Row, Col, Typography } from "antd";
import answerIcon from "assets/icons/Answer/answer.svg";
import questionIcon from "assets/icons/Question/question.svg";
import { Button, Input } from "StyleGuide/Components";
import { manageContactMessage } from "utils/MessageCatalog";

import { AddRecipientContext } from "../AddRecipientProvider";

import {
  EDIT_SECURITY_QUESTION_FORM,
  validateAnswer,
  validateQuestion,
  validateSameAnswerAndQuestion,
  MAX_CHARS_QUESTION,
  MAX_CHARS_ANSWER
} from "../utils";

const { Text } = Typography;

const FormEditSecurityQuestionAnswer = () => {
  const { editSecurityQuestionAnswer } = useContext(AddRecipientContext);
  const { state, updateHelperText, onFinish } = editSecurityQuestionAnswer;

  const [form] = Form.useForm();

  return (
    <>
      <Form
        name={EDIT_SECURITY_QUESTION_FORM}
        layout="vertical"
        onFinish={onFinish}
        form={form}
        onValuesChange={changedValue => {
          updateHelperText(changedValue);
        }}
      >
        <Text className="font-size-14">
          {manageContactMessage.MSG_RBET_060B}
        </Text>
        <Form.Item
          label="Security question"
          className="input-group-modal margin-top-20"
          htmlFor={`${EDIT_SECURITY_QUESTION_FORM}_securityQuestion`}
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
          htmlFor={`${EDIT_SECURITY_QUESTION_FORM}_securityAnswer`}
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
        <Row className="ant-modal-footer-row">
          <Col xs={24} sm={6}>
            <Button
              primary
              block
              htmlType="submit"
              loading={state.loadingEditSecurityQuestion}
            >
              {state.loadingEditSecurityQuestion ? null : "Save"}
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormEditSecurityQuestionAnswer;
