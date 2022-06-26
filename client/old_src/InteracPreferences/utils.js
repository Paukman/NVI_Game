import { isValidEmail, isAphaNumeric } from "utils/formUtils";
import { interacPreferences } from "utils/MessageCatalog";

export const validationRulesEmail = {
  requiredEmail: value => {
    if (!value.length) {
      return false;
    }
    return true;
  },
  isValidEmail: value => {
    if (!isValidEmail(value)) {
      return false;
    }
    return true;
  }
};
export const validationRulesName = {
  requiredName: value => {
    if (!value.trim().length) {
      return false;
    }
    return true;
  },
  isAphaNumeric: value => {
    if (!isAphaNumeric(value)) {
      return false;
    }
    return true;
  }
};

export const errorMessages = {
  requiredEmail: interacPreferences.ERR_MANDATORY_EMAIL,
  isValidEmail: interacPreferences.ERR_INCORRECT_FORMAT_EMAIL,
  requiredName: interacPreferences.ERR_MANDATORY_NAME,
  isAphaNumeric: interacPreferences.ERR_MANDATORY_NAME,
  systemError: interacPreferences.ERR_SYSTEM_SAVE_PROFILE
};
