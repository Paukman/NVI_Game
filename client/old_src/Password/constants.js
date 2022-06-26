/* eslint-disable no-useless-escape */
export const VALIDATE_FORM = "VALIDATE_FORM";
export const POSTING = "POSTING";
export const API_FAILED_ATTEMPT = "API_FAILED_ATTEMPT";

export const mockSecurityData = {
  challengeQuestion: "test question?",
  challengeQuestionId: "1111",
  dataLoaded: true,
  challengeAnswer: {
    validateStatus: "success",
    errorMsg: null,
    value: ""
  }
};

export const passwordLengthAndNoSpacesRegex = /^[\S]{8,32}$/;
export const passwordUppercaseRegex = /[A-Z]+/;
export const passwordLowercaseRegex = /[a-z]+/;
export const passwordDigitRegex = /[0-9]+/;
export const passwordSpecialCharacterRegex = /[~`!@#$%^&*()+=_\\\-{}\[\]|:;"'?/<>,.]/;
export const passwordInvalidCharacterRegex = /[^~`!@#$%^&*()+=_\\\-{}\[\]|:;"'?/<>,.A-Za-z0-9\r\n\t\f\v ]/;

export const SUCCESS = "success";
export const ERROR = "error";

export const ON_CHANGE = "ON_CHANGE";
export const ON_BLUR = "ON_BLUR";

export const ErrorTypes = {
  LengthError: "LengthError",
  UppercaseError: "UppercaseError",
  LowercaseError: "LowercaseError",
  DigitError: "DigitError",
  SpecialCharacterError: "SpecialCharacterError"
};

export const securityQuestionDataMock = {
  challengeQuestion: "What is your favourite job?",
  challengeQuestionId: "1111"
};
