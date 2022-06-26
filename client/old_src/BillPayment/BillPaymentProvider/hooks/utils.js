import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { billPaymentErrors } from "utils/MessageCatalog";
import accountIcon from "assets/icons/FromAccount/account.svg";
import downArrowIcon from "assets/icons/DownArrow/arrow_down.svg";
import payBillIcon from "assets/icons/PayBill/pay-bill.svg";
import moneyIcon from "assets/icons/Money/money.svg";
import calendarIcon from "assets/icons/Calendar/calendar.svg";
import noteIcon from "assets/icons/Note/note.svg";
import recurringIcon from "assets/icons/Recurring/recurring.svg";
import frequencyIcon from "assets/icons/Frequency/frequency.svg";
import endingIcon from "assets/icons/End Date/end-date.svg";
import foreignExchange from "assets/icons/ForeignExchange/foreign-exchange.svg";
import {
  BILL_PAYMENT_IMMEDIATE_ACCOUNTS,
  BILL_PAYMENT_PAYEES,
  BILL_PAYMENT_RECURRING_ACCOUNTS
} from "utils/store/storeSchema";
import {
  findByBankAccount,
  unFormatCurrency,
  setPeriodFrequency,
  getDayWithinPeriod,
  getFormattedPayees,
  formatCurrency
} from "utils";
import { validateInvalidDate } from "utils/formValidationUtils";
import {
  accountsBaseUrl,
  asyncResolver,
  billPaymentsBaseUrl,
  manualApiFetch
} from "api";
import {
  endingOptions,
  paymentType,
  recurringFrequency,
  primaryOptions
} from "../../constants";

import {
  EXCHANGE_RATE_TITLE,
  EXCHANGE_RATE_TEXT,
  divider
} from "../../../Transfers/constants";
import { initialState as initialStateOneTime } from "./useOneTimeReducer";
import { initialState as initialStateRecurring } from "./useRecurringReducer";

import { getFormattedAccounts } from "../../../Transfers/TransferProvider/hooks/utils";

import { ADD_PAYEE } from "./constants";

export const immediatePayBillsFromUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=ImmediatePayBillsFrom`;
export const recurringPayBillsFromUrl = `${accountsBaseUrl}/sortedEligibleAccounts?feature=RecurringPayBillsFrom`;
export const billPayeesUrl = `${billPaymentsBaseUrl}/payees`;
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const getDateDifference = props => {
  if (!props) {
    return "";
  }
  const { endingDate, startingDate, duration, isBiweekly = false } = props;

  if (!endingDate || !startingDate || !duration) {
    return "";
  }
  if (!validateInvalidDate(endingDate) || !validateInvalidDate(startingDate)) {
    return "";
  }
  if (duration !== "week" && duration !== "month" && duration !== "year") {
    return "";
  }

  let difference = dayjs(endingDate).diff(startingDate, duration) + 1;
  if (isBiweekly) {
    difference = Math.round(difference / 2);
  }
  return difference;
};

export const getEndDateForNumberOfPayments = (
  startingDate,
  frequency,
  noOfPayments
) => {
  if (
    !startingDate ||
    !frequency ||
    !noOfPayments ||
    noOfPayments <= 0 ||
    !dayjs(startingDate).isValid()
  )
    return "";

  switch (frequency) {
    case "weekly":
      return dayjs(startingDate)
        .add(noOfPayments - 1, "week")
        .format("MMM DD, YYYY");
    case "biweekly":
      return dayjs(startingDate)
        .add(2 * (noOfPayments - 1), "week")
        .format("MMM DD, YYYY");
    case "monthly":
      return dayjs(startingDate)
        .add(noOfPayments - 1, "month")
        .format("MMM DD, YYYY");
    case "yearly":
      return dayjs(startingDate)
        .add(noOfPayments - 1, "year")
        .format("MMM DD, YYYY");
    default:
      return "";
  }
};

export const getNumberOfPaymentsForDates = (starting, ending, frequency) => {
  let noOfPaymentsBetweenDates = "";
  if (!ending || !frequency || !starting) return noOfPaymentsBetweenDates;

  const endingDate = dayjs(ending).format("YYYY-MM-DD");
  const startingDate = dayjs(starting).format("YYYY-MM-DD");

  if (endingDate < startingDate) return noOfPaymentsBetweenDates;

  switch (frequency) {
    case "weekly":
      noOfPaymentsBetweenDates = getDateDifference({
        endingDate,
        startingDate,
        duration: "week"
      });
      break;
    case "biweekly":
      noOfPaymentsBetweenDates = getDateDifference({
        endingDate,
        startingDate,
        duration: "week",
        isBiweekly: true
      });
      break;
    case "monthly":
      noOfPaymentsBetweenDates = getDateDifference({
        endingDate,
        startingDate,
        duration: "month"
      });
      break;
    case "yearly":
      noOfPaymentsBetweenDates = getDateDifference({
        endingDate,
        startingDate,
        duration: "year"
      });
      break;
    default:
      return noOfPaymentsBetweenDates;
  }
  return noOfPaymentsBetweenDates;
};

export const getEndDateNoOfPaymentsMessage = state => {
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
        message = `Number of payments: ${noOfTransfers}`;
      }
      break;
    }
    case endingOptions.numberOfPayments: {
      const endDate = getEndDateForNumberOfPayments(
        state.starting,
        state.frequency,
        state.numberOfPayments
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

export const getPaymentMessage = now => {
  // REB-15361: From 8PM MT until just before midnight, show the message that
  // the payment will be processed next business day

  // now should be an ISO-8601 UTC string if passed in. If now is not passed in,
  // default to current datetime.
  const currentTime = now ? dayjs(now).utc() : dayjs();
  const hour = currentTime.tz("America/Edmonton").hour();
  return hour < 20
    ? { visible: false, message: "" }
    : { visible: true, message: billPaymentErrors.MSG_RBBP_003 };
};

export const prepareRecurringDataToPost = state => {
  if (!state?.to || !state?.from) {
    return null;
  }
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

  return {
    billPayeeId: state.to,
    isCreditCard: false, // TBD check for Credit Card
    sourceAccountId: state.from,
    amount: {
      value: parseFloat(unFormatCurrency(state.amount)),
      currency: state.fromCurrency
    },
    memo: state.note,
    paymentType: paymentType.recurring,
    // this should be ignored for recurring payments
    paymentDate: dayjs(state.starting, "MMM DD, YYYY").format("YYYY-MM-DD"),
    executionCycle: {
      startingDate: dayjs(state.starting, "MMM DD, YYYY").format("YYYY-MM-DD"),
      dayWithinPeriod: getDayWithinPeriod(state.starting, state.frequency),
      nextExecutionDate: undefined,
      lastExecutionDate,
      periodFrequency: setPeriodFrequency(state),
      periodUnit
    }
  };
};

export const prepareRecurringDataForReview = data => {
  if (data) {
    const from =
      data.state.fromAccounts.filter(
        selected => selected.key === data.state.from
      )[0] || null;
    const to =
      data.state.billPayees.filter(
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
          imageIcon: payBillIcon,
          title: "To",
          label: to.text
        },
        Amount: {
          visible: true,
          imageIcon: moneyIcon,
          title: "Amount",
          label: data.state.amount
        },
        Frequency: {
          visible: true,
          imageIcon: frequencyIcon,
          title: "Frequency",
          label: data.state.frequency
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
        NumberOf: {
          visible: !(data.state.endingOption === endingOptions.never),
          imageIcon: recurringIcon,
          title: "Number of payments",
          label: data.state.reviewNumberOfPayments
        },
        Note: {
          visible: data.state.note !== "",
          imageIcon: noteIcon,
          title: "Note",
          label: data.state.note
        },
        Message: getPaymentMessage()
      };
    }
  }
  return null;
};

export const getCurrencies = (state, name, value) => {
  let { fromCurrency, toCurrency } = state; // state is always available
  if (name === "from" && state.fromAccounts && state.fromAccounts.length) {
    fromCurrency =
      state.fromAccounts.find(account => account.id === value)?.currency || "";
  }
  if (name === "to" && state.billPayees && state.billPayees.length) {
    const toAccount = state.billPayees.find(
      billPayee => billPayee.billPayeeId === value
    );
    if (toAccount) {
      toCurrency = toAccount?.ATBMastercardCurrency || "CAD";
    }
  }
  const isDisplayedToAmount =
    fromCurrency && toCurrency && fromCurrency !== toCurrency;

  return {
    fromCurrency,
    toCurrency,
    isDisplayedToAmount
  };
};

export const getFutureDateCrossCurrencyError = (state, name, value) => {
  if (!name || !value) {
    return null;
  }
  const validateParameters = { ...state };
  let isDifferentCurrency = false;
  let message = null;
  if (name === "from") {
    validateParameters.from = value;
    const fromAccount = state.fromAccounts.find(
      account => account.id === value
    );
    validateParameters.fromCurrency = fromAccount?.currency;
    isDifferentCurrency =
      fromAccount?.currency !== validateParameters.toCurrency;
    message = billPaymentErrors.MSG_RBBP_036_MODAL();
  } else if (name === "to") {
    validateParameters.to = value;
    const toAccount = state.billPayees.find(
      billPayee => billPayee.billPayeeId === value
    );
    validateParameters.toCurrency = toAccount?.ATBMastercardCurrency || "CAD";
    isDifferentCurrency =
      validateParameters.toCurrency !== validateParameters.fromCurrency;
    message = billPaymentErrors.MSG_RBBP_036_MODAL();
  } else if (name === "when") {
    validateParameters.when = value;
    isDifferentCurrency =
      validateParameters.toCurrency !== validateParameters.fromCurrency;
    message = billPaymentErrors.MSG_RBBP_015();
  }
  return {
    isFutureDatedCrossCurrency:
      (validateParameters.from &&
        validateParameters.fromCurrency &&
        validateParameters.to &&
        validateParameters.toCurrency &&
        isDifferentCurrency &&
        validateParameters.when &&
        validateParameters.when?.isAfter(dayjs())) ||
      false,
    message
  };
};

export const getEligiblePayees = (
  fromCurrency, // what if we don't have it?
  billPayees,
  fromRecurringReducer
) => {
  let eligibleBillPayees = [];
  let nonEligibleBillPayees = [];
  if (
    (fromCurrency === "CAD" || fromCurrency === "USD") &&
    billPayees?.length
  ) {
    if (fromCurrency === "CAD") {
      eligibleBillPayees = fromRecurringReducer
        ? billPayees.filter(acct => acct.ATBMastercardCurrency !== "USD")
        : billPayees;
      nonEligibleBillPayees = fromRecurringReducer
        ? billPayees.filter(acct => acct.ATBMastercardCurrency === "USD")
        : [];
    } else {
      eligibleBillPayees = billPayees.filter(
        acct => acct.ATBMastercardCurrency === "USD"
      );
      nonEligibleBillPayees = billPayees.filter(
        acct => acct.ATBMastercardCurrency !== "USD"
      );
    }

    const eligible = getFormattedPayees(eligibleBillPayees);
    let nonEligible = getFormattedPayees(nonEligibleBillPayees);

    // add disabled flag to non eligible
    nonEligible = nonEligible.map(item => ({
      ...item,
      disabled: true
    }));

    const billPayeesFormatted = nonEligible.length
      ? eligible.concat(divider).concat(nonEligible)
      : eligible;

    return [ADD_PAYEE, ...billPayeesFormatted];
  }
  // if we choosing to, but from is not yet selected
  return [ADD_PAYEE, ...getFormattedPayees(billPayees)];
};

export const getEligibleFromAccounts = (
  toCurrency,
  fromAccounts,
  fromRecurringReducer
) => {
  let eligibleFromAccounts = [];
  let nonEligibleFromAccounts = [];
  if ((toCurrency === "CAD" || toCurrency === "USD") && fromAccounts?.length) {
    if (toCurrency === "CAD") {
      eligibleFromAccounts = fromAccounts.filter(
        acct => acct.currency === "CAD"
      );
      nonEligibleFromAccounts = fromAccounts.filter(
        acct => acct.currency !== "CAD"
      );
    } else {
      eligibleFromAccounts = fromRecurringReducer
        ? fromAccounts.filter(acct => acct.currency === "USD")
        : fromAccounts;
      nonEligibleFromAccounts = fromRecurringReducer
        ? fromAccounts.filter(acct => acct.currency !== "USD")
        : [];
    }

    const eligible = getFormattedAccounts(eligibleFromAccounts);
    let nonEligible = getFormattedAccounts(nonEligibleFromAccounts);

    // add disabled flag to non eligible
    nonEligible = nonEligible.map(item => ({
      ...item,
      disabled: true
    }));

    const fromAccountsFormatted = nonEligible.length
      ? eligible.concat(divider).concat(nonEligible)
      : eligible;
    return fromAccountsFormatted;
  }
  // if we choosing to, but from is not yet selected
  return getFormattedAccounts(fromAccounts);
};

export const getPrimarySelection = (state, name, value) => {
  let { primary } = state;
  if (primary === primaryOptions.notSelected) {
    if (name === "from") {
      primary =
        value !== "" && state.to === ""
          ? primaryOptions.selectedFrom
          : primaryOptions.selectedTo;
    } else {
      primary =
        value !== "" && state.from === ""
          ? primaryOptions.selectedTo
          : primaryOptions.selectedFrom;
    }
  }
  return primary;
};

export const updateAccountsForEligibility = (
  state,
  name,
  value,
  fromRecurringReducer
) => {
  let { fromCurrency, toCurrency } = getCurrencies(state, name, value);
  let {
    primary,
    fromAccountsFormatted,
    billPayeesFormatted,
    from,
    to,
    isDisplayedToAmount,
    exchangeRateFormatted
  } = state;
  const { fromAccounts, billPayees } = state;

  if (name !== "from" && name !== "to") {
    return {
      primary,
      billPayeesFormatted,
      fromAccountsFormatted,
      toCurrency,
      fromCurrency,
      from,
      to,
      isDisplayedToAmount,
      exchangeRateFormatted
    };
  }

  primary = getPrimarySelection(state, name, value);

  if (name === "from") {
    if (primary === primaryOptions.selectedFrom) {
      billPayeesFormatted = getEligiblePayees(
        fromCurrency,
        billPayees,
        fromRecurringReducer
      );
      fromAccountsFormatted = getFormattedAccounts(fromAccounts);
      if (
        (fromRecurringReducer && // no cleaning in one time
          fromCurrency &&
          toCurrency &&
          fromCurrency !== toCurrency) ||
        (!fromRecurringReducer &&
          fromCurrency === "USD" &&
          toCurrency === "CAD")
      ) {
        toCurrency = "";
        to = "";
        isDisplayedToAmount = false;
        exchangeRateFormatted = "";
      }
    } else {
      billPayeesFormatted = [ADD_PAYEE, ...getFormattedPayees(billPayees)];
      fromAccountsFormatted = getEligibleFromAccounts(
        toCurrency,
        fromAccounts,
        fromRecurringReducer
      );
    }
  } else if (name === "to") {
    if (primary === primaryOptions.selectedTo) {
      fromAccountsFormatted = getEligibleFromAccounts(
        toCurrency,
        fromAccounts,
        fromRecurringReducer
      );
      billPayeesFormatted = [ADD_PAYEE, ...getFormattedPayees(billPayees)];
      if (
        (fromRecurringReducer && // no cleaning in one time
          fromCurrency &&
          toCurrency &&
          fromCurrency !== toCurrency) ||
        (!fromRecurringReducer &&
          fromCurrency === "USD" &&
          toCurrency === "CAD")
      ) {
        fromCurrency = "";
        from = "";
        isDisplayedToAmount = false;
        exchangeRateFormatted = "";
      }
    } else {
      fromAccountsFormatted = getFormattedAccounts(fromAccounts);
      billPayeesFormatted = getEligiblePayees(
        fromCurrency,
        billPayees,
        fromRecurringReducer
      );
      // special case if you add payee and it is in ineligible accounts
      if (
        billPayeesFormatted.find(
          account => account.value === value && account?.disabled === true
        )
      ) {
        toCurrency = "";
        to = "";
        isDisplayedToAmount = false;
        exchangeRateFormatted = "";
      }
    }
  }

  return {
    primary,
    billPayeesFormatted,
    fromAccountsFormatted,
    toCurrency,
    fromCurrency,
    from,
    to,
    isDisplayedToAmount,
    exchangeRateFormatted
  };
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
export const preparePaymentSuccessMessage = (state, isRecurring = false) => {
  let message = "";
  if (!state) {
    return message;
  }
  if (state.billPayees && state.to) {
    const toPayee =
      state.billPayees.filter(
        selected => selected.billPayeeId === state.to
      )[0] || null;

    if (isRecurring) {
      // recurring
      message = toPayee
        ? billPaymentErrors.MSG_RBBP_001_RECURRING(
            toPayee.payeeName,
            toPayee.payeeNickname
          )
        : "";
    } else {
      message = toPayee
        ? billPaymentErrors.MSG_RBBP_001(
            toPayee.payeeName,
            toPayee.payeeNickname
          )
        : "";
    }
  }
  return message;
};

export const preparePaymentErrorMessage = (state, error) => {
  let message = <></>;
  if (!state || !error) {
    return message;
  }
  if (state.billPayees && state.to) {
    const toPayee =
      state.billPayees.filter(
        selected => selected.billPayeeId === state.to
      )[0] || null;

    if (toPayee) {
      message = billPaymentErrors.MSG_RBBP_002(
        toPayee.payeeNickname ? toPayee.payeeNickname : toPayee.payeeName,
        error.message
      );
    }
  }
  return message;
};

export const persistDataBetweenForms = (
  { name, value },
  oneTime,
  recurring
) => {
  if (Object.keys(initialStateOneTime).includes(name)) {
    oneTime.onChange({ name, value });
  }
  if (Object.keys(initialStateRecurring).includes(name)) {
    recurring.onChange({ name, value });
  }
};

export const handleOnPayAnotherBillOneTime = (oneTime, recurring) => {
  oneTime.onPayAnotherBill();
  recurring.onCleanForm();
};

export const handleOnPayAnotherBillRecurring = (oneTime, recurring) => {
  recurring.onPayAnotherBill();
  oneTime.onCleanForm();
};

export const prepareOneTimeDataForReview = state => {
  if (state && state.fromAccountsFormatted && state.billPayeesFormatted) {
    const from =
      state.fromAccountsFormatted.filter(
        account => account.key === state.from
      )[0] || null;
    const to =
      state.billPayeesFormatted.filter(
        account => account.key === state.to
      )[0] || null;

    if (from && to) {
      let amountTitle = "Amount";
      let showExchangeFields = false;

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
          imageIcon: payBillIcon,
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
        ToAmount: {
          visible: showExchangeFields,
          imageIcon: moneyIcon,
          title: "To amount",
          label: `${state.amountTo} ${state.toCurrency}`
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
        Note: {
          visible: state.note !== "",
          imageIcon: noteIcon,
          title: "Note",
          label: state.note
        },
        Message: getPaymentMessage(),
        SecondMessage: {
          visible: showExchangeFields,
          message: `${billPaymentErrors.MSG_RBBP_EXCHANGE_RATE_DISCLOSURE}`
        }
      };
      const completeData = {
        ...reviewData,
        ExchangeRateMessage: { visible: false },
        Message: { visible: false },
        SecondMessage: { visible: false }
      };
      return { reviewData, completeData };
    }
  }
  return null;
};

export const prepareOneTimePaymentDataToPost = data => {
  if (!data) {
    return null;
  }
  let billPaymentType = paymentType.immediate;
  let paymentDate = "";

  if (data.when.isAfter(dayjs())) {
    billPaymentType = paymentType.futureDated;
    paymentDate = dayjs(data.when).format("YYYY-MM-DD");
  }

  if (data.to && data.from) {
    if (
      data.fromCurrency &&
      data.toCurrency &&
      data.toCurrency !== data.fromCurrency
    ) {
      return {
        billPayeeId: data.to,
        isCreditCard: false, // TBD check for Credit Card
        sourceAccountId: data.from,
        // to Amount
        amount: {
          value: parseFloat(unFormatCurrency(data.amountTo)),
          currency: data.toCurrency
        },
        memo: data.note,
        paymentType: billPaymentType,
        paymentDate,
        // From Amount
        netAmount: {
          value: parseFloat(unFormatCurrency(data.amount)),
          currency: data.fromCurrency
        }
      };
    }
    return {
      billPayeeId: data.to,
      isCreditCard: false, // TBD check for Credit Card
      sourceAccountId: data.from,
      amount: {
        value: parseFloat(unFormatCurrency(data.amount)),
        currency: data.fromCurrency
      },
      memo: data.note,
      paymentType: billPaymentType,
      paymentDate
    };
  }
  return null;
};

export const prepareCancelReviewMessage = (
  state,
  isRecurringPayment = false
) => {
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
    state.billPayeesFormatted && state.to
      ? state.billPayeesFormatted.filter(
          selected => selected.key === state.to
        )[0] || null
      : null;

  if (from && to && state.amount) {
    message = billPaymentErrors.MSG_RBBP_032(
      from.text,
      to.text,
      state.amount,
      isRecurringPayment
    );
  }
  return message;
};

export const loadAccountAndPayee = async () => {
  const {
    accountsDataImmediate,
    accountsDataRecurring,
    billPayeesData
  } = await asyncResolver([
    {
      fn: async url => manualApiFetch(url, BILL_PAYMENT_IMMEDIATE_ACCOUNTS),
      args: immediatePayBillsFromUrl,
      key: "accountsDataImmediate"
    },
    {
      fn: async url => manualApiFetch(url, BILL_PAYMENT_RECURRING_ACCOUNTS),
      args: recurringPayBillsFromUrl,
      key: "accountsDataRecurring"
    },
    {
      fn: async url => manualApiFetch(url, BILL_PAYMENT_PAYEES),
      args: billPayeesUrl,
      key: "billPayeesData"
    }
  ]);

  // Capture errors
  if (
    accountsDataImmediate?.error ||
    accountsDataRecurring?.error ||
    billPayeesData?.error
  ) {
    // This error message is not being used for now,
    // a generic message is instead shown by useGenericErrorModal
    throw Error("Error fetching account information");
  }

  const billPayees = billPayeesData?.result?.value || [];

  const dataOneTime = {
    fromBillAccounts: accountsDataImmediate?.result?.value || [],
    billPayees
  };
  const dataRecurring = {
    fromBillAccounts: accountsDataRecurring?.result?.value || [],
    billPayees
  };
  return { dataOneTime, dataRecurring, billPayeesData: billPayees };
};

export const getInitialBillPaymentAccounts = (state, { from, to }) => {
  const findByCreditCard = (creditCardAccount, payees = []) => {
    if (!creditCardAccount) return undefined;

    const { accountNumber, associatedAccountNumbers = [] } = creditCardAccount;

    // We match by `payeeCustomerReference` first, since that will always be the active credit card number
    return (
      payees.find(
        payee =>
          payee.ATBMastercardIndicator &&
          accountNumber === payee.payeeCustomerReference
      ) ||
      payees.find(
        payee =>
          payee.ATBMastercardIndicator &&
          associatedAccountNumbers.includes(payee.payeeCustomerReference)
      )
    );
  };

  const fromAccount = findByBankAccount(from, state.fromAccounts);
  const toPayee = findByCreditCard(to, state.billPayees);

  return {
    from: fromAccount?.id,
    to: toPayee?.billPayeeId
  };
};

export const getInitialPayeeValues = payee => {
  if (!payee) return undefined;

  const payeeIdMap = {
    CAD: "8836", // ATB FINANCIAL MASTERCARD
    USD: "1755672" // ATB US DOLLAR MASTERCARD
  };
  const { accountNumber, currency = "" } = payee;
  return { accountNumber, id: payeeIdMap[currency] };
};

export const prepareDuplicatePaymentMessage = duplicatePayment => {
  if (
    duplicatePayment &&
    duplicatePayment?.sourceAccountProductName &&
    duplicatePayment?.payeeName &&
    duplicatePayment?.payeeCustomerReference &&
    duplicatePayment?.amount.value &&
    duplicatePayment?.amount.currency &&
    duplicatePayment?.postedDate
  ) {
    const payeeNo = duplicatePayment.payeeCustomerReference.slice(-4);
    const date = dayjs(duplicatePayment.postedDate).format("ll"); // https://day.js.org/docs/en/display/format#list-of-localized-formats
    return (
      <>
        {billPaymentErrors.MSG_RBBP_050()}
        <p id="duplicateFrom">
          From: {duplicatePayment.sourceAccountProductName}
        </p>
        <p id="duplicateTo">
          To: {duplicatePayment.payeeName} ({payeeNo})
        </p>
        <p id="duplicateAmount">
          Amount: {formatCurrency(duplicatePayment.amount.value)}{" "}
          {duplicatePayment.amount.currency}
        </p>
        <p>Date: {date}</p>
      </>
    );
  }

  return null;
};
