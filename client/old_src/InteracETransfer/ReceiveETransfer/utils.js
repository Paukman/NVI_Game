import { receiveETransferErrors } from "utils/MessageCatalog";
import api from "api";
import { getFormattedAccountsForCurrency } from "utils";

// 18 is inline try again
// 19 is modal too many attempts
// eveyrthing else modal
export const handleError = error => {
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.code &&
    error.response.data.code === "ETRN0019"
  ) {
    return {
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_006
    };
  }
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.code &&
    error.response.data.code === "ETRN0018"
  ) {
    return {
      invalidAnswer: "inline",
      message: receiveETransferErrors.MSG_RBET_017s
    };
  }
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.code &&
    error.response.data.code === "ETRN0020"
  ) {
    return {
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_006B()
    };
  }
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.code &&
    error.response.data.code === "ETRN0015"
  ) {
    return {
      invalidAnswer: "modal",
      message: receiveETransferErrors.MSG_RBET_043()
    };
  }
  // this is the no interac profile, no modal popup
  if (
    error &&
    error.response &&
    error.response.data &&
    error.response.data.code &&
    error.response.data.code === "ETRN0003"
  ) {
    return {
      message: null
    };
  }
  // all other errors
  return {
    invalidAnswer: "modal",
    message: receiveETransferErrors.MSG_RBET_014
  };
};

export const isAuthenticated = result => {
  const isAuth =
    result &&
    result.data &&
    result.data.eTransferStatus === "Authentication Successful" &&
    !result.data.authenticationRequired;
  return isAuth;
};

export const loadTransfers = async url => {
  const result = await api.get(url);
  return result;
};

export const loadEligibleAccounts = async url => {
  const result = await api.get(url);
  return result;
};

export const updateBalance = (id, eligibleAccounts) => {
  const accountToDeposit = eligibleAccounts.filter(
    account => account.id === id
  );
  const accountToDepositFormatted = getFormattedAccountsForCurrency(
    accountToDeposit,
    "CAD"
  );
  return accountToDepositFormatted[0].text;
};
