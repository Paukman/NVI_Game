import dayjs from "dayjs";

const validateRequiredNoOfPayments = (value, message) => {
  if (!message || value === null || value === undefined) {
    return "Error in validation";
  }
  if (value < 1 || value > 999) {
    return message;
  }
  return true;
};

const validateEndDateIsPastStartDate = (startDate, endDate, message) => {
  const startDatem = dayjs(startDate).format("YYYY-MM-DD");
  const endDatem = dayjs(endDate).format("YYYY-MM-DD");
  if (startDatem >= endDatem) {
    return message;
  }
  return true;
};

const validateInvalidDate = (startDate, message) => {
  const startDatem = dayjs(startDate);
  if (!startDatem.isValid()) {
    return message;
  }
  return true;
};

const validateDateTodayOrLater = (startDate, message) => {
  if (validateInvalidDate(startDate) !== true || !message) {
    return "Error in validation";
  }
  const startDatem = dayjs(startDate);
  const todaym = dayjs().subtract(1, "day");
  if (startDatem <= todaym) {
    return message;
  }
  return true;
};

const validateIsNumber = (value, message) => {
  if (value.toString().match(/^[0-9]\d*$/g) === null) {
    return message;
  }
  return true;
};

const validateAmountRange = (value, minimum, maximum, message) => {
  // TODO alpha behaviour replaces alpha/alphanumeric with zero on blur.
  if (value < minimum || value > maximum) {
    return message;
  }
  return value;
};

const balanceOfWithdrawalAccount = (accounts, selectWithdrawalAccount) => {
  const selectedAccount = accounts.find(({ id }) => {
    return id === selectWithdrawalAccount.from;
  });
  if (selectedAccount) {
    return selectedAccount.availableBalance;
  }
  return { currency: "CAD", balance: 0 };
};

const validateAmountBalance = (
  value,
  withdrawalAccounts,
  selectWithdrawalAccount,
  message
) => {
  if (value === null) {
    return message;
  }
  const currentBalance = balanceOfWithdrawalAccount(
    withdrawalAccounts,
    selectWithdrawalAccount
  );
  if (currentBalance && value > currentBalance.value) {
    return message;
  }
  return true;
};

export {
  validateRequiredNoOfPayments,
  validateEndDateIsPastStartDate,
  validateInvalidDate,
  validateDateTodayOrLater,
  validateIsNumber,
  validateAmountBalance,
  validateAmountRange,
  balanceOfWithdrawalAccount
};
