import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { Form, Row, Col, Modal } from "antd";
import { Input, Button } from "StyleGuide/Components";
import { Answer, Question } from "assets/icons";

import questionIcon from "assets/icons/Question/question.svg";
import answerIcon from "assets/icons/Answer/answer.svg";
import cross from "assets/icons/Cross/cross.svg";

import { manageContactMessage } from "utils/MessageCatalog";
import {
  validationEmptyQuestion,
  validationRulesQuestion,
  validationQandA,
  validationRulesAnswer,
  getFieldToUpdateAndMessage
} from "ManageContacts/utils";

import MaskedQuestion from "./MaskedQuestion/MaskedQuestion";

const SecurityQuestions = props => {
  SecurityQuestions.propTypes = {
    id: PropTypes.string.isRequired,
    showQuestions: PropTypes.bool,
    showSecurity: PropTypes.bool.isRequired,
    securityQuestion: PropTypes.string.isRequired,
    selectedRecipient: PropTypes.shape({}),
    handleUpdateRecipient: PropTypes.func.isRequired,
    isPosting: PropTypes.bool.isRequired,
    isQuestionExpired: PropTypes.bool.isRequired,
    setIsQuestionExpired: PropTypes.func.isRequired
  };
  SecurityQuestions.defaultProps = {
    selectedRecipient: {}
  };

  const {
    id,
    showQuestions,
    showSecurity,
    securityQuestion,
    selectedRecipient,
    handleUpdateRecipient,
    isPosting,
    isQuestionExpired,
    setIsQuestionExpired
  } = props;

  const [form] = Form.useForm();

  const [showEditModal, setShowEditModal] = useState(false);
  const [securityFormState, setSecurityFormState] = useState({
    questionHelpMessage: null,
    answerHelpMessage: null
  });

  const setModalForm = showModal => {
    form.setFieldsValue({
      question: securityQuestion || "",
      answer: ""
    });
    setShowEditModal(showModal);
  };

  useEffect(() => {
    setModalForm(isQuestionExpired);
  }, [isQuestionExpired]);

  const initialFormValues = () => {
    return {
      question: securityQuestion || "",
      answer: ""
    };
  };

  const updateHelperText = changedValue => {
    const fieldsToUpdate = getFieldToUpdateAndMessage(changedValue);
    const newState = { ...securityFormState };
    if (fieldsToUpdate) {
      newState[fieldsToUpdate.field] = fieldsToUpdate.message;
    }
    setSecurityFormState(newState);
  };

  const validateQuestion = async (_, question) => {
    if (!validationEmptyQuestion(question)) {
      return Promise.reject(manageContactMessage.MSG_RBET_028);
    }

    if (!validationRulesQuestion(question)) {
      return Promise.reject(manageContactMessage.MSG_RBET_005B);
    }

    return Promise.resolve();
  };

  const validateAnswer = async (_, answer) => {
    if (!validationRulesAnswer(answer)) {
      return Promise.reject(manageContactMessage.MSG_RBET_005);
    }
    if (!validationQandA(answer, form.getFieldValue("question"))) {
      return Promise.reject(manageContactMessage.MSG_RBET_005C);
    }
    return Promise.resolve();
  };

  const handleSaveRecipient = async values => {
    const updatedRecipient = {
      ...selectedRecipient,
      defaultTransferAuthentication: {
        ...selectedRecipient.defaultTransferAuthentication,
        question: values.question
      }
    };
    handleUpdateRecipient({
      selectedRecipient: updatedRecipient,
      setShowEditModal,
      question: values.question,
      answer: values.answer
    });
  };

  const handleCloseForm = () => {
    form.resetFields();
    setSecurityFormState({
      questionHelpMessage: null,
      answerHelpMessage: null
    });
    setShowEditModal(false);
    setIsQuestionExpired(false);
  };

  const onFinish = values => {
    handleSaveRecipient(values);
    setShowEditModal(false);
    setIsQuestionExpired(false);
  };

  const getSecurityModal = () => {
    return (
      <Modal
        title="Edit security info"
        visible={showEditModal}
        centered
        maskClosable={false} // disable ability to close modal by clicking on mask
        closeIcon={<img src={cross} alt="close" />} // use close icon supplied by UX
        footer={null}
        onCancel={handleCloseForm}
      >
        <Form
          layout="vertical"
          form={form}
          requiredMark
          name="securityQuestionModal"
          initialValues={initialFormValues()}
          onValuesChange={changedValue => {
            updateHelperText(changedValue);
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Security question"
            htmlFor="question"
            className="input-group-modal"
            help={securityFormState.questionHelpMessage}
          >
            <Question
              className="input-group-icon"
              style={{ fontSize: "24px" }}
            />
            <Form.Item
              name="question"
              noStyle
              rules={[
                {
                  required: true,
                  validator: validateQuestion,
                  validateTrigger: ["onFinish"]
                }
              ]}
            >
              <Input
                size="large"
                autoComplete="off"
                maxLength={40}
                data-testid="securityQuestionModal_question"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="Security answer"
            htmlFor="answer"
            className="input-group-modal"
            help={securityFormState.answerHelpMessage}
          >
            <Answer className="input-group-icon" style={{ fontSize: "24px" }} />
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
              <Input
                size="large"
                autoComplete="off"
                maxLength={25}
                data-testid="securityQuestionModal_answer"
              />
            </Form.Item>
          </Form.Item>
          <Row className="ant-modal-footer-row">
            <Col xs={24} md={6}>
              <Button
                primary
                block
                htmlType="submit"
                loading={isPosting}
                data-testid="securityQuestion-save"
              >
                {isPosting ? null : "Save"}
              </Button>
            </Col>
            <Col xs={24} md={7}>
              <Button
                text
                block
                onClick={handleCloseForm}
                data-testid="securityQuestion-cancel"
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  if (!showSecurity) {
    return null;
  }
  if (showQuestions) {
    return (
      <>
        <div id="security-first" className="security security-question">
          <div className="form-icon">
            <img
              id={`${id}-security-question-icon`}
              src={questionIcon}
              alt="Security question"
            />
          </div>
          <div className="form-inputs">
            <p className="form-label security-question">Security question</p>
            <p className="security-action">{securityQuestion}</p>
          </div>
        </div>
        <div id="security-second" className="security mb-5">
          <div className="form-icon">
            <img
              id={`${id}-security-answer-icon`}
              src={answerIcon}
              alt="Security answer"
            />
          </div>
          <div className="form-inputs">
            <p className="form-label security-answer">Security answer</p>
            <div className="security-action">
              <MaskedQuestion className="security-mask" />
            </div>
            <div className="edit-add-recipient security-edit">
              <button
                data-testid={`${id}-security-edit-link`}
                type="button"
                className="edit-button"
                onClick={() => setModalForm(true)}
              >
                Edit security info
              </button>
              {showEditModal && getSecurityModal()}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="security-auto mt-3 mb-4">
        <div className="form-icon security">
          <img
            id={`${id}-security-question-icon`}
            src={questionIcon}
            alt="Security question"
          />
        </div>
        <div className="form-inputs">
          <p className="security-label security-autodeposit security-question">
            Security question
          </p>
          <p className="security-action">
            {manageContactMessage.MSG_RBET_045B(selectedRecipient.legalName)}
          </p>
        </div>
      </div>
    </>
  );
};

export default SecurityQuestions;
