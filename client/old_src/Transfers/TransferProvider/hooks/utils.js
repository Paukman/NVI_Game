import React from "react";
import dayjs from "dayjs";
import { isEqual, uniqWith } from "lodash";
import accountIcon from "assets/icons/FromAccount/account.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import recurringIcon from "assets/icons/Recurring/recurring.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import endingIcon from "assets/icons/End Date/end-date.svg";
import foreignExchange from "assets/icons/ForeignExchange/foreign-exchange.svg";

import { transferErrors } from "utils/MessageCatalog";
import { accountsBaseUrl, asyncResolver, manualApiFetch } from "api";
import {
  findByBankAccount,
  unFormatCurrency,
  setPeriodFrequency,
  getDayWithinPeriod,
  formatCurrency
} from "utils";
import {
  TRASFER_IMMEDIATE_FROM_ACCOUNTS,
  TRASFER_FUTURE_DATED_FROM_ACCOUNTS,
  TRASFER_RECURRING_FROM_ACCOUNTS,
  TRASFER_TO_ACCOUNTS
} from "utils/store/storeSchema";
import {
  getNumberOfPaymentsForDates,
  getEndDateForNumberOfPayments
} from "BillPayment/BillPaymentProvider/hooks/utils";
import {
  endingOptions,
  recurringFrequency,
  primaryOptions,
  divider,
  EXCHANGE_RATE_TITLE,
  EXCHANGE_RATE_TEXT
} from "../../constants";
import { frequencyOptions } from "../../RecurringTransfer/constants";
import { initialState as initialStateOneTime } from "./useOneTimeReducer";
import { initialState as initialStateRecurring } from "./useRecurringReducer";

export const oneTimeImmediateTransferFromUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=ImmediateTransferFrom`;
export const oneTimeFutureDatedTransferFromUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=SingleFutureDatedTransferFrom`;
export const recurringTransferFromUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=RecurringTransferFrom`;
export const transfersToUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=TransferTo`;

export const getFormattedAccounts = accountsArray => {
  if (!accountsArray || accountsArray.length === 0) {
    return [];
  }

  return accountsArray.map(account => ({
    text: `${account.nickname ? account.nickname : account.name} (${
      account.number
    }) | ${formatCurrency(account.availableBalance.value)} ${account.currency}`,
    key: account.id,
    value: account.id
  }));
};

export const prepareCancelReviewMessage = state => {
  let message = <></>;
  if (!state) {
    return message;
  }
  const from =
    state.fromAccountsFormatted && state.from
      ? state.fromAccountsFormatted.filter(
          selected => selected.key === state.from
        )[0] || null
      : null;
  const to =
    state.toAccountsFormatted && state.to
      ? state.toAccountsFormatted.filter(
          selected => selected.key === state.to
        )[0] || null
      : null;

  if (from && to && state.amount) {
    message = transferErrors.MSG_RBTR_008(from.text, to.text, state.amount);
  }
  return message;
};

export const loadOneTimeImmediateTransferFromAccounts = async url =>
  manualApiFetch(url, TRASFER_IMMEDIATE_FROM_ACCOUNTS);

export const loadOneTimeFutureDatedTransferFromAccounts = async url =>
  manualApiFetch(url, TRASFER_FUTURE_DATED_FROM_ACCOUNTS);

export const loadRecurringTransferFromAccounts = async url =>
  manualApiFetch(url, TRASFER_RECURRING_FROM_ACCOUNTS);

export const loadTransfersToAccounts = async url =>
  manualApiFetch(url, TRASFER_TO_ACCOUNTS);

export const loadData = async () => {
  const {
    oneTimeImmediateTransferFromAccounts,
    oneTimeFutureDatedTransferFromAccounts,
    recurringTransferFromAccounts,
    transfersToAccounts
  } = await asyncResolver([
    {
      fn: loadOneTimeImmediateTransferFromAccounts,
      args: oneTimeImmediateTransferFromUrl,
      key: "oneTimeImmediateTransferFromAccounts"
    },
    {
      fn: loadOneTimeFutureDatedTransferFromAccounts,
      args: oneTimeFutureDatedTransferFromUrl,
      key: "oneTimeFutureDatedTransferFromAccounts"
    },
    {
      fn: loadRecurringTransferFromAccounts,
      args: recurringTransferFromUrl,
      key: "recurringTransferFromAccounts"
    },
    {
      fn: loadTransfersToAccounts,
      args: transfersToUrl,
      key: "transfersToAccounts"
    }
  ]);

  if (
    oneTimeImmediateTransferFromAccounts.error ||
    oneTimeFutureDatedTransferFromAccounts.error ||
    recurringTransferFromAccounts.error ||
    transfersToAccounts.error
  ) {
    // This error message is not being used for now,
    // a generic message is instead shown by useGenericErrorModal
    throw Error("Error fetching account information");
  }

  const toAccounts = transfersToAccounts.result?.value || [];

  const immediateTransferFromAccounts =
    oneTimeImmediateTransferFromAccounts.result?.value || [];
  const futureDatedTransferFromAccounts =
    oneTimeFutureDatedTransferFromAccounts.result?.value || [];

  const recurringFromAccounts =
    recurringTransferFromAccounts.result?.value || [];
  const oneTimeFromAccounts = uniqWith(
    [...immediateTransferFromAccounts, ...futureDatedTransferFromAccounts],
    isEqual
  );

  const dataOneTime = {
    fromAccounts: oneTimeFromAccounts,
    toAccounts,
    immediateTransferAccounts: immediateTransferFromAccounts,
    futureDatedTransferAccounts: futureDatedTransferFromAccounts,
    recurringAccounts: recurringFromAccounts
  };
  const dataRecurring = {
    fromAccounts: recurringFromAccounts,
    toAccounts,
    immediateTransferAccounts: immediateTransferFromAccounts,
    futureDatedTransferAccounts: futureDatedTransferFromAccounts,
    recurringAccounts: recurringFromAccounts
  };

  return { dataOneTime, dataRecurring };
};

export const getToOrFromAccountMessage = (from, to) => {
  let toFromAccountVisibility = false;
  let message = "";

  if (from?.text && to?.text) {
    if (
      to.text.includes("Daily Interest Account") ||
      to.text.includes("Builder Account")
    ) {
      message = transferErrors.MSG_RBTR_044;
      toFromAccountVisibility = true;
    } else if (to.text.includes("Tax-Free Saver Account")) {
      message = transferErrors.MSG_RBTR_044B;
      toFromAccountVisibility = true;
    } else if (from.text.includes("Tax-Free Saver Account")) {
      message = transferErrors.MSG_RBTR_045;
      toFromAccountVisibility = true;
    }
  }

  return {
    visible: toFromAccountVisibility,
    message
  };
};

export const prepareOneTimeDataForReview = state => {
  if (state && state.fromAccountsFormatted && state.toAccountsFormatted) {
    const from =
      state.fromAccountsFormatted.filter(
        account => account.key === state.from
      )[0] || null;
    const to =
      state.toAccountsFormatted.filter(
        account => account.key === state.to
      )[0] || null;

    if (from && to) {
      let amountTitle = "Amount";
      let showExchangeFields = false;
      const exchangeDisclosure =
        "By verifying the transaction details, you confirm that you agree to both the exchange rate indicated and to the funds being transferred or to the payment being made.";

      if (
        state.fromCurrency &&
        state.toCurrency &&
        state.fromCurrency !== state.toCurrency
      ) {
        amountTitle = "From amount";
        showExchangeFields = true;
      }
      const reviewData = {
        From: {
          visible: true,
          imageIcon: accountIcon,
          title: "From",
          label: from.text
        },
        DownArrow: {
          visible: true,
          imageIcon: downArrowIcon
        },
        To: {
          visible: true,
          imageIcon: accountIcon,
          title: "To",
          label: to.text
        },
        Amount: {
          visible: true,
          imageIcon: moneyIcon,
          title: amountTitle,
          label: showExchangeFields
            ? `${state.amount} ${state.fromCurrency}`
            : state.amount
        },
        AmountTo: {
          visible: showExchangeFields,
          imageIcon: moneyIcon,
          title: "To amount",
          label: showExchangeFields
            ? `${state.amountTo} ${state.toCurrency}`
            : state.amountTo
        },
        ExchangeRate: {
          visible: showExchangeFields,
          imageIcon: foreignExchange,
          title: EXCHANGE_RATE_TITLE,
          label: state.exchangeRateFormatted
        },
        ExchangeRateMessage: {
          visible: showExchangeFields,
          textOnly: EXCHANGE_RATE_TEXT
        },
        When: {
          visible: true,
          imageIcon: calendarIcon,
          title: "When",
          label: dayjs(state.when, "MMM DD, YYYY").format("MMM DD, YYYY")
        },
        Message: showExchangeFields
          ? {
              visible: true,
              message: exchangeDisclosure
            }
          : getToOrFromAccountMessage(from, to)
      };

      const completeData = {
        ...reviewData,
        ExchangeRateMessage: { visible: false },
        Message: getToOrFromAccountMessage(from, to)
      };
      return { reviewData, completeData };
    }
  }
  return null;
};

export const prepareOneTimeDataToPost = state => {
  let body = {};
  if (state.from) {
    const startDate = dayjs(state.when, "MMM DD, YYYY").format("YYYY-DD-MM");
    const today = dayjs().format("YYYY-DD-MM");
    if (startDate === today) {
      if (
        state.fromCurrency &&
        state.toCurrency &&
        state.toCurrency !== state.fromCurrency
      ) {
        body = {
          // to part
          amount: {
            value: parseFloat(unFormatCurrency(state.amountTo)).toFixed(2),
            currency: state.toCurrency
          },
          transferType: "Immediate",
          fromAccountId: state.from,
          toAccountId: state.to,
          // from part
          netAmount: {
            value: parseFloat(unFormatCurrency(state.amount)),
            currency: state.fromCurrency
          }
        };
      } else {
        body = {
          amount: {
            value: parseFloat(unFormatCurrency(state.amount)),
            currency: state.fromCurrency
          },
          transferType: "Immediate",
          fromAccountId: state.from,
          toAccountId: state.to
        };
      }
    } else if (startDate !== today) {
      body = {
        amount: {
          value: parseFloat(unFormatCurrency(state.amount)),
          currency: state.fromCurrency
        },
        transferType: "FutureDated",
        fromAccountId: state.from,
        toAccountId: state.to,
        memo: "",
        transferDate: dayjs(state.when, "MMM DD, YYYY").format("YYYY-MM-DD")
      };
    }
  }
  return body;
};

export const prepareTransferErrorMessage = (state, error) => {
  let message = <></>;
  if (!state || !error) {
    return message;
  }
  if (state.toAccountsFormatted && state.to) {
    const toAccount =
      state.toAccountsFormatted.filter(
        selected => selected.key === state.to
      )[0] || null;

    if (toAccount) {
      message = transferErrors.MSG_RBTR_005(toAccount.text, error.message);
    }
  }
  return message;
};

export const getFrequencyOption = frequency => {
  return (
    frequencyOptions.filter(option => option.value === frequency)[0] || null
  );
};

export const prepareRecurringDataForReview = data => {
  if (data) {
    const from =
      data.state.fromAccounts.filter(
        selected => selected.key === data.state.from
      )[0] || null;
    const to =
      data.state.toAccounts.filter(
        selected => selected.key === data.state.to
      )[0] || null;

    if (from && to) {
      return {
        From: {
          visible: true,
          imageIcon: accountIcon,
          title: "From",
          label: from.text
        },
        DownArrow: {
          visible: true,
          imageIcon: downArrowIcon
        },
        To: {
          visible: true,
          imageIcon: accountIcon,
          title: "To",
          label: to.text
        },
        Amount: {
          visible: true,
          imageIcon: moneyIcon,
          title: "Amount",
          label: data.state.amount // formatCurrency(data.amount)
        },
        Frequency: {
          visible: true,
          imageIcon: frequencyIcon,
          title: "Frequency",
          label: data.state.frequency // capitalize(data.frequency)
        },
        Starting: {
          visible: true,
          imageIcon: calendarIcon,
          title: "Starting",
          label: dayjs(data.state.starting).format("MMM DD, YYYY")
        },
        Ending: {
          visible: true,
          imageIcon: endingIcon,
          title: "Ending",
          label: `${
            data.state.endingOption === endingOptions.never
              ? "Never"
              : dayjs(data.state.reviewEnding).format("MMM DD, YYYY")
          }`
        },
        NumOfTransfers: {
          visible: !(data.state.endingOption === endingOptions.never),
          imageIcon: recurringIcon,
          title: "Number of transfers",
          label: data.state.reviewNumberOfTransfers
        },
        Message: getToOrFromAccountMessage(from, to)
      };
    }
  }
  return null;
};

export const prepareRecurringDataToPost = state => {
  if (!state) {
    return {};
  }
  let body = {};
  let periodUnit = "";
  switch (state.frequency) {
    case recurringFrequency.biweekly:
    case recurringFrequency.weekly: {
      periodUnit = "Week";
      break;
    }
    case recurringFrequency.monthly:
    case recurringFrequency.yearly: {
      periodUnit = "Month";
      break;
    }
    default:
      break;
  }

  let lastExecutionDate = "";
  if (state.endingOption === endingOptions.never) {
    lastExecutionDate = undefined;
  } else {
    lastExecutionDate = dayjs(state.reviewEnding, "MMM DD, YYYY").format(
      "YYYY-MM-DD"
    );
  }
  if (state.from && state.to) {
    body = {
      amount: {
        value: parseFloat(unFormatCurrency(state.amount)),
        currency: state.fromCurrency
      },
      transferType: "Recurring",
      fromAccountId: state.from,
      toAccountId: state.to,
      memo: "",
      executionCycle: {
        startingDate: dayjs(state.starting, "MMM DD, YYYY").format(
          "YYYY-MM-DD"
        ),
        dayWithinPeriod: getDayWithinPeriod(state.starting, state.frequency),
        nextExecutionDate: undefined,
        lastExecutionDate,
        periodFrequency: setPeriodFrequency(state),
        periodUnit
      }
    };
  }
  return body;
};

export const getEndDateNoOfTransfersMessage = state => {
  if (!state) {
    return "";
  }
  let message = "";

  switch (state.endingOption) {
    case endingOptions.endDate: {
      const noOfTransfers = getNumberOfPaymentsForDates(
        state.starting,
        state.ending,
        state.frequency
      );
      if (noOfTransfers !== "") {
        message = `Number of transfers: ${noOfTransfers}`;
      }
      break;
    }
    case endingOptions.numberOfTransfers: {
      const endDate = getEndDateForNumberOfPayments(
        state.starting,
        state.frequency,
        state.numberOfTransfers
      );
      if (endDate !== "") {
        message = `End date: ${endDate}`;
      }
      break;
    }
    case endingOptions.never:
    default:
      break;
  }

  return message;
};

export const getValueToPersist = ({ name, value }, state) => {
  switch (name) {
    case "from":
      // Reset `from` field if accountId is not found
      return state?.fromAccounts?.some(({ id }) => id === value) ? value : "";
    default:
      return value;
  }
};

export const persistDataBetweenForms = (
  { name, value },
  oneTime,
  recurring
) => {
  if (Object.keys(initialStateOneTime).includes(name)) {
    oneTime.onChange({
      name,
      value: getValueToPersist({ name, value }, oneTime.oneTimeState)
    });
  }
  if (Object.keys(initialStateRecurring).includes(name)) {
    recurring.onChange({
      name,
      value: getValueToPersist({ name, value }, recurring.recurringState)
    });
  }
};

export const handleOnSendAnotherTransferOneTime = (oneTime, recurring) => {
  oneTime.onSendAnotherTransfer();
  recurring.onCleanForm();
};

export const handleOnSendAnotherTransferRecurring = (oneTime, recurring) => {
  recurring.onSendAnotherTransfer();
  oneTime.onCleanForm();
};

export const futureDateCrossCurrency = (state, name, value) => {
  if (!name || !value) {
    return false;
  }

  const validateParameters = { ...state };
  let currentAccount = null;
  let isDifferentCurrency = false;
  let accountName = null;
  let message = null;
  if (name === "from") {
    validateParameters.from = value;
    currentAccount = state.fromAccounts.find(account => account.id === value);
    accountName = currentAccount ? currentAccount.name : undefined;
    validateParameters.fromCurrency = currentAccount.currency;
    isDifferentCurrency =
      currentAccount.currency !== validateParameters.toCurrency;
    message = transferErrors.MSG_RBTR_026_MODAL(accountName);
  } else if (name === "to") {
    validateParameters.to = value;
    currentAccount = state.toAccounts.find(account => account.id === value);
    accountName = currentAccount ? currentAccount.name : undefined;
    validateParameters.toCurrency = currentAccount.currency;
    isDifferentCurrency =
      currentAccount.currency !== validateParameters.fromCurrency;
    message = transferErrors.MSG_RBTR_026_MODAL(accountName);
  } else if (name === "when") {
    validateParameters.when = value;
    isDifferentCurrency =
      validateParameters.toCurrency !== validateParameters.fromCurrency;
    message = transferErrors.MSG_RBTR_015();
  }

  return {
    isFutureDatedCrossCurrency:
      validateParameters.from !== "" &&
      validateParameters.fromCurrency !== "" &&
      validateParameters.to !== "" &&
      validateParameters.toCurrency !== "" &&
      isDifferentCurrency &&
      validateParameters.when &&
      validateParameters.when.isAfter(dayjs()),
    message
  };
};

export const notSupportedFutureDatedTransfer = (state, name, value) => {
  if (!name || !value) {
    return false;
  }

  switch (name) {
    case "from": {
      if (
        !state.futureDatedTransferAccounts ||
        state.futureDatedTransferAccounts.length === 0 ||
        !state.when.isAfter(dayjs())
      ) {
        return false;
      }

      const filteredAccounts = state.futureDatedTransferAccounts.filter(
        account => account.id === value
      );
      if (filteredAccounts.length <= 0) {
        return true;
      }
      return false;
    }
    case "when": {
      if (
        !state.futureDatedTransferAccounts ||
        state.futureDatedTransferAccounts.length === 0 ||
        !value.isAfter(dayjs())
      ) {
        return false;
      }

      let filteredFromAccounts = [];

      if (state.from) {
        filteredFromAccounts = state.futureDatedTransferAccounts.filter(
          account => account.id === state.from
        );
      }

      if (state.from && filteredFromAccounts.length < 1) {
        return true;
      }
      return false;
    }
    default: {
      return false;
    }
  }
};

export const removeSelectedAccount = (accounts, selectedAccount) => {
  let array = [];
  if (accounts && accounts.length) {
    array = accounts;
    array = array.filter(acct => acct.id !== selectedAccount);
  }
  return array;
};

export const getEligibleFormattedAccounts = (
  accounts,
  eligibleAccountIds,
  primaryAccountCurrency
) => {
  let finalizedList = [];

  if (accounts && accounts.length && eligibleAccountIds) {
    // not sure if this could happen, but just cover it anyway...
    if (eligibleAccountIds.length === 0) {
      eligibleAccountIds = [];
    }

    // get eligible and non eligible accounts
    // For Recurring transfer accounts with different currency will be ineligible
    const eligibleAcccunts = primaryAccountCurrency
      ? accounts.filter(
          account =>
            eligibleAccountIds.includes(account.id) &&
            account.currency === primaryAccountCurrency
        )
      : accounts.filter(account => eligibleAccountIds.includes(account.id));

    const nonEligibleAccounts = primaryAccountCurrency
      ? accounts.filter(
          account =>
            !eligibleAccountIds.includes(account.id) ||
            account.currency !== primaryAccountCurrency
        )
      : accounts.filter(account => !eligibleAccountIds.includes(account.id));

    // filter for currency
    const eligible = getFormattedAccounts(eligibleAcccunts);
    let nonEligible = getFormattedAccounts(nonEligibleAccounts);

    // add disabled flag to non eligible
    nonEligible = nonEligible.map(item => ({
      ...item,
      disabled: true
    }));

    finalizedList = nonEligible.length
      ? eligible.concat(divider).concat(nonEligible)
      : eligible;
  }

  return finalizedList;
};

export const getCurrencies = (state, name, value) => {
  let { fromCurrency, toCurrency } = state; // state is always available
  let isDisplayedToAmount = false;
  if ((name === "from" || name === "to") && value) {
    if (name === "from" && state.fromAccounts && state.fromAccounts.length) {
      fromCurrency = state.fromAccounts.find(account => account.id === value)
        .currency;
    }
    if (name === "to" && state.toAccounts && state.toAccounts.length) {
      toCurrency = state.toAccounts.find(account => account.id === value)
        .currency;
    }
    if (fromCurrency && toCurrency && fromCurrency !== toCurrency) {
      isDisplayedToAmount = true;
    }
  }

  return {
    fromCurrency,
    toCurrency,
    isDisplayedToAmount
  };
};

export const getInitialTransferAccounts = (state, { from, to }) => {
  const fromAccount = findByBankAccount(from, state.fromAccounts);
  const toAccount = findByBankAccount(to, state.toAccounts);

  return {
    from: fromAccount?.id,
    to: toAccount?.id
  };
};

export const updateAccountsForEligibility = (
  state,
  name,
  value,
  isRecurring
) => {
  let {
    primary,
    to,
    from,
    fromAccountsFormatted,
    toAccountsFormatted,
    isDisplayedToAmount
  } = state;
  let currentAccount;
  let { fromCurrency, toCurrency } = state; // state is always available

  if (window.location.pathname.includes("recurring")) {
    const currencies = getCurrencies(state, name, value);
    ({ fromCurrency, toCurrency } = currencies);
  }

  if (name === "from") {
    if (primary === primaryOptions.notSelected) {
      primary =
        value !== "" && state.to === ""
          ? primaryOptions.selectedFrom
          : primaryOptions.selectedTo;
    }

    if (primary === primaryOptions.selectedFrom) {
      if (state && state.fromAccounts && state.fromAccounts.length) {
        currentAccount = state.fromAccounts.filter(acct => acct.id === value);
        if (currentAccount && currentAccount.length) {
          toAccountsFormatted = getEligibleFormattedAccounts(
            removeSelectedAccount(state.toAccounts, value),
            currentAccount[0].eligibleToAccounts,
            isRecurring ? currentAccount[0].currency : null
          );

          if (
            !currentAccount[0].eligibleToAccounts.some(
              acct => acct === state.to
            ) ||
            (state.to && state.from && fromCurrency !== toCurrency)
          ) {
            to = "";
            isDisplayedToAmount = false;
          }
        }
      }
    } else {
      const reducedToAccounts = removeSelectedAccount(state.toAccounts, value);
      toAccountsFormatted = getFormattedAccounts(reducedToAccounts);
    }
  }

  if (name === "to") {
    // on initial selection for 'to'
    // if 'from' is already empty then primary is selectedTo
    if (primary === primaryOptions.notSelected) {
      primary =
        value !== "" && state.from === ""
          ? primaryOptions.selectedTo
          : primaryOptions.selectedFrom;
    }

    if (primary === primaryOptions.selectedTo) {
      if (state && state.toAccounts && state.toAccounts.length) {
        currentAccount = state.toAccounts.filter(acct => acct.id === value);
        if (currentAccount && currentAccount.length) {
          fromAccountsFormatted = getEligibleFormattedAccounts(
            removeSelectedAccount(state.fromAccounts, value),
            currentAccount[0].eligibleFromAccounts,
            isRecurring ? currentAccount[0].currency : null
          );

          if (
            !currentAccount[0].eligibleFromAccounts.some(
              acct => acct === state.from
            ) ||
            (state.to && state.from && fromCurrency !== toCurrency)
          ) {
            from = "";
            isDisplayedToAmount = false;
          }
        }
      }
    } else {
      const reducedFromAccounts = removeSelectedAccount(
        state.fromAccounts,
        value
      );
      fromAccountsFormatted = getFormattedAccounts(reducedFromAccounts);
    }
  }

  const updatedState = {
    primary,
    fromAccountsFormatted,
    toAccountsFormatted,
    to,
    from,
    isDisplayedToAmount,
    fromCurrency,
    toCurrency
  };
  return updatedState;
};

export const prepareDataForExchangeAPICall = (
  fieldToUpdate,
  exchangeAmount,
  fromCurrency,
  toCurrency
) => {
  const amount = parseFloat(unFormatCurrency(exchangeAmount)).toFixed(2);

  return {
    fromAmount: fieldToUpdate === "amount" ? null : amount,
    toAmount: fieldToUpdate === "amount" ? amount : null,
    fromCurrency,
    toCurrency
  };
};

export const prepareTransferSuccessMessage = state => {
  let message = "";
  if (!state) {
    return message;
  }
  if (state.to) {
    const toAccount =
      state.toAccounts.find(selected => selected.id === state.to) || null;

    if (toAccount) {
      const accountToDisplay = toAccount.nickname
        ? `${toAccount.name}/${toAccount.nickname}`
        : toAccount.name;
      message = transferErrors.MSG_RBTR_004(accountToDisplay);
    }
  }

  return message;
};

export const isToAccountValid = state => {
  let message = null;
  if (!state) {
    return message;
  }
  if (
    state.to &&
    state.toAccounts?.length &&
    Object.keys(state.preparedDataForPost).length > 0
  ) {
    const toAccount = state.toAccounts.find(account => account.id === state.to);
    const { amount } = state.preparedDataForPost;

    if (toAccount.type === "Loan" && toAccount.balance.value === 0) {
      message = transferErrors.MSG_RBTR_046();
    } else if (
      toAccount.type === "Loan" &&
      amount.value > toAccount.balance.value
    ) {
      message = transferErrors.MSG_RBTR_047();
    }
  }
  return message;
};
