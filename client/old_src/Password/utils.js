import { authenticationErrors } from "utils/MessageCatalog";
import {
  passwordLengthAndNoSpacesRegex,
  passwordUppercaseRegex,
  passwordLowercaseRegex,
  passwordDigitRegex,
  passwordSpecialCharacterRegex,
  passwordInvalidCharacterRegex,
  SUCCESS,
  ERROR,
  ErrorTypes
} from "./constants";
import { isNewPasswordValid } from "./usePasswordReducer";

export const validateChallengeAnswerInput = answer => {
  let errors = {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: answer
  };

  if (!answer) {
    errors = {
      ...errors,
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_008,
      value: answer
    };
  }
  return errors;
};

export const validatePassword = (password, currentPassword, lostFocus) => {
  let errors = {
    validateStatus: SUCCESS,
    types: [],
    value: password
  };

  if (!passwordLengthAndNoSpacesRegex.test(password)) {
    errors = {
      ...errors,
      types: [...errors.types, ErrorTypes.LengthError],
      value: password
    };
  }
  if (!passwordUppercaseRegex.test(password)) {
    errors = {
      ...errors,
      types: [...errors.types, ErrorTypes.UppercaseError],
      value: password
    };
  }
  if (!passwordLowercaseRegex.test(password)) {
    errors = {
      ...errors,
      types: [...errors.types, ErrorTypes.LowercaseError],
      value: password
    };
  }
  if (!passwordDigitRegex.test(password)) {
    errors = {
      ...errors,
      types: [...errors.types, ErrorTypes.DigitError],
      value: password
    };
  }
  if (!passwordSpecialCharacterRegex.test(password)) {
    errors = {
      ...errors,
      types: [...errors.types, ErrorTypes.SpecialCharacterError],
      value: password
    };
  }
  errors = {
    ...errors,
    validateStatus: SUCCESS
  };
  if (lostFocus) {
    const isValidRequirements = isNewPasswordValid(errors);
    errors = {
      ...errors,
      validateStatus: isValidRequirements ? SUCCESS : ERROR
    };
  }

  if (!password) {
    errors = {
      ...errors,
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_004,
      value: password
    };
  }
  if (password && password === currentPassword) {
    errors = {
      ...errors,
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_011B,
      value: password
    };
  }

  if (password && passwordInvalidCharacterRegex.test(password)) {
    errors = {
      ...errors,
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_006,
      value: password
    };
  }
  return errors;
};

export const validateConfirmPassword = (
  confirmPassword,
  password,
  currentPassword
) => {
  if (!confirmPassword) {
    return {
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_004,
      value: confirmPassword
    };
  }
  if (
    confirmPassword &&
    confirmPassword.length &&
    confirmPassword !== password
  ) {
    return {
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_012,
      value: confirmPassword
    };
  }
  if (
    confirmPassword &&
    confirmPassword.length &&
    confirmPassword === currentPassword
  ) {
    return {
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_011B,
      value: confirmPassword
    };
  }
  return {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: confirmPassword
  };
};

export const validateCurrentPassword = password => {
  if (!password) {
    return {
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_001C,
      value: password
    };
  }
  return {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: password
  };
};

export const validateConfirmPasswordOnClear = confirmPassword => {
  if (!confirmPassword) {
    return {
      validateStatus: ERROR,
      errorMsg: authenticationErrors.MSG_RBAUTH_004,
      value: confirmPassword
    };
  }
  return {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: confirmPassword
  };
};

export const getFailedResetPasswordAPIError = currentPassword => {
  return {
    validateStatus: ERROR,
    errorMsg: authenticationErrors.MSG_RBAUTH_001B,
    value: currentPassword
  };
};

export const getFailedSecurityAnswerAPIError = answer => {
  return {
    validateStatus: ERROR,
    errorMsg: authenticationErrors.MSG_RBAUTH_011,
    value: answer
  };
};
