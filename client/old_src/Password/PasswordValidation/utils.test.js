import React from "react";
import { userProfilesBaseUrl } from "api";
import {
  CircleLight,
  CheckMarkCircle,
  FailCircle
} from "StyleGuide/Components/Icons";
import { mockApiData } from "utils/TestUtils";
import {
  showLogoutModal,
  onManualLogout,
  onCancelLogoutWarning,
  onChangePassword,
  onChangePasswordAPI
} from "./utils";
import { ErrorMark } from "./ValidationContent";
import { ErrorTypes, SUCCESS } from "../constants";
import { initialState } from "../usePasswordReducer";

export const validState = {
  password: {
    validateStatus: SUCCESS,
    types: [
      ErrorTypes.DigitError,
      ErrorTypes.LengthError,
      ErrorTypes.LowercaseError,
      ErrorTypes.SpecialCharacterError,
      ErrorTypes.UppercaseError
    ],
    value: "Test123!"
  },
  confirmPassword: {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: "Test123!"
  },
  currentPassword: {
    validateStatus: SUCCESS,
    errorMsg: null,
    value: "123456"
  },
  lostFocus: false,
  isFormValid: true,
  failedAttempts: 0
};
describe("Testing showLogoutModal", () => {
  it(">> should open modal for logout", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const logout = jest.fn();
    showLogoutModal(modal, logout);
    expect(modal.show).toHaveBeenCalled();
  });

  it(">> should hide modal and logout on onManualLogout", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const logout = jest.fn();
    onManualLogout(modal, logout);
    expect(modal.hide).toHaveBeenCalled();
    expect(logout).toHaveBeenCalled();
  });
  it(">> should hide modal on onCancelLogoutWarning", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    onCancelLogoutWarning(modal);
    expect(modal.hide).toHaveBeenCalled();
  });
});
describe("Testing ErrorMark", () => {
  it(">> should show different icon as per onBlur or onChange", () => {
    let errorTypes = [ErrorTypes.LowercaseError, ErrorTypes.UppercaseError];
    let result = ErrorMark({
      type: ErrorTypes.LowercaseError,
      errorTypes,
      lostFocus: true
    });
    expect(result).toEqual(
      <FailCircle
        className="margin-top-4"
        data-testid={ErrorTypes.LowercaseError}
      />
    );
    errorTypes = [ErrorTypes.DigitError, ErrorTypes.UppercaseError];
    result = ErrorMark({
      type: ErrorTypes.LowercaseError,
      errorTypes,
      lostFocus: true
    });
    expect(result).toEqual(<CheckMarkCircle className="margin-top-4" />);
    errorTypes = [ErrorTypes.LowercaseError, ErrorTypes.UppercaseError];
    result = ErrorMark({
      type: ErrorTypes.LowercaseError,
      errorTypes,
      lostFocus: false
    });
    expect(result).toEqual(
      <CircleLight
        className="margin-top-4"
        data-testid={ErrorTypes.LowercaseError}
      />
    );
  });
});

describe("Testing onChangePassword", () => {
  it(">> onChangePassword when form is not valid", async () => {
    const logout = jest.fn();
    const setFormData = jest.fn();
    const modal = jest.fn();
    const onCommit = jest.fn();
    const transactionToken = null;

    const formData = initialState;
    const response = await onChangePassword(
      formData,
      setFormData,
      logout,
      modal,
      transactionToken,
      onCommit
    );
    expect(response.isValid).toEqual(false);
    expect(response.submitData).toBeUndefined();
  });
  it(">> onChangePassword when form is valid", async () => {
    const logout = jest.fn();
    const setFormData = jest.fn();
    const modal = jest.fn();
    const onCommit = jest.fn();
    const transactionToken = "transactionToken12345677";

    const formData = validState;
    const response = await onChangePassword(
      formData,
      setFormData,
      logout,
      modal,
      transactionToken,
      onCommit
    );
    expect(response.isValid).toEqual(true);
    expect(response.submitData).toEqual({
      oldPassword: formData.currentPassword.value,
      newPassword: formData.password.value,
      failedAttempts: formData.failedAttempts,
      logout,
      setFormData,
      modal,
      onCommit,
      transactionToken
    });
  });
});

describe("Testing onChangePasswordAPI", () => {
  it(">> successful changeTempPassword", async () => {
    const logout = jest.fn();
    const setFormData = jest.fn();
    const modal = jest.fn();
    const onCommit = jest.fn();
    mockApiData([
      {
        url: `${userProfilesBaseUrl}/changeTempPassword`,
        results: {},
        status: 200,
        method: "post"
      }
    ]);
    const submitData = {
      oldPassword: "oldPassword",
      newPassword: "newPassword123",
      failedAttempts: 0,
      logout,
      setFormData,
      modal,
      onCommit,
      transactionToken: "transactionToken1234567890"
    };
    await onChangePasswordAPI(submitData);
    expect(logout).toBeCalledWith({
      returnTo: `${window.location.origin}/logout?loggedOutMessage=resetpassword`
    });
  });
  it(">> wrong current password first time changeTempPassword", async () => {
    const logout = jest.fn();
    const setFormData = jest.fn();
    const modal = jest.fn();
    const onCommit = jest.fn();
    mockApiData([
      {
        url: `${userProfilesBaseUrl}/changeTempPassword`,
        results: {},
        status: 500,
        method: "post",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to change temporary password"
            }
          }
        }
      }
    ]);
    const submitData = {
      oldPassword: "oldPassword",
      newPassword: "newPassword123",
      failedAttempts: 0,
      logout,
      setFormData,
      modal,
      onCommit,
      transactionToken: "transactionToken1234567890"
    };
    await onChangePasswordAPI(submitData);
    expect(setFormData).toBeCalledWith({ type: "API_FAILED_ATTEMPT" });
  });
  it(">> wrong current password third time changeTempPassword", async () => {
    const logout = jest.fn();
    const setFormData = jest.fn();
    const modal = jest.fn();
    const onCommit = jest.fn();
    mockApiData([
      {
        url: `${userProfilesBaseUrl}/changeTempPassword`,
        results: {},
        status: 400,
        method: "post",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to change temporary password"
            }
          }
        }
      }
    ]);
    const submitData = {
      oldPassword: "oldPassword",
      newPassword: "newPassword123",
      failedAttempts: 2,
      logout,
      setFormData,
      modal,
      onCommit,
      transactionToken: "transactionToken1234567890"
    };
    await onChangePasswordAPI(submitData);
    expect(logout).toBeCalledWith({
      returnTo: `${window.location.origin}/logout?loggedOutMessage=unauthorized`
    });
  });
});
