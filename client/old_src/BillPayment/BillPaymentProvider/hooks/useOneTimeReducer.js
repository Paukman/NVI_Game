import { useReducer } from "react";
import dayjs from "dayjs";
import { formatCurrency, getFormattedPayees } from "utils";
import { primaryOptions } from "../../constants";
import {
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES,
  UPDATING_EXCHANGE_RATE,
  ADD_PAYEE,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY
} from "./constants";
import {
  prepareOneTimeDataForReview,
  prepareOneTimePaymentDataToPost,
  getCurrencies,
  updateAccountsForEligibility
} from "./utils";

import { getFormattedAccounts } from "../../../Transfers/TransferProvider/hooks/utils";

export const initialState = {
  fromAccounts: [],
  fromAccountsFormatted: [],
  from: "",
  billPayees: [],
  billPayeesFormatted: [],
  to: "",
  amount: "",
  amountTo: "",
  when: dayjs(),
  note: "",
  loading: false,
  error: false,
  preparedDataForReview: {},
  preparedDataForComplete: {},
  preparedDataForPost: {},
  successMessage: "",
  createCompleted: false,
  isDisplayedToAmount: false,
  exchangeRateText: {},
  exchangeRateFormatted: "",
  exchangeRate: "",
  fromCurrency: "",
  isExchangeLoading: false,
  toCurrency: "",
  isPosting: false,
  labelFromAmount: null,
  labelFromAmountPosition: null,
  clearValidationErrors: false,
  primary: primaryOptions.notSelected,
  matchingPayments: [],
  fetchingPayments: false
};
export const ON_CHANGE = "ON_CHANGE";
export const PREPARE_DATA_FOR_REVIEW = "PREPARE_DATA_FOR_REVIEW";
export const PREPARE_DATA_FOR_POST = "PREPARE_DATA_FOR_POST";
export const CLEAN_FORM = "CLEAN_FORM";
export const POSTING = "POSTING";
export const UPDATE_SUCCESS_MESSAGE = "UPDATE_SUCCESS_MESSAGE";

export const testCreditAccount = {
  name: "CREDIT CARD TEST ACCOUNT",
  number: "7679",
  currency: "CAD",
  balance: { currency: "CAD", value: 39486.63 },
  availableBalance: { currency: "CAD", value: 89486.63 },
  type: "CreditCard",
  subType: "Chequing",
  subTypeV1: "Chequing",
  status: "30",
  subProductCode: "DP_LOC_R",
  customerId: "0002471847",
  id: "testid"
};

export const addTestAccount = (newState, action) => {
  const testFromAccounts = [...action.data.fromBillAccounts, testCreditAccount];
  return {
    ...newState,
    loading: false,
    fromAccounts: testFromAccounts,
    billPayees: action.data.billPayees,
    billPayeesFormatted: getFormattedPayees(action.data.billPayees),
    fromAccountsFormatted: getFormattedAccounts(testFromAccounts)
  };
};

const setOneTime = (state, action) => {
  let newState = state;
  switch (action.type) {
    case LOADING_DATA: {
      newState = {
        ...newState,
        loading: true
      };
      return newState;
    }
    case LOADING_DATA_FAILED: {
      newState = {
        ...newState,
        error: true
      };
      return newState;
    }
    case ON_CHANGE: {
      const { name, value } = action.data;
      newState = {
        ...newState,
        [name]: value
      };
      if (newState.clearValidationErrors) {
        newState = {
          ...newState,
          clearValidationErrors: false
        };
      }
      return newState;
    }
    case UPDATE_ACCOUNTS_FOR_ELIGIBILITY: {
      const { name, value } = action.data;
      const {
        primary,
        billPayeesFormatted,
        fromAccountsFormatted,
        toCurrency,
        fromCurrency,
        from,
        to,
        isDisplayedToAmount,
        exchangeRateFormatted
      } = updateAccountsForEligibility(newState, name, value, false);

      newState = {
        ...newState,
        primary,
        fromAccountsFormatted,
        billPayeesFormatted,
        toCurrency,
        fromCurrency,
        from,
        to,
        isDisplayedToAmount,
        exchangeRateFormatted
      };
      return newState;
    }
    case LOADED_DATA: {
      const addPayeeComponent = [
        ADD_PAYEE,
        ...getFormattedPayees(action.data.billPayees)
      ];
      return {
        ...newState,
        loading: false,
        fromAccounts: action.data.fromBillAccounts,
        billPayees: action.data.billPayees,
        billPayeesFormatted: addPayeeComponent,
        fromAccountsFormatted: getFormattedAccounts(
          action.data.fromBillAccounts
        )
      };
    }
    case PREPARE_DATA_FOR_REVIEW: {
      const { reviewData, completeData } = prepareOneTimeDataForReview(
        newState
      );
      return {
        ...newState,
        preparedDataForReview: reviewData,
        preparedDataForComplete: completeData,
        createCompleted: true
      };
    }
    case PREPARE_DATA_FOR_POST: {
      return {
        ...newState,
        preparedDataForPost: prepareOneTimePaymentDataToPost(newState)
      };
    }
    case UPDATE_EXCHANGE_RATE: {
      const { result, fieldToUpdate } = action.data;
      const { fromCurrency, toCurrency } = newState;
      const { exchangeRate, toAmount, fromAmount } = result.data;

      newState = {
        ...newState,
        exchangeRate: exchangeRate.toFixed(5),
        exchangeRateFormatted: `$1 ${fromCurrency} = $${exchangeRate.toFixed(
          4
        )} ${toCurrency}`,
        // either amount or amountTo, coming from onBlur amount(amountTo) field
        [fieldToUpdate]:
          fieldToUpdate === "amount"
            ? // rounding needs to mach one from exchange API...
              formatCurrency(parseFloat(fromAmount).toFixed(2))
            : formatCurrency(parseFloat(toAmount).toFixed(2))
      };
      return newState;
    }
    case UPDATE_CURRENCIES: {
      const { name, value } = action.data;
      if (name === "to" || name === "from") {
        const { fromCurrency, toCurrency, isDisplayedToAmount } = getCurrencies(
          newState,
          name,
          value
        );

        newState = {
          ...newState,
          fromCurrency,
          toCurrency,
          isDisplayedToAmount,
          // clear second amount and exchange rates
          // if we're switching between single and cross curency
          amountTo: isDisplayedToAmount ? newState.amountTo : "",
          exchangeRateFormatted: isDisplayedToAmount
            ? newState.exchangeRateFormatted
            : "",
          exchangeRate: isDisplayedToAmount ? newState.exchangeRate : ""
        };
        return newState;
      }
      return newState;
    }
    case UPDATING_EXCHANGE_RATE: {
      return {
        ...newState,
        isExchangeLoading: action.data
      };
    }
    case CLEAN_FORM: {
      newState = {
        ...newState,
        from: "",
        to: "",
        amount: "",
        when: dayjs(),
        note: "",
        exchangeRate: "",
        amountTo: "",
        exchangeRateFormatted: "",
        fromCurrency: "",
        toCurrency: "",
        labelFromAmount: null,
        labelFromAmountPosition: null,
        isDisplayedToAmount: false,
        clearValidationErrors: true,
        isPosting: false,
        primary: primaryOptions.notSelected
      };
      return newState;
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    case UPDATE_SUCCESS_MESSAGE: {
      return {
        ...newState,
        successMessage: action.data
      };
    }
    default: {
      return newState;
    }
  }
};

const useOneTimeReducer = () => {
  const [state, dispatch] = useReducer(setOneTime, initialState);
  return [state, dispatch];
};

export default useOneTimeReducer;
