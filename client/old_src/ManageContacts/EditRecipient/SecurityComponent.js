/* eslint-disable jsx-a11y/label-has-associated-control */ // need to disable it globally
import React, { useContext } from "react";
import PropTypes from "prop-types";
import questionIcon from "assets/icons/Question/question.svg";
import answerIcon from "assets/icons/Answer/answer.svg";

import { manageContactMessage } from "utils/MessageCatalog";
import { modeName } from "globalConstants";

import { ManageContactsContext } from "../ManageContactsProvider";
import {
  validationEmptyQuestion,
  validationQandA,
  validationRulesAnswer,
  errorMessages
} from "../utils";

// TODO use global styles
import "Common/ReviewButtons/styles.scss";

const SecurityComponent = ({ register, errors, getValues }) => {
  SecurityComponent.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.objectOf(PropTypes.object).isRequired,
    getValues: PropTypes.func.isRequired
  };
  const { recipient, page } = useContext(ManageContactsContext);
  const { recipientToHandle, showAutodeposit } = recipient;
  const { mode } = page;

  const renderAutodepositMessage = () => {
    return (
      <div className="autodeposit-enabled-message">
        <h3 className={`${mode === modeName.CREATE_MODE ? "no-padding" : ""}`}>
          Autodeposit
        </h3>
        <span>
          {manageContactMessage.MSG_RBET_045C(
            recipient.legalName,
            recipientToHandle.notificationPreference[0].notificationHandle
          )}
        </span>
      </div>
    );
  };

  const renderSecurityBlock = () => {
    return (
      <>
        <div className="edit-label">
          <div className="form-icon">
            <img src={questionIcon} alt="Security question" />
          </div>
          <div className="form-inputs input-spacing">
            <label className="form-label" htmlFor="edit-recipient-question">
              Security question
            </label>
            <input
              className={`ui input full-width-input ${
                errors.question ? "has-errors" : ""
              }`}
              ref={register({
                validate: {
                  requiredQuestion: value => {
                    return validationEmptyQuestion(value);
                  },
                  isSameQuestionAndAnswer: value => {
                    return validationQandA(value, getValues().answer);
                  }
                }
              })}
              maxLength="40"
              name="question"
              id="edit-recipient-question"
              data-testid="edit-recipient-question"
              defaultValue={
                mode === modeName.CREATE_MODE
                  ? ""
                  : recipientToHandle.defaultTransferAuthentication.question
              }
            />
            <p className="error">
              {errors.question ? errorMessages[errors.question.type] : ""}
            </p>
          </div>
        </div>
        <div className="edit-label">
          <div className="form-icon">
            <img src={answerIcon} alt="Security answer" />
          </div>
          <div className="form-inputs input-spacing">
            <label className="form-label" htmlFor="edit-recipient-answer">
              Security answer
            </label>
            <input
              className={`ui input full-width-input ${
                errors.answer ? "has-errors" : ""
              }`}
              ref={register({
                validate: {
                  isValidAnswer: value => {
                    return validationRulesAnswer(value);
                  },
                  isSameQuestionAndAnswer: value => {
                    return validationQandA(getValues().question, value);
                  }
                }
              })}
              name="answer"
              id="edit-recipient-answer"
              data-testid="edit-recipient-answer"
              defaultValue=""
              maxLength="25"
            />
            <p className="error">
              {errors.answer ? errorMessages[errors.answer.type] : ""}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>{showAutodeposit ? renderAutodepositMessage() : renderSecurityBlock()}</>
  );
};

export default SecurityComponent;
