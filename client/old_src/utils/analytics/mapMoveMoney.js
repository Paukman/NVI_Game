import dayjs from "dayjs";
import { upperFirst } from "lodash";

const formatAmount = amount => {
  let generalizedAmount;
  const floatAmount = parseFloat(amount.replace(/\$|,/g, ""));
  if (floatAmount < 1) {
    generalizedAmount = 1;
  } else {
    const parsedAmount = parseInt(amount.replace(/\$|,/g, ""), 0);
    generalizedAmount = Number.isNaN(parsedAmount) ? 0 : parsedAmount;
  }
  return generalizedAmount;
};

const getRecurranceLimit = (isOneTime, numberOfTxns) => {
  let recurranceLimit = 0;
  if (!isOneTime) {
    const numOfPayments = parseInt(numberOfTxns, 0);
    recurranceLimit = Number.isNaN(numOfPayments) ? 0 : numOfPayments;
  }
  return recurranceLimit;
};

const formatTransactionDaysInFuture = transactionDate => {
  const dateToCompare = dayjs(transactionDate).startOf("day");
  const today = dayjs().startOf("day");
  return Math.abs(dateToCompare.diff(today, "day"));
};

const formatRecurranceEndDate = date =>
  date ? dayjs(date).format("MM/DD/YY") : "N/A";

export const mapBillPayment = state => {
  const isOneTime = !state.starting;
  const fromAccount = state.fromAccounts.find(
    account => account.id === state.from
  );

  const transactionDaysInFuture = formatTransactionDaysInFuture(
    isOneTime ? state.when : state.starting
  );
  const recurranceEndDate = formatRecurranceEndDate(state.reviewEnding);

  return {
    fromAccountType: fromAccount.subType,
    fromAccountSubCode: fromAccount.subProductCode,
    fromCurrencyCode: state.fromCurrency,
    toAccountSubCode: "N/A",
    toAccountType: "N/A",
    toCurrencyCode: state.toCurrency,
    transactionAmount: formatAmount(state.amount),
    transactionDaysInFuture,
    isRecurringTransfer: !isOneTime,
    recurranceInterval: isOneTime
      ? "N/A"
      : upperFirst(state.frequency.toLowerCase()),
    recurranceEndDate,
    recurranceLimit: getRecurranceLimit(
      isOneTime,
      state.reviewNumberOfPayments
    ),
    isMemo: false, // Bill payments do not have a memo/message field.
    isBeta: false
  };
};

export const mapTransfer = state => {
  const isOneTime = !state.starting;
  const fromAccount = state.fromAccounts.find(
    account => account.id === state.from
  );
  const toAccount = state.toAccounts.find(account => account.id === state.to);

  const transactionDaysInFuture = formatTransactionDaysInFuture(
    isOneTime ? state.when : state.starting
  );
  const recurranceEndDate = formatRecurranceEndDate(state.reviewEnding);

  return {
    fromAccountType: fromAccount.subType,
    fromAccountSubCode: fromAccount.subProductCode,
    fromCurrencyCode: state.fromCurrency,
    toAccountType: toAccount.subType,
    toAccountSubCode: toAccount.subProductCode,
    toCurrencyCode: state.toCurrency,
    transactionAmount: formatAmount(state.amount),
    transactionDaysInFuture,
    isRecurringTransfer: !isOneTime,
    recurranceInterval: isOneTime
      ? "N/A"
      : upperFirst(state.frequency.toLowerCase()),
    recurranceEndDate,
    recurranceLimit: getRecurranceLimit(
      isOneTime,
      state.reviewNumberOfTransfers
    ),
    isMemo: false, // Transfers do not have a memo/message field.
    isBeta: false
  };
};

export const mapETransferSend = state => {
  const fromAccount = state.withdrawalAccounts.find(
    account => account.id === state.from.id
  );
  return {
    fromAccountType: fromAccount.subType,
    fromAccountSubCode: fromAccount.subProductCode,
    fromCurrencyCode: fromAccount.currency,
    toAccountType: "N/A", // We are sending money to a recipient.
    toAccountSubCode: "N/A",
    toCurrencyCode: "N/A",
    transactionAmount: formatAmount(state.amount),
    transactionDaysInFuture: 0,
    isRecurringTransfer: false,
    recurranceInterval: "N/A",
    recurranceEndDate: "N/A",
    recurranceLimit: 0,
    isMemo: !!state.message,
    isBeta: false
  };
};

export const mapETransferRequest = state => {
  // 'withdrawalAccounts' contains the account to deposit into.
  const toAccount = state.withdrawalAccounts.find(
    account => account.id === state.to.id
  );
  return {
    fromAccountType: "N/A", // We are requesting money from a recipient.
    fromAccountSubCode: "N/A",
    fromCurrencyCode: "N/A",
    toAccountType: toAccount.subType,
    toAccountSubCode: toAccount.subProductCode,
    toCurrencyCode: toAccount.currency,
    transactionAmount: formatAmount(state.amount),
    transactionDaysInFuture: 0,
    isRecurringTransfer: false,
    recurranceInterval: "N/A",
    recurranceEndDate: "N/A",
    recurranceLimit: 0,
    isMemo: !!state.message,
    isBeta: false
  };
};
