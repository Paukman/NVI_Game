import { authenticationErrors } from "utils/MessageCatalog";

import {
  validatePassword,
  validateConfirmPassword,
  validateCurrentPassword
} from "./utils";
import { ErrorTypes, ERROR, SUCCESS } from "./constants";

describe("Testing validatePassword", () => {
  it(">> should return error for Lower Case", () => {
    const password = "123";
    const currentPassword = "123";
    const errors = validatePassword(password, currentPassword);
    expect(errors.types.includes(ErrorTypes.LowercaseError)).toEqual(true);
  });
  it(">> should return error for Upper Case, digit and special character error", () => {
    const password = "test";
    const currentPassword = "test";
    const errors = validatePassword(password, currentPassword);
    expect(errors.types.includes(ErrorTypes.UppercaseError)).toEqual(true);
    expect(errors.types.includes(ErrorTypes.DigitError)).toEqual(true);
    expect(errors.types.includes(ErrorTypes.SpecialCharacterError)).toEqual(
      true
    );
    expect(errors.types.includes(ErrorTypes.LowercaseError)).toEqual(false);
  });
  it(">> should throw required password error", () => {
    const password = "";
    const currentPassword = "test";
    const errors = validatePassword(password, currentPassword);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_004);
  });
  it(">> should throw same a current password error", () => {
    const password = "test";
    const currentPassword = "test";
    const errors = validatePassword(password, currentPassword);
    expect(errors.validateStatus).toEqual(ERROR);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_011B);
  });
  it(">> should come no errors for successful password", () => {
    const password = "Atest123$";
    const currentPassword = "Atest123";
    const errors = validatePassword(password, currentPassword);
    expect(errors.validateStatus).toEqual(SUCCESS);
    expect(errors.types).toEqual([]);
  });
});

describe("Testing validateConfirmPassword", () => {
  it(">> should throw error for required confirm password", () => {
    const password = "123";
    const currentPassword = "123";
    const confirmPassword = "";
    const errors = validateConfirmPassword(
      confirmPassword,
      password,
      currentPassword
    );
    expect(errors.validateStatus).toEqual(ERROR);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_004);
  });
  it(">> should throw error if password and confirmed password do not match", () => {
    const password = "test123";
    const currentPassword = "123";
    const confirmPassword = "test456";
    const errors = validateConfirmPassword(
      confirmPassword,
      password,
      currentPassword
    );
    expect(errors.validateStatus).toEqual(ERROR);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_012);
  });

  it(">> should throw error if confirm password and current password is same", () => {
    const password = "test123";
    const currentPassword = "test123";
    const confirmPassword = "test123";
    const errors = validateConfirmPassword(
      confirmPassword,
      password,
      currentPassword
    );
    expect(errors.validateStatus).toEqual(ERROR);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_011B);
  });
});
describe("Testing validateCurrentPassword", () => {
  it(">> should throw error for required current password", () => {
    const currentPassword = "";

    const errors = validateCurrentPassword(currentPassword);
    expect(errors.validateStatus).toEqual(ERROR);
    expect(errors.errorMsg).toEqual(authenticationErrors.MSG_RBAUTH_001C);
  });
});
