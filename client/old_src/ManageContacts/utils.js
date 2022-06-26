import {
  isValidEmail,
  isAphaNumeric,
  isAphaNumericWithoutSpace,
  isDisallowed,
  hasInvalidCharacters
} from "utils/formUtils";
import { manageContactMessage } from "utils/MessageCatalog";

export const validationRulesAccount = isDisabledMode => {
  return {
    requiredAccount: value => {
      if (isDisabledMode) {
        return true; // don't report errors when disabled.
      }
      return !(value === undefined || !value.length);
    },
    invalidAccount: value => {
      if (isDisabledMode) {
        return true; // don't report errors when disabled.
      }
      // order dependent, since it does not check for undefined
      return (
        !(hasInvalidCharacters(value) || isDisallowed(value)) &&
        isAphaNumericWithoutSpace(value)
      );
    }
  };
};

const validateEmail = async (value, getTransferType, setShowAutodeposit) => {
  const transferType = await getTransferType(value);
  await setShowAutodeposit(transferType === 2);
};

export const validationRulesEmail = async (
  value,
  getTransferType,
  setShowAutodeposit
) => {
  if (!value || !value.length) {
    return false;
  }
  if (!isValidEmail(value)) {
    return false;
  }
  await validateEmail(value, getTransferType, setShowAutodeposit);
  return true;
};

export const createValidateUniqueEmail = (
  recipientList,
  recipientToHandle
) => value => {
  const compareEmail = recipient =>
    recipient?.notificationPreference[0].notificationHandle.toUpperCase() ===
    value.trim().toUpperCase();

  if (compareEmail(recipientToHandle)) {
    return true;
  }
  return !recipientList?.some(compareEmail);
};

export const validationRulesName = {
  requiredName: value => {
    if (!value || !value.trim().length) {
      return false;
    }
    return true;
  },
  isValidName: value => !!value && isAphaNumeric(value)
};

export const createValidateUniqueName = (
  recipientList,
  recipientToHandle
) => value => {
  const compareName = recipient =>
    recipient?.aliasName.toUpperCase() === value.trim().toUpperCase();

  if (compareName(recipientToHandle)) {
    return true;
  }
  return !recipientList?.some(compareName);
};

export const validationRulesNickname = {
  isValidNickname: value => {
    if (!value) return true;
    if (
      !isAphaNumeric(value) ||
      isDisallowed(value) ||
      hasInvalidCharacters(value)
    ) {
      return false;
    }
    return true;
  }
};

export const validationEmptyQuestion = question => {
  if (!question.length) {
    return false;
  }
  return true;
};

export const validationRulesQuestion = question => {
  if (!question || question.length < 3 || question.length > 40) {
    return false;
  }
  if (isDisallowed(question)) {
    return false;
  }
  return true;
};

export const validationQandA = (question, answer) => {
  if (question === answer) {
    return false;
  }
  return true;
};

export const validationRulesAnswer = value => {
  if (!value.length) {
    return false;
  }
  if (value.length < 3 || value.length > 64) {
    return false;
  }
  if (isDisallowed(value)) {
    return false;
  }
  if (!isAphaNumericWithoutSpace(value)) {
    return false;
  }
  return true;
};

export const MAX_CHARS_QUESTION = 40;
export const MAX_CHARS_ANSWER = 25;
export const MIN_CHARS_ANSWER = 3;
export const MAX_COUNT_MESSAGE = "Max character count reached.";

export const getFieldToUpdateAndMessage = changedValue => {
  if (!changedValue) return null;
  const changedValueField = Object.keys(changedValue)[0];
  let field = null;
  let message = null;

  switch (changedValueField) {
    case "question": {
      field = "questionHelpMessage";
      message =
        changedValue[changedValueField].length >= MAX_CHARS_QUESTION
          ? MAX_COUNT_MESSAGE
          : null;
      break;
    }
    case "answer": {
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

export const errorTypes = {
  INVALID_ACCOUNT: "invalidAccount"
};

export const errorMessages = {
  requiredName: manageContactMessage.MSG_RBET_033,
  isValidName: manageContactMessage.MSG_RBET_026,
  isUniqueName: manageContactMessage.MSG_RBET_008,
  isValidEmail: manageContactMessage.MSG_RBET_010,
  isUniqueEmail: manageContactMessage.MSG_RBET_008B,
  requiredQuestion: manageContactMessage.MSG_RBET_028,
  isValidQuestion: manageContactMessage.MSG_RBET_005B,
  isValidAnswer: manageContactMessage.MSG_RBET_005,
  isSameQuestionAndAnswer: manageContactMessage.MSG_RBET_005C,
  invalidAccount: manageContactMessage.MSG_RBBP_017,
  requiredAccount: manageContactMessage.MSG_RBBP_017B,
  isValidAccountNumber: manageContactMessage.MSG_RBBP_017,
  isValidNickname: manageContactMessage.MSG_RBBP_017_UNK
};
