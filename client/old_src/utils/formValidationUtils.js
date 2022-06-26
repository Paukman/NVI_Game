import dayjs from "dayjs";
import { balanceOfWithdrawalAccount } from "./formValidators";

const validateAmountRange = (value, min, max) => {
  if (!value || !min || !max) {
    return false;
  }
  if (value < min || value > max) {
    return false;
  }
  return true;
};

const validateAmountBalance = (
  value,
  withdrawalAccounts,
  selectWithdrawalAccount
) => {
  if (
    !value ||
    !withdrawalAccounts ||
    !withdrawalAccounts.length ||
    !selectWithdrawalAccount ||
    !selectWithdrawalAccount.from
  ) {
    return false;
  }
  const currentBalance = balanceOfWithdrawalAccount(
    withdrawalAccounts,
    selectWithdrawalAccount
  );
  if (currentBalance && value > currentBalance.value) {
    return false;
  }
  return true;
};

const validateInvalidDate = startDate => {
  const startDatem = dayjs(startDate);
  if (!startDatem.isValid()) {
    return false;
  }
  return true;
};

const validateMinAmount = (value, min) => {
  if (!value || !min) {
    return false;
  }
  if (value < min) {
    return false;
  }
  return true;
};

const validateMaxAmount = (value, max) => {
  if (!value || !max) {
    return false;
  }
  if (value > max) {
    return false;
  }
  return true;
};

export {
  validateAmountRange,
  validateAmountBalance,
  validateInvalidDate,
  validateMinAmount,
  validateMaxAmount
};
