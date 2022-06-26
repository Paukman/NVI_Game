import { interacPreferences } from "utils/MessageCatalog";
import { isValidEmail } from "utils/formUtils";

export const rules = {
  email: {
    requiredEmail: value => {
      if (!value || !value.length) {
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
  },
  account: {
    requiredAccount: value => {
      if (!value || !value.length) {
        return false;
      }
      return true;
    }
  }
};

export const errorMessages = {
  requiredEmail: interacPreferences.ERR_MANDATORY_EMAIL,
  isValidEmail: interacPreferences.ERR_INCORRECT_FORMAT_EMAIL,
  requiredAccount: interacPreferences.ERR_NO_ACCOUNT
};

export const getFormattedAccounts = data => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    .map(item => ({
      text: `${item.name} (${item.number})`,
      key: item.id,
      value: item.id
    }));
};

export const autoDepositStatus = {
  Pending: 0,
  Active: 1,
  Expired: 2,
  Deleted: 3
};

export const prepareAutoDepositRuleToPut = state =>
  state?.account && state?.autodepositRule
    ? {
        directDepositReferenceNumber:
          state.autodepositRule.directDepositReferenceNumber,
        accountId: state.account
      }
    : null;

export const prepareAutoDepositRuleToPost = state =>
  state?.account && state?.email
    ? {
        directDepositHandle: state.email,
        accountId: state.account
      }
    : null;

export const prepareErrorModal = error => {
  if (!error) {
    return "";
  }
  if (error?.response?.status && error?.response?.data?.code) {
    const isExistingEmailError =
      error.response.status === 500 && error.response.data.code === "ETRN0005";
    if (isExistingEmailError) {
      return interacPreferences.ERR_SYSTEM_DUPLICATE_AUTODEPOSIT();
    }
    const isMaximumLimitExceeded =
      error.response.status === 500 && error.response.data.code === "ETRN0002";
    if (isMaximumLimitExceeded) {
      return interacPreferences.ERR_SYSTEM_MAXIMUM_AUTODEPOSIT();
    }
  }
  return interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT();
};

export const extractProfile = (data, initialState) => {
  if (!data || data.length === 0) return initialState;

  const { enabled } = data;
  const name = data.customerName ? data.customerName.registrationName : "";
  const preferences = data.notificationPreference
    ? data.notificationPreference.filter(
        pref => pref.notificationHandleType === "Email"
      )
    : [];
  return {
    enabled,
    name,
    email: preferences.length ? preferences[0].notificationHandle : ""
  };
};
