import { useReducer } from "react";

export const LOADING_DATA = "LOADING_DATA";
export const LOADING_DATA_FAILED = "LOADING_DATA_FAILED";
export const LOADED_DATA = "LOADED_DATA";
export const ON_CHANGE = "ON_CHANGE";
export const SEARCH_COMPLETED = "SEARCH_COMPLETED";
export const SELECTED_PAYEE = "SELECTED_PAYEE";
export const SET_ERRORS = "SET_ERRORS";

export const initialState = {
  approvedCreditors: [],
  payeeName: "",
  selectedPayee: "",
  account: "",
  nickname: "",
  loading: false,
  error: false,
  searchResults: [],
  disabled: true,
  errors: {}
};

const setAddPayee = (state, action) => {
  let newState = state;
  switch (action.type) {
    case SET_ERRORS:
      newState = {
        ...newState,
        errors: action.data
      };
      return newState;
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
        loading: false,
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
      if (name === "payeeName" && !value.length) {
        newState = {
          ...newState,
          disabled: true
        };
      }
      return newState;
    }
    case LOADED_DATA: {
      return {
        ...newState,
        loading: false,
        approvedCreditors: action.data
      };
    }
    case SEARCH_COMPLETED: {
      return {
        ...newState,
        disabled: !(newState.payeeName.length > 3 && action.results.length > 0),
        searchResults: action.results
      };
    }
    case SELECTED_PAYEE: {
      return {
        ...newState,
        selectedPayee: action.data
      };
    }
    default: {
      return newState;
    }
  }
};

const useAddPayeeReducer = () => {
  const [state, dispatch] = useReducer(setAddPayee, initialState);
  return [state, dispatch];
};

export default useAddPayeeReducer;
