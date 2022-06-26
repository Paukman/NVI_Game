import React from "react";
import { manageContactMessage, eTransferErrors } from "utils/MessageCatalog";
import { isValidEmail, isAphaNumeric } from "utils/formUtils";
import classNames from "classnames";

import FormRecipient from "./ModalForms/FormRecipient";
import FormAutodepositRegistered from "./ModalForms/FormAutodepositRegistered";
import FormSecurityQuestion from "./ModalForms/FormSecurityQuestion";

export const ADD_RECIPIENT_FORM = "ADD_RECIPIENT_FORM";
export const SECURITY_QUESTION_FORM = "SECURITY_QUESTION_FORM";
export const AUTODEPOSIT_REGISTERED_FORM = "AUTODEPOSIT_REGISTERED_FORM";
export const EDIT_SECURITY_QUESTION_FORM = "EDIT_SECURITY_QUESTION_FORM";

export const AUTODEPOSIT_REGISTERED = "AUTODEPOSIT_REGISTERED";
export const AUTODEPOSIT_NOT_REGISTERED = "AUTODEPOSIT_NOT_REGISTERED";
export const AUTODEPOSIT_REGISTERED_ERR = "AUTODEPOSIT_REGISTERED_ERR";

export const ADD_RECIPIENT_SUCCESS = "ADD_RECIPIENT_SUCCESS";
export const ADD_RECIPIENT_ERR = "ADD_RECIPIENT_ERR";

export const EDIT_RECIPIENT_SUCCESS = "EDIT_RECIPIENT_SUCCESS";
export const EDIT_RECIPIENT_ERR = "EDIT_RECIPIENT_ERR";

export const MAX_CHARS_RECIPIENT_NAME = 80;
export const MAX_CHARS_RECIPIENT_EMAIL = 64;
export const MAX_CHARS_QUESTION = 40;
export const MAX_CHARS_ANSWER = 25;
export const MIN_CHARS_ANSWER = 3;

export const MAX_COUNT_MESSAGE = "Max character count reached.";

const illegalWords = [
  "http",
  "http.",
  "http./",
  "https",
  "https.",
  "https./",
  "www",
  "www.",
  "javascript",
  "function",
  "return"
];

export const isAnswerValid = answer => {
  if (!answer || answer.length < 3) return false;
  // do not allow 2 consecutive spaces as well
  const isOnlyAlphaNumericHyphen = /^(?!.*?[ ]{2})[A-Za-z0-9 -]*$/.test(answer);
  const isNotContainingIllegalWords = !illegalWords.some(illegalWord =>
    answer.toLowerCase().includes(illegalWord)
  );
  return isOnlyAlphaNumericHyphen && isNotContainingIllegalWords;
};

export const isQuestionValid = question => {
  if (!question) return false;
  const isNotContainingIllegalWords = !illegalWords.some(illegalWord =>
    question.toLowerCase().includes(illegalWord)
  );
  return isNotContainingIllegalWords;
};

export const createValidateEmail = recipientList => async (_, email) => {
  const compareEmail = recipient =>
    recipient?.notificationPreference[0].notificationHandle.toUpperCase() ===
    email.trim().toUpperCase();

  if (!isValidEmail(email)) {
    return Promise.reject(new Error(manageContactMessage.MSG_RBET_010));
  }
  if (recipientList?.some(compareEmail)) {
    return Promise.reject(new Error(manageContactMessage.MSG_RBET_008B));
  }
  return null;
};

export const createValidateName = recipientList => async (_, name) => {
  const compareName = recipient =>
    recipient?.aliasName.toUpperCase() === name.trim().toUpperCase();

  if (!name) {
    return Promise.reject(new Error(manageContactMessage.MSG_RBET_033));
  }
  if (!isAphaNumeric(name)) {
    return Promise.reject(new Error(manageContactMessage.MSG_RBET_026));
  }
  if (recipientList?.some(compareName)) {
    return Promise.reject(new Error(manageContactMessage.MSG_RBET_008));
  }
  return null;
};

export const validateAnswer = async (_, answer) => {
  if (!isAnswerValid(answer) || !answer) {
    return Promise.reject(manageContactMessage.MSG_RBET_005);
  }
  return null;
};

export const validateSameAnswerAndQuestion = getFieldValue => {
  return {
    async validator(_, answer) {
      const question = getFieldValue("securityQuestion");
      if (question && question === answer) {
        return Promise.reject(manageContactMessage.MSG_RBET_005C);
      }
      return null;
    }
  };
};

export const validateQuestion = async (_, question) => {
  if (!isQuestionValid(question) || !question) {
    return Promise.reject(manageContactMessage.MSG_RBET_028);
  }

  return null;
};

export const prepareSubmitData = ({
  recipientState,
  question = null,
  answer = null,
  saveRecipient = null
}) => {
  let submitData = {
    registrationName: recipientState.recipientName,
    notificationHandle: recipientState.recipientEmail,
    oneTimeRecipient: saveRecipient === null ? true : !saveRecipient // if null, use true
  };

  if (!recipientState.autodepositRegistered) {
    submitData = {
      ...submitData,
      transferAuthentication: {
        authenticationType: 0,
        question,
        answer
      }
    };
  }
  return submitData;
};

export const GetFormToRender = (formToRender, forms) => {
  return (
    <>
      <div
        className={classNames(
          { "display-none": formToRender !== ADD_RECIPIENT_FORM },
          { "display-block": formToRender === ADD_RECIPIENT_FORM }
        )}
      >
        <FormRecipient form={forms.addRecipientForm} />
      </div>
      <div
        className={classNames(
          { "display-none": formToRender !== SECURITY_QUESTION_FORM },
          { "display-block": formToRender === SECURITY_QUESTION_FORM }
        )}
      >
        <FormSecurityQuestion form={forms.securityQuestionForm} />
      </div>
      <div
        className={classNames(
          { "display-none": formToRender !== AUTODEPOSIT_REGISTERED_FORM },
          { "display-block": formToRender === AUTODEPOSIT_REGISTERED_FORM }
        )}
      >
        <FormAutodepositRegistered form={forms.autodepositRegisteredForm} />
      </div>
    </>
  );
};

export const prepareRecipient = ({ recipient }) => {
  const {
    name,
    email,
    recipientId,
    registered,
    question,
    oneTimeRecipient
  } = recipient;
  const newRecipient = {
    aliasName: name,
    defaultTransferAuthentication: registered
      ? { authenticationType: "None" }
      : {
          authenticationType: "Contact Level Security",
          hashType: "SHA2",
          question
        },
    notificationPreference: [
      {
        isActive: true,
        notificationHandle: email,
        notificationHandleType: "Email"
      }
    ],
    recipientId,
    oneTimeRecipient
  };
  return newRecipient;
};

export const handleError = error => {
  let ret = eTransferErrors.MSG_REBAS_000_CONTENT; // default
  if (error?.response?.data?.message === "Recipient name is not unique.") {
    ret = manageContactMessage.MSG_RBET_008;
  }
  return ret;
};

export const getFieldToUpdateAndMessage = changedValue => {
  if (!changedValue) return null;
  const changedValueField = Object.keys(changedValue)[0];
  let field = null;
  let message = null;

  switch (changedValueField) {
    case "recipientName": {
      field = "recipientNameHelpMessage";
      message =
        changedValue[changedValueField].length >= MAX_CHARS_RECIPIENT_NAME
          ? MAX_COUNT_MESSAGE
          : null;

      break;
    }
    case "recipientEmail": {
      field = "recipientEmailHelpMessage";
      message =
        changedValue[changedValueField].length >= MAX_CHARS_RECIPIENT_EMAIL
          ? MAX_COUNT_MESSAGE
          : null;
      break;
    }
    case "securityQuestion": {
      field = "questionHelpMessage";
      message =
        changedValue[changedValueField].length >= MAX_CHARS_QUESTION
          ? MAX_COUNT_MESSAGE
          : null;
      break;
    }
    case "securityAnswer": {
      field = "answerHelpMessage";
      message =
        changedValue[changedValueField].length >= MAX_CHARS_ANSWER
          ? MAX_COUNT_MESSAGE
          : null;
      break;
    }
    default:
      field = null;
      break;
  }
  if (field) {
    return { field, message };
  }
  return null;
};
