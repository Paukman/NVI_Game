import { groupByDate } from "./groupByDate";
import { findByBankAccount } from "./findByBankAccount";
import { formatCurrency, formatCurrencyInText } from "./formatCurrency";
import { formatDate } from "./formatDate";
import { formatPercentage } from "./formatPercentage";
import { formatTermDate, convertTermToDate } from "./formatTermDate";
import { insertDecimal } from "./insertDecimal";
import getWindowDimensions from "./getWindowDimensions";
import ScrollToTop from "./ScrollToTop";
import { getEmailValidationTriggers } from "./getEmailValidationTriggers";
import { getInitials } from "./getInitials";
import { getLastDigits } from "./getLastDigits";
import { getPayeeName } from "./getPayeeName";
import { generateId } from "./generateId";

import {
  formatName,
  floatValue,
  truncate,
  withdrawalAccounts,
  depositAccounts,
  locateDepositSecurity,
  numberFilter,
  unFormatCurrency,
  setEndDateForTransfer,
  getFormattedAccounts,
  getFormattedPayees,
  getFormattedAccountsForCurrency,
  restrictNoOfPaymentsRange,
  renderNumOf,
  capitalize,
  filterCAD,
  getDayWithinPeriod,
  setPeriodFrequency,
  getFrequencyText,
  getLoadingText,
  sanitizeEmail,
  sanitizeEmailOnDomEvent,
  emailSanitizerOnBlurAndKeyDown
} from "./formUtils";

import {
  validateRequiredNoOfPayments,
  validateEndDateIsPastStartDate,
  validateInvalidDate,
  validateIsNumber,
  validateAmountBalance,
  validateAmountRange,
  balanceOfWithdrawalAccount
} from "./formValidators";

export {
  findByBankAccount,
  formatCurrency,
  formatCurrencyInText,
  formatDate,
  formatName,
  formatPercentage,
  formatTermDate,
  convertTermToDate,
  getWindowDimensions,
  groupByDate,
  insertDecimal,
  ScrollToTop,
  getInitials,
  getPayeeName,
  floatValue,
  truncate,
  withdrawalAccounts,
  depositAccounts,
  locateDepositSecurity,
  numberFilter,
  unFormatCurrency,
  setEndDateForTransfer,
  getEmailValidationTriggers,
  getFormattedAccounts,
  getFormattedPayees,
  getLastDigits,
  getFormattedAccountsForCurrency,
  restrictNoOfPaymentsRange,
  renderNumOf,
  capitalize,
  validateRequiredNoOfPayments,
  validateEndDateIsPastStartDate,
  validateInvalidDate,
  validateIsNumber,
  validateAmountBalance,
  validateAmountRange,
  balanceOfWithdrawalAccount,
  filterCAD,
  generateId,
  getDayWithinPeriod,
  getFrequencyText,
  setPeriodFrequency,
  getLoadingText,
  sanitizeEmail,
  sanitizeEmailOnDomEvent,
  emailSanitizerOnBlurAndKeyDown
};
