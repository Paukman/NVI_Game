import { interacPreferences } from "utils/MessageCatalog";
import { isValidEmail, isAphaNumeric } from "utils/formUtils";

export const validateEmail = async (_, email) => {
  if (!isValidEmail(email)) {
    return Promise.reject(
      new Error(interacPreferences.ERR_INCORRECT_FORMAT_EMAIL)
    );
  }
  return null;
};

export const validateName = async (_, name) => {
  if (!isAphaNumeric(name) || !name) {
    return Promise.reject(new Error(interacPreferences.ERR_MANDATORY_NAME));
  }
  return null;
};
