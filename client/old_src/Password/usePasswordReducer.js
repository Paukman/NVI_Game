import { useReducer } from "react";
import {
  SUCCESS,
  ERROR,
  ON_CHANGE,
  ON_BLUR,
  ErrorTypes,
  VALIDATE_FORM,
  POSTING,
  API_FAILED_ATTEMPT
} from "./constants";

import {
  validatePassword,
  validateConfirmPassword,
  validateCurrentPassword,
  validateConfirmPasswordOnClear,
  getFailedResetPasswordAPIError
} from "./utils";

export const initialState = {
  password: {
    validateStatus: SUCCESS,
    types: [
      ErrorTypes.DigitError,
      ErrorTypes.LengthError,
      ErrorTypes.LowercaseError,
      ErrorTypes.SpecialCharacterError,
      ErrorTypes.UppercaseError
    ],
    value: ""
  },
  confirmPassword: {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: ""
  },
  currentPassword: {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: ""
  },
  lostFocus: false,
  isFormValid: false,
  failedAttempts: 0
};

const isFormValid = formData => {
  const lengthError = formData.password.types.includes(ErrorTypes.LengthError);
  const invalidPasswordError = formData.password.validateStatus === ERROR;
  const characterErrors =
    formData.password.types.filter(type => type !== ErrorTypes.LengthError) ||
    [];
  return (
    !lengthError &&
    !invalidPasswordError &&
    characterErrors &&
    characterErrors.length <= 1 &&
    formData.confirmPassword.validateStatus === SUCCESS &&
    formData.currentPassword.validateStatus === SUCCESS
  );
};

export const isNewPasswordValid = password => {
  const lengthError = password.types.includes(ErrorTypes.LengthError);
  const characterErrors =
    password.types.filter(type => type !== ErrorTypes.LengthError) || [];
  return !lengthError && characterErrors && characterErrors.length <= 1;
};

export const validateForm = state => {
  let newState = state;
  newState = {
    password: validatePassword(
      state.password.value,
      state.currentPassword.value,
      true
    ),
    currentPassword: validateCurrentPassword(state.currentPassword.value),
    confirmPassword: validateConfirmPassword(
      state.confirmPassword.value,
      state.password.value,
      state.currentPassword.value
    )
  };
  return isFormValid(newState);
};

const reducer = (state, action) => {
  let newState = state;
  switch (action.type) {
    case ON_CHANGE: {
      const { name, value } = action.data;
      if (name === "password") {
        newState = {
          ...newState,
          password: validatePassword(
            value,
            newState.currentPassword.value,
            false
          ),
          lostFocus: false,
          isFormValid: isFormValid(newState)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState),
          isNewPasswordValid: isNewPasswordValid(newState.password)
        };
      }
      if (name === "confirmPassword") {
        newState = {
          ...newState,
          confirmPassword: validateConfirmPasswordOnClear(value)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState)
        };
      }
      if (name === "currentPassword") {
        newState = {
          ...newState,
          currentPassword: validateCurrentPassword(value),
          isFormValid: isFormValid(newState)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState)
        };
      }
      return {
        ...newState,
        isFormValid: isFormValid(newState)
      };
    }
    case ON_BLUR: {
      const { name, value } = action.data;
      if (name === "password") {
        newState = {
          ...newState,
          password: validatePassword(
            value,
            newState.currentPassword.value,
            true
          ),
          lostFocus: true,
          isFormValid: isFormValid(newState)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState),
          isNewPasswordValid: isNewPasswordValid(newState.password)
        };
      }
      if (name === "confirmPassword") {
        newState = {
          ...newState,
          confirmPassword: validateConfirmPassword(
            value,
            newState.password.value,
            newState.currentPassword.value
          ),
          isFormValid: isFormValid(newState)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState)
        };
      }
      if (name === "currentPassword") {
        newState = {
          ...newState,
          currentPassword: validateCurrentPassword(value)
        };
        return {
          ...newState,
          isFormValid: isFormValid(newState)
        };
      }
      return {
        ...newState,
        isFormValid: isFormValid(newState)
      };
    }
    case VALIDATE_FORM: {
      newState = {
        ...newState,
        password: validatePassword(
          newState.password.value,
          newState.currentPassword.value,
          true
        ),
        currentPassword: validateCurrentPassword(
          newState.currentPassword.value
        ),
        confirmPassword: validateConfirmPassword(
          newState.confirmPassword.value,
          newState.password.value,
          newState.currentPassword.value
        ),
        lostFocus: true
      };
      return {
        ...newState,
        isFormValid: isFormValid(newState),
        isNewPasswordValid: isNewPasswordValid(newState.password)
      };
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    case API_FAILED_ATTEMPT: {
      return {
        ...newState,
        currentPassword: getFailedResetPasswordAPIError(
          newState.currentPassword.value
        ),
        isFormValid: isFormValid(newState),
        failedAttempts: newState.failedAttempts + 1
      };
    }
    default: {
      return {
        ...newState,
        isFormValid: isFormValid(newState)
      };
    }
  }
};

const usePasswordReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
};

export default usePasswordReducer;
