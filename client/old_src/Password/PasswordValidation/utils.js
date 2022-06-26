import React from "react";
import api, { apiConfig, userProfilesBaseUrl } from "api";
import { authenticationErrors } from "utils/MessageCatalog";

import { validateForm } from "../usePasswordReducer";
import { POSTING, API_FAILED_ATTEMPT, VALIDATE_FORM } from "../constants";

export const onCancelLogoutWarning = modal => {
  modal.hide();
};
export const onManualLogout = (modal, logout) => {
  logout({
    returnTo: `${window.location.origin}/logout?loggedOutMessage=manual`
  });
  modal.hide();
};

export const showLogoutModal = (modal, logout) => {
  return modal.show({
    content: authenticationErrors.MSG_RB_AUTH_025(),
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            onCancelLogoutWarning(modal);
          }}
        >
          Cancel
        </button>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            onManualLogout(modal, logout);
          }}
        >
          Log out
        </button>
      </>
    )
  });
};

export const showAPIError = modal => {
  return modal.show({
    content: authenticationErrors.MSG_RB_AUTH_052(),
    actions: (
      <button
        type="button"
        className="ui button basic"
        onClick={() => {
          modal.hide();
        }}
      >
        OK
      </button>
    )
  });
};

export const onChangePasswordAPI = async submitData => {
  const {
    oldPassword,
    newPassword,
    failedAttempts,
    logout,
    setFormData,
    modal,
    onCommit,
    transactionToken
  } = submitData;
  setFormData({ type: POSTING, data: true });
  let response;
  // let retry;
  const headers = Object.assign({}, apiConfig.headers, {
    "transaction-token": transactionToken
  });
  try {
    response = await api.post(
      `${userProfilesBaseUrl}/changeTempPassword`,
      { oldPassword, newPassword },
      {
        headers
      }
    );
    setFormData({ type: POSTING, data: false });
    if (response.status === 200) {
      onCommit();
      logout({
        returnTo: `${window.location.origin}/logout?loggedOutMessage=resetpassword`
      });
    }
  } catch (error) {
    setFormData({ type: POSTING, data: false });
    const responseData =
      error && error.response && error.response.data
        ? error.response.data
        : null;
    if (responseData) {
      // oldPassword is incorrect
      if (
        responseData.statusCode === 500 &&
        responseData.code === "GENERIC_ERROR" &&
        responseData.message === "Unable to change temporary password"
      ) {
        if (failedAttempts >= 2) {
          onCommit();
          logout({
            returnTo: `${window.location.origin}/logout?loggedOutMessage=unauthorized`
          });
        } else {
          setFormData({ type: API_FAILED_ATTEMPT });
        }
      } else {
        showAPIError(modal);
      }
    }
  }
};

export const onChangePassword = async (
  formData,
  setFormData,
  logout,
  modal,
  transactionToken,
  onCommit
) => {
  let submitData;
  const isValid = validateForm(formData);
  setFormData({ type: VALIDATE_FORM });
  if (!transactionToken) return { isValid: false, submitData, formData };
  if (isValid) {
    submitData = {
      oldPassword: formData.currentPassword.value,
      newPassword: formData.password.value,
      failedAttempts: formData.failedAttempts,
      logout,
      setFormData,
      modal,
      onCommit,
      transactionToken
    };
    await onChangePasswordAPI(submitData);
  }

  return { isValid, submitData, formData };
};
