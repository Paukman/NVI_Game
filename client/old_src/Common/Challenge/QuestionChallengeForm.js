/* eslint-disable no-console */
/* eslint-disable react/prop-types */

import React from "react";
import { Button, Input, Skeleton } from "StyleGuide/Components";
import { Row, Col, Form, Typography } from "antd";
import { Answer, Question } from "assets/icons";
import { authenticationErrors } from "utils/MessageCatalog";
import useQuestionChallenge from "./useQuestionChallenge";

const { Text } = Typography;

const QuestionChallengeForm = ({
  rsaHeaders,
  onSuccess = () => {},
  onFailure = () => {},
  onCancel = () => {},
  inApp = false
}) => {
  const { verifyAnswer, questionChallenge } = useQuestionChallenge({
    rsaHeaders,
    onSuccess,
    onFailure
  });
  const { loading, question, verifyingAnswer } = questionChallenge;

  const [form] = Form.useForm();

  const validateAnswer = async (_, answer) => {
    if (!answer) {
      return Promise.reject(authenticationErrors.MSG_RBAUTH_008);
    }
    const verified = await verifyAnswer(answer);
    if (!verified) {
      return Promise.reject(authenticationErrors.MSG_RBAUTH_011);
    }
    return null;
  };

  return (
    <Skeleton loading={loading} sizeMedium className="form-skeleton">
      <Row className="margin-bottom-8">
        <Col>
          <Text>
            For security purposes, please answer the following question:
          </Text>
        </Col>
      </Row>
      <Form style={{ textAlign: "left" }} layout="vertical" form={form}>
        <Form.Item
          label="Security question"
          htmlFor="securityQuestion"
          className="input-group-readonly"
        >
          <Question className="input-group-icon-readonly" />
          <Form.Item name="securityQuestion" noStyle>
            <Text>{question.challengeQuestion}</Text>
          </Form.Item>
        </Form.Item>
        <Form.Item
          label="Security answer"
          htmlFor="answer"
          className="input-group"
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
            <Input.Password
              autoFocus
              name="challengeAnswer"
              data-testid="challengeAnswer"
            />
          </Form.Item>
        </Form.Item>
        <Row gutter={[20, 25]} className="padding-top-20">
          <Col xs={24} sm={inApp ? 8 : 24}>
            <Button
              data-testid="question-challenge-form-submit"
              block
              primary
              htmlType="submit"
              loading={verifyingAnswer}
              unclickable={verifyingAnswer}
              id="challengeSubmit"
            >
              {verifyingAnswer ? null : "Submit"}
            </Button>
          </Col>
          {!inApp && (
            <Col xs={24}>
              <Button
                text
                block
                onClick={onCancel}
                unclickable={verifyingAnswer}
              >
                Cancel
              </Button>
            </Col>
          )}
        </Row>
      </Form>
    </Skeleton>
  );
};

export default QuestionChallengeForm;
