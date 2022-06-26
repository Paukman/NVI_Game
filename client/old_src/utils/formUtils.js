import React from "react";
import { formatCurrency, getLastDigits, getPayeeName } from "utils";

import numeral from "numeral";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { disallowedWords, recurringFrequency } from "globalConstants";

dayjs.extend(customParseFormat);

const truncate = (input, truncateToLength = 20) => {
  if (input.length > truncateToLength)
    return `${input.substring(0, truncateToLength)}...`;
  return input;
};

// TODO - may want to escalate to global, applies to more than just forms
const formatName = withdrawalAccount => {
  if (withdrawalAccount.nickname) {
    return withdrawalAccount.nickname;
  }
  return withdrawalAccount.name;
};

// TODO - improve withdrawalAccount argument to take object
const formatNumber = (withdrawalAccount, width) => {
  // TODO - make width an optional argument

  if (width > 768) {
    return `(${withdrawalAccount.number}) | ${formatCurrency(
      withdrawalAccount.availableBalance.value,
      null
    )}`;
  }
  return `(${withdrawalAccount.number}) ${formatCurrency(
    withdrawalAccount.availableBalance.value,
    null
  )}`;
};

const filterCAD = array =>
  array.length > 0 ? array.filter(acct => acct.balance.currency === "CAD") : [];

const withdrawalAccounts = (eTransferData, width) => {
  if (eTransferData.loading) {
    return [
      {
        text: "Loading...",
        value: "Loading",
        disabled: true,
        "data-testid": "loadingto"
      }
    ];
  }

  if (eTransferData.withdrawalAccounts.length === 0) {
    return [];
  }

  return eTransferData.withdrawalAccounts.map(withdrawalAccount => ({
    text: `${formatName(withdrawalAccount)} ${formatNumber(
      withdrawalAccount,
      width
    )}`,
    value: withdrawalAccount.id
  }));
};

const formatAccountList = eTransferData => {
  if (eTransferData.loading) {
    return [
      {
        text: "Loading...",
        value: "Loading",
        disabled: true,
        "data-testid": "loadingfrom"
      }
    ];
  }

  if (eTransferData.depositAccounts.length === 0) {
    return [];
  }

  return eTransferData.depositAccounts.map(depositAccount => ({
    text: `${truncate(depositAccount.aliasName)} (${
      depositAccount.notificationPreference[0].notificationHandle
    })`,
    value: depositAccount.recipientId,
    key: depositAccount.recipientId
  }));
};

const depositAccounts = eTransferData => {
  const addRecipient = {
    text: (
      <div className="dropdown-link" data-testid="add-recipient">
        Add recipient
      </div>
    ),
    value: "add-recipient",
    key: "add-recipient"
  };
  const formattedAccounts = [addRecipient, ...formatAccountList(eTransferData)];
  return formattedAccounts;
};

const locateDepositSecurity = (
  value,
  setShowSecurity,
  setSecurityQuestion,
  setShowQuestions,
  eTransferData,
  setToRecipient,
  transferType = null
) => {
  if (!value) {
    setShowSecurity(false);
  } else {
    setShowSecurity(true);
  }
  const selectedRecipient = eTransferData.depositAccounts.find(element => {
    if (element.recipientId === value) {
      return element;
    }
    return null;
  });
  setToRecipient(selectedRecipient);
  if (selectedRecipient && selectedRecipient.defaultTransferAuthentication) {
    if (
      selectedRecipient.defaultTransferAuthentication.authenticationType ===
        "None" ||
      (transferType && transferType === 2)
    ) {
      setShowQuestions(false);
    } else {
      // update form field values for the questions
      setSecurityQuestion(
        selectedRecipient.defaultTransferAuthentication.question
      );
      setShowQuestions(true);
    }
  }
};

const floatValue = value => {
  return parseFloat(value.replace(/[,$]+/g, ""));
};

const unFormatCurrency = numericString => {
  if (numericString === "" || numericString === "$0.00") {
    return "";
  }
  return numeral(numericString)
    .format("0.00")
    .replace(/\.00$/, "");
};

const numberFilter = value => {
  value = value.toString();
  // check if starting character is 0-9 or $
  if (value.match(/^[0-9$]/)) {
    // then replace whatever is not 0-9, $ or dot
    const newValue = value.replace(/[^0-9.$]/g, "");
    // replace any additional dots
    return newValue
      .replace(/(\.[0-9.]+)\.+/g, "$1")
      .replace(/(\.)\./g, "$1") // extra case for two dots together (..)
      .replace(/(\.\w{2})\w+/g, "$1"); // allow only 2 decimals
  }
  return "";
};

const setEndDateForTransfer = (
  startingDate,
  frequency,
  value,
  setEndDateVal
) => {
  let endDate = null;
  if (!startingDate || !frequency || !value) return null;
  if (value > 0 && value <= 999) {
    const day = +dayjs(startingDate, "MMM DD, YYYY").format("DD");
    const month = +dayjs(startingDate, "MMM DD, YYYY").format("MM");
    const year = +dayjs(startingDate, "MMM DD, YYYY").format("YYYY");

    switch (frequency) {
      case "weekly":
        endDate = dayjs([year, month, day])
          .add(value - 1, "week")
          .format("MMM DD, YYYY");
        break;
      case "biweekly":
        endDate = dayjs([year, month, day])
          .add(2 * (value - 1), "week")
          .format("MMM DD, YYYY");
        break;
      case "monthly":
        endDate = dayjs([year, month, day])
          .add(value - 1, "month")
          .format("MMM DD, YYYY");
        break;
      case "yearly":
        endDate = dayjs([year, month, day])
          .add(value - 1, "year")
          .format("MMM DD, YYYY");
        break;
      default:
        return null;
    }
    setEndDateVal(endDate);
  }
  return endDate;
};

const getFormattedApprovedCreditors = creditorsArray => {
  if (creditorsArray.length === 0) {
    return [];
  }
  return creditorsArray.map(creditor => ({
    text: `${creditor.name}`,
    key: creditor.id,
    value: creditor.id
  }));
};

const getFormattedAccounts = accountsArray => {
  if (accountsArray.length === 0) {
    return [];
  }

  return accountsArray.map(account => ({
    text: `${account.nickname ? account.nickname : account.name} (${
      account.number
    }) | ${formatCurrency(account.availableBalance.value)}`,
    key: account.id,
    value: account.id
  }));
};

const getFormattedAccountsForCurrency = (
  accountsArray,
  currency,
  enableFeatureToggle
) => {
  if (accountsArray.length === 0) {
    return [];
  }

  if (enableFeatureToggle) {
    return getFormattedAccounts(accountsArray);
  }

  return getFormattedAccounts(
    accountsArray.filter(account => account.currency === currency)
  );
};

const getFormattedPayees = payeesData => {
  if (!Array.isArray(payeesData)) {
    return [];
  }

  return payeesData
    .map(payee => ({
      text: `${getPayeeName(payee)} (${getLastDigits(
        payee.payeeCustomerReference
      )})`,
      key: payee.billPayeeId,
      value: payee.billPayeeId
    }))
    .sort((a, b) => {
      if (a.text < b.text) {
        return -1;
      }
      if (a.text > b.text) {
        return 1;
      }
      return 0;
    });
};

const restrictNoOfPaymentsRange = value => {
  const onlyNumbersWithoutLeadingZero = /^[1-9]\d*$/g;
  // const oneToNineNineNine = /^([1-9][0-9]{0,2})$/g;
  if (value.match(onlyNumbersWithoutLeadingZero) === null) {
    return "";
  }
  return value;
};

const getDateDifference = (endingDate, startingDate, isDivided, duration) => {
  if (!isDivided) {
    return Math.round(dayjs(endingDate).diff(startingDate, duration) + 1);
  }

  return Math.floor(
    Math.round(dayjs(endingDate).diff(startingDate, duration) / 2 + 1)
  );
};

const renderNumOf = (endingDate, startingDate, frequencyVal) => {
  const endingArray = dayjs(endingDate).format("YYYY-MM-DD");
  const startingArray = dayjs(startingDate).format("YYYY-MM-DD");

  let dateDifference;

  switch (frequencyVal) {
    case "weekly":
      dateDifference = getDateDifference(
        endingArray,
        startingArray,
        false,
        "week"
      );
      if (dateDifference < 1) {
        dateDifference = 0;
      }
      break;
    case "biweekly":
      dateDifference = getDateDifference(
        endingArray,
        startingArray,
        true,
        "week"
      );

      // TODO: Not per story, adding this to handle cases
      if (dateDifference === 1) {
        // dateMessage = "End date must be more than 1 week away";
        dateDifference = 0;
      }
      break;
    case "monthly":
      dateDifference = getDateDifference(
        endingArray,
        startingArray,
        false,
        "month"
      );
      if (dateDifference < 1) {
        // dateMessage = "End date must be more than 1 month away";
        dateDifference = 0;
      }
      break;
    case "yearly":
      dateDifference = getDateDifference(
        endingArray,
        startingArray,
        false,
        "year"
      );

      if (dateDifference < 1) {
        // dateMessage = "End date must be more than 1 year away";
        dateDifference = 0;
      }
      break;
    default:
      return "";
  }

  return dateDifference;
};

const EMAIL_REGEX =
  "[a-zA-Z0-9_%+-]+(?:\\.[a-zA-Z0-9_%+-]+)*@(?:[a-zA-Z0-9]+-)*[a-zA-Z0-9]+(?:\\.[a-zA-Z]+)*\\.[a-zA-Z]{2,}";

const emailRegex = new RegExp(`^${EMAIL_REGEX}$`);
const emailSanitizerRegex = new RegExp(`^(${EMAIL_REGEX})(\\s*\\.*\\s*)*$`);

const isValidEmail = email => emailRegex.test(email);
const sanitizeEmail = email => email.replace(emailSanitizerRegex, "$1");

export const sanitizeEmailOnDomEvent = ({ type, key, target }) => {
  if (type === "keydown" && key !== "Enter") return target.value;

  const sanitized = sanitizeEmail(target.value);
  /**
   * Although it's not recommended to change any input variable
   * it's how our react-hook-form library version 3.29.4 recommends
   * to handle this kind of necessity during normalization or sanitizing.
   */
  if (sanitized !== target.value) target.value = sanitized;
  return target.value;
};
export const emailSanitizerOnBlurAndKeyDown = {
  onBlur: sanitizeEmailOnDomEvent,
  onKeyDown: sanitizeEmailOnDomEvent
};

const isAphaNumeric = string => {
  return /^[a-zA-Z0-9 ]*$/.test(string);
};

const capitalize = value => {
  if (typeof value !== "string") return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const isNumeric = value => {
  return /^-{0,1}\d+$/.test(value);
};

const isDisallowed = string => {
  return disallowedWords.some(element => string.includes(element));
};

const isAphaNumericWithoutSpace = string => {
  return /^[a-zA-Z0-9]*$/.test(string);
};

const hasInvalidCharacters = string => {
  return /[!@#$%^&*(),.?":{}|<>]/g.test(string);
};

const getDayWithinPeriod = (date, frequency) => {
  let dayWithinPeriod = "";
  if (
    frequency === recurringFrequency.weekly ||
    frequency === recurringFrequency.biweekly
  ) {
    dayWithinPeriod = dayjs(date).day();
    if (dayWithinPeriod === 0) {
      dayWithinPeriod = 7; // 0 is Sunday it should be 7
    }
  } else {
    dayWithinPeriod = dayjs(date).date();
  }
  return dayWithinPeriod;
};

const setPeriodFrequency = data => {
  let periodFrequency;
  if (data.frequency === recurringFrequency.weekly) {
    periodFrequency = 1;
  }

  if (data.frequency === recurringFrequency.biweekly) {
    periodFrequency = 2;
  }

  if (data.frequency === recurringFrequency.monthly) {
    periodFrequency = 1;
  }

  if (data.frequency === recurringFrequency.yearly) {
    periodFrequency = 12;
  }

  return periodFrequency;
};

const getFrequencyText = (periodFrequency, periodUnit) => {
  const frequencyTextMap = {
    Week: { 1: "Weekly", 2: "Biweekly" },
    Month: { 1: "Monthly", 12: "Yearly" }
  };
  return frequencyTextMap[periodUnit]?.[periodFrequency] || null;
};

const getLoadingText = () => {
  return [{ text: "Loading...", value: "Loading", disabled: true }];
};

export {
  floatValue,
  formatName,
  formatNumber,
  truncate,
  withdrawalAccounts,
  depositAccounts,
  locateDepositSecurity,
  numberFilter,
  unFormatCurrency,
  setEndDateForTransfer,
  getFormattedAccounts,
  getFormattedPayees,
  getFormattedApprovedCreditors,
  getFormattedAccountsForCurrency,
  isAphaNumericWithoutSpace,
  isDisallowed,
  hasInvalidCharacters,
  isNumeric,
  restrictNoOfPaymentsRange,
  renderNumOf,
  capitalize,
  isValidEmail,
  isAphaNumeric,
  filterCAD,
  getDayWithinPeriod,
  setPeriodFrequency,
  getDateDifference,
  getFrequencyText,
  getLoadingText,
  sanitizeEmail
};
