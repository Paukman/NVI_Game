import { useReducer } from "react";
import { getLoadingText } from "utils";
import dayjs from "dayjs";
import {
  getNumberOfPaymentsForDates,
  getEndDateForNumberOfPayments
} from "BillPayment/BillPaymentProvider/hooks/utils";
import { endingOptions, primaryOptions } from "../../constants";
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
  UPDATE_CURRENCIES
} from "./constants";
import {
  getFrequencyOption,
  prepareRecurringDataForReview,
  prepareRecurringDataToPost,
  getEndDateNoOfTransfersMessage,
  updateAccountsForEligibility,
  getFormattedAccounts,
  getCurrencies
} from "./utils";

export const UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE =
  "UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE";
export const UPDATE_SUCCESS_MESSAGE = "UPDATE_SUCCESS_MESSAGE";

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
  frequency: "",
  starting: dayjs().add(1, "day"),
  endingOption: endingOptions.never,
  ending: null,
  reviewEnding: "",
  numberOfTransfers: "",
  reviewNumberOfTransfers: "",
  endDateNoOfTransfersMessage: "",
  loading: false,
  isPosting: false,
  error: false,
  preparedDataForReview: {},
  preparedDataForPost: {},
  successMessage: "",
  createCompleted: false,
  primary: primaryOptions.notSelected,
  fromCurrency: "",
  toCurrency: ""
};

const setRecurring = (state, action) => {
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
    case ON_CHANGE: {
      const { name, value } = action.data;
      newState = {
        ...newState,
        [name]: value
      };
      return newState;
    }
    case UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE: {
      const message = getEndDateNoOfTransfersMessage(newState);
      let reviewEnding = newState.ending;
      let reviewNumberOfTransfers = newState.numberOfTransfers;
      // we have to update ending date and number of payments for the review page
      // we're doing this because they might be different then on create form.
      if (newState.endingOption === endingOptions.endDate) {
        reviewNumberOfTransfers = getNumberOfPaymentsForDates(
          newState.starting,
          newState.ending,
          newState.frequency
        );
      }
      if (newState.endingOption === endingOptions.numberOfTransfers) {
        reviewEnding = getEndDateForNumberOfPayments(
          newState.starting,
          newState.frequency,
          newState.numberOfTransfers
        );
      }

      newState = {
        ...newState,
        endDateNoOfTransfersMessage: message,
        reviewNumberOfTransfers,
        reviewEnding
      };
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
      const frequency = getFrequencyOption(newState.frequency);
      return {
        ...newState,
        preparedDataForReview: prepareRecurringDataForReview({
          state: {
            fromAccounts: newState.fromAccountsFormatted,
            toAccounts: newState.toAccountsFormatted,
            from: newState.from,
            to: newState.to,
            amount: newState.amount,
            frequency: frequency ? frequency.text : "",
            starting: newState.starting,
            endingOption: newState.endingOption,
            reviewEnding: newState.reviewEnding,
            reviewNumberOfTransfers: newState.reviewNumberOfTransfers
          }
        }),
        createCompleted: true
      };
    }
    case PREPARE_DATA_FOR_POST: {
      return {
        ...newState,
        preparedDataForPost: prepareRecurringDataToPost(newState)
      };
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    case UPDATE_ACCOUNTS_FOR_ELIGIBILITY: {
      const { name, value } = action.data;
      const updatedState = updateAccountsForEligibility(
        newState,
        name,
        value,
        true
      );

      return {
        ...newState,
        primary: updatedState.primary,
        fromAccountsFormatted: updatedState.fromAccountsFormatted,
        toAccountsFormatted: updatedState.toAccountsFormatted,
        to: updatedState.to,
        toCurrency: updatedState.toCurrency,
        from: updatedState.from,
        fromCurrency: updatedState.fromCurrency
      };
    }
    case CLEAN_FORM: {
      newState = {
        ...newState,
        from: "",
        to: "",
        amount: "",
        frequency: "",
        starting: dayjs().add(1, "day"),
        endingOption: endingOptions.never,
        ending: null,
        reviewEnding: "",
        numberOfTransfers: "",
        reviewNumberOfTransfers: "",
        endDateNoOfTransfersMessage: "",
        isPosting: false,
        successMessage: "",
        isFromPrimaryAccount: undefined,
        fromCurrency: "",
        toCurrency: ""
      };
      return newState;
    }
    case UPDATE_CURRENCIES: {
      const { name, value } = action.data;
      if (name === "to" || name === "from") {
        const { fromCurrency, toCurrency } = getCurrencies(
          newState,
          name,
          value
        );

        newState = {
          ...newState,
          fromCurrency,
          toCurrency
        };
        return newState;
      }
      return newState;
    }
    default: {
      return newState;
    }
  }
};

const useRecurringReducer = () => {
  const [state, dispatch] = useReducer(setRecurring, initialState);
  return [state, dispatch];
};

export default useRecurringReducer;
