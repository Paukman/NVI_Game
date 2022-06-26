import { useReducer } from "react";

import { SUCCESS, ERROR } from "./constants";
import {
  validateChallengeAnswerInput,
  getFailedSecurityAnswerAPIError
} from "./utils";

export const initialState = {
  loading: false,
  challengeQuestion: null,
  challengeQuestionId: "",
  transactionToken: null,
  dataLoaded: false,
  challengeAnswer: {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: ""
  },
  failedAttempts: 0
};

export const LOADING_DATA = "LOADING_DATA";
export const DATA_LOADING_FAILED = "DATA_LOADING_FAILED";
export const DATA_LOADED = "DATA_LOADED";
export const ON_CHANGE = "ON_CHANGE";
export const POSTING = "POSTING";
export const FAILED_SECURITY_ATTEMPT = "FAILED_SECURITY_ATTEMPT";
export const SECURITY_PASS = "SECURITY_PASS";
export const VALIDATE_FORM = "VALIDATE_FORM";

const setSecurityChallenge = (state, action) => {
  let newState = state;
  switch (action.type) {
    case LOADING_DATA: {
      newState = {
        ...newState,
        loading: true
      };
      return newState;
    }
    case DATA_LOADED: {
      const { questions } = action.data;
      return {
        ...newState,
        loading: false,
        challengeQuestion: questions.challengeQuestion,
        challengeQuestionId: questions.challengeQuestionId,
        headers: action.data.headers,
        dataLoaded: true
      };
    }
    case ON_CHANGE: {
      const { name, value } = action.data;
      if (name === "challengeAnswer") {
        const validatedInput = validateChallengeAnswerInput(value);
        newState = {
          ...newState,
          challengeAnswer: validatedInput,
          isFormValid: validatedInput.validateStatus !== ERROR
        };
      }
      return {
        ...newState
      };
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    case DATA_LOADING_FAILED: {
      newState = {
        ...newState,
        loading: false,
        error: { type: action.data }
      };
      return newState;
    }
    case VALIDATE_FORM: {
      const validatedInput = validateChallengeAnswerInput(
        newState.challengeAnswer.value
      );
      newState = {
        ...newState,
        challengeAnswer: validatedInput,
        isFormValid: validatedInput.validateStatus !== ERROR
      };
      return newState;
    }
    case FAILED_SECURITY_ATTEMPT: {
      newState = {
        ...newState,
        challengeAnswer: getFailedSecurityAnswerAPIError(
          newState.challengeAnswer.value
        ),
        failedAttempts: newState.failedAttempts + 1
      };
      return newState;
    }
    case SECURITY_PASS: {
      newState = {
        ...newState,
        failedAttempts: 0,
        transactionToken: action.data
      };
      return newState;
    }
    default: {
      return newState;
    }
  }
};

const useSecurityChallengeReducer = () => {
  const [state, dispatch] = useReducer(setSecurityChallenge, initialState);
  return [state, dispatch];
};

export default useSecurityChallengeReducer;
