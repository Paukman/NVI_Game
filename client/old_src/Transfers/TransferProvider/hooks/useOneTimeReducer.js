import { useReducer } from "react";
import dayjs from "dayjs";
import { getLoadingText, formatCurrency } from "utils";
import { primaryOptions } from "../../constants";
import {
  prepareOneTimeDataForReview,
  prepareOneTimeDataToPost,
  updateAccountsForEligibility,
  getCurrencies,
  getFormattedAccounts
} from "./utils";

import {
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  ON_CHANGE,
  CLEAN_FORM,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  POSTING,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES,
  UPDATING_EXCHANGE_RATE
} from "./constants";

export const initialState = {
  fromAccounts: [],
  fromAccountsFormatted: [],
  toAccounts: [],
  toAccountsFormatted: [],
  immediateTransferAccounts: [],
  futureDatedTransferAccounts: [],
  recurringAccounts: [],
  from: "",
  to: "",
  amount: "",
  amountTo: "",
  when: dayjs(),
  loading: false,
  error: false,
  preparedDataForReview: {},
  preparedDataForComplete: {},
  preparedDataForPost: {},
  successMessage: "",
  createCompleted: false,
  primary: primaryOptions.notSelected,
  isPosting: false,
  exchangeRate: "",
  exchangeRateFormatted: "",
  fromCurrency: "",
  toCurrency: "",
  labelFromAmount: null,
  labelFromAmountPosition: null,
  isDisplayedToAmount: false,
  exchangeRateText: {},
  isExchangeLoading: false,
  clearValidationErrors: false
};

const setOneTime = (state, action) => {
  let newState = state;
  switch (action.type) {
    case LOADING_DATA: {
      newState = {
        ...newState,
        loading: true,
        fromAccountsFormatted: getLoadingText(),
        toAccountsFormatted: getLoadingText()
      };
      return newState;
    }
    case LOADING_DATA_FAILED: {
      newState = {
        ...newState,
        error: true,
        fromAccountsFormatted: [],
        toAccountsFormatted: []
      };
      return newState;
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
    case LOADED_DATA: {
      return {
        ...newState,
        loading: false,
        fromAccounts: action.data.fromAccounts,
        fromAccountsFormatted: getFormattedAccounts(action.data.fromAccounts),
        toAccounts: action.data.toAccounts,
        toAccountsFormatted: getFormattedAccounts(action.data.toAccounts),
        immediateTransferAccounts: action.data.immediateTransferAccounts,
        futureDatedTransferAccounts: action.data.futureDatedTransferAccounts,
        recurringAccounts: action.data.recurringAccounts
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
        preparedDataForPost: prepareOneTimeDataToPost(newState)
      };
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    case UPDATING_EXCHANGE_RATE: {
      return {
        ...newState,
        isExchangeLoading: action.data
      };
    }
    case UPDATE_ACCOUNTS_FOR_ELIGIBILITY: {
      const { name, value } = action.data;
      const updatedState = updateAccountsForEligibility(
        newState,
        name,
        value,
        false
      );

      return {
        ...newState,
        primary: updatedState.primary,
        fromAccountsFormatted: updatedState.fromAccountsFormatted,
        toAccountsFormatted: updatedState.toAccountsFormatted,
        to: updatedState.to,
        from: updatedState.from,
        isDisplayedToAmount: updatedState.isDisplayedToAmount,
        exchangeRateFormatted: updatedState.isDisplayedToAmount
          ? newState.exchangeRateFormatted
          : ""
      };
    }
    case CLEAN_FORM: {
      return {
        ...newState,
        from: "",
        to: "",
        amount: "",
        when: dayjs(),
        isFromPrimaryAccount: undefined,
        exchangeRate: "",
        amountTo: "",
        exchangeRateFormatted: "",
        fromCurrency: "",
        toCurrency: "",
        labelFromAmount: null,
        labelFromAmountPosition: null,
        isDisplayedToAmount: false,
        clearValidationErrors: true
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
