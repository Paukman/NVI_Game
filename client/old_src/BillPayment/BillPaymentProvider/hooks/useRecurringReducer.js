import { useReducer } from "react";
import dayjs from "dayjs";
import { getFormattedPayees } from "utils";
import { endingOptions, primaryOptions } from "../../constants";
import {
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  ADD_PAYEE,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY
} from "./constants";
import {
  getEndDateNoOfPaymentsMessage,
  getNumberOfPaymentsForDates,
  getEndDateForNumberOfPayments,
  prepareRecurringDataToPost,
  prepareRecurringDataForReview,
  updateAccountsForEligibility
} from "./utils";
import { frequencyOptions } from "../../RecurringPayment/constants";

import { getFormattedAccounts } from "../../../Transfers/TransferProvider/hooks/utils";

export const initialState = {
  fromAccounts: [],
  fromAccountsFormatted: [],
  from: "",
  billPayees: [],
  billPayeesFormatted: [],
  to: "",
  amount: "",
  frequency: "",
  starting: dayjs().add(1, "day"),
  endingOption: endingOptions.never,
  ending: null,
  reviewEnding: "",
  numberOfPayments: "",
  reviewNumberOfPayments: "",
  endDateNoOfPaymentsMessage: "",
  note: "",
  loading: false,
  isPosting: false,
  error: false,
  preparedDataForReview: {},
  preparedDataForPost: {},
  successMessage: "",
  createCompleted: false,
  enableFeatureToggle: false,
  primary: primaryOptions.notSelected,
  fromCurrency: "",
  toCurrency: ""
};

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

export const ON_CHANGE = "ON_CHANGE";
export const UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE =
  "UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE";
export const PREPARE_DATA_FOR_REVIEW = "PREPARE_DATA_FOR_REVIEW";
export const CLEAN_FORM = "CLEAN_FORM";
export const PREPARE_DATA_FOR_POST = "PREPARE_DATA_FOR_POST";
export const POSTING = "POSTING";
export const UPDATE_SUCCESS_MESSAGE = "UPDATE_SUCCESS_MESSAGE";

const setRecurring = (state, action) => {
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
    case ON_CHANGE: {
      const { name, value } = action.data;

      newState = {
        ...newState,
        [name]: value
      };
      return newState;
    }
    case UPDATE_ACCOUNTS_FOR_ELIGIBILITY: {
      const { name, value } = action.data;
      const fromRecurringReducer = true;
      const {
        primary,
        billPayeesFormatted,
        fromAccountsFormatted,
        toCurrency,
        fromCurrency,
        from,
        to
      } = updateAccountsForEligibility(
        newState,
        name,
        value,
        fromRecurringReducer
      );

      newState = {
        ...newState,
        primary,
        fromAccountsFormatted,
        billPayeesFormatted,
        toCurrency,
        fromCurrency,
        from,
        to
      };
      return newState;
    }
    case UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE: {
      const message = getEndDateNoOfPaymentsMessage(newState);
      let reviewEnding = newState.ending;
      let reviewNumberOfPayments = newState.numberOfPayments;
      // we have to update ending date and number of payments for the review page
      // we're doing this because they might be different then on create form.
      if (newState.endingOption === endingOptions.endDate) {
        reviewNumberOfPayments = getNumberOfPaymentsForDates(
          newState.starting,
          newState.ending,
          newState.frequency
        );
      }
      if (newState.endingOption === endingOptions.numberOfPayments) {
        reviewEnding = getEndDateForNumberOfPayments(
          newState.starting,
          newState.frequency,
          newState.numberOfPayments
        );
      }
      newState = {
        ...newState,
        endDateNoOfPaymentsMessage: message,
        reviewNumberOfPayments,
        reviewEnding
      };
      return newState;
    }
    case PREPARE_DATA_FOR_REVIEW: {
      const frequency =
        frequencyOptions.filter(
          option => option.value === newState.frequency
        )[0] || null;
      return {
        ...newState,
        preparedDataForReview: prepareRecurringDataForReview({
          state: {
            fromAccounts: newState.fromAccountsFormatted,
            billPayees: newState.billPayeesFormatted,
            from: newState.from,
            to: newState.to,
            amount: newState.amount,
            frequency: frequency ? frequency.text : "",
            starting: newState.starting,
            endingOption: newState.endingOption,
            reviewEnding: newState.reviewEnding,
            reviewNumberOfPayments: newState.reviewNumberOfPayments,
            note: newState.note
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
    case CLEAN_FORM: {
      const addPayeeComponent = [
        ADD_PAYEE,
        ...getFormattedPayees(newState.billPayees)
      ];
      newState = {
        ...newState,
        billPayeesFormatted: addPayeeComponent,
        fromAccountsFormatted: getFormattedAccounts(newState.fromAccounts),
        from: "",
        to: "",
        amount: "",
        frequency: "",
        starting: dayjs().add(1, "day"),
        endingOption: endingOptions.never,
        ending: null,
        reviewEnding: "",
        numberOfPayments: "",
        reviewNumberOfPayments: "",
        endDateNoOfPaymentsMessage: "",
        note: "",
        isPosting: false,
        successMessage: "",
        primary: primaryOptions.notSelected,
        fromCurrency: "",
        toCurrency: ""
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

const useRecurringReducer = () => {
  const [state, dispatch] = useReducer(setRecurring, initialState);
  return [state, dispatch];
};

export default useRecurringReducer;
