import { useReducer } from "react";
import { contactSupport } from "globalConstants";
import { getFormattedAccounts } from "./utils";

export const LOADING_DATA = "LOADING_DATA";
export const DATA_LOADING_FAILED = "DATA_LOADING_FAILED";
export const DATA_LOADED = "DATA_LOADED";
export const ON_CHANGE = "ON_CHANGE";
export const SET_AUTODEPOSIT = "SET_AUTODEPOSIT";
export const REGISTER = "REGISTER";
export const HIDESIDEBAR = "HIDESIDEBAR";
export const CLEAR_AUTO_DEPOSIT_FORM = "CLEAR_AUTO_DEPOSIT_FORM";
export const POSTING = "POSTING";
export const UPDATE_RULES = "UPDATE_RULES";

export const initialState = {
  rebankSupportNumber: contactSupport.PHONE_NUMBER,
  autodepositRule: {},
  email: "",
  accounts: [],
  formattedAccountOptions: [],
  account: "",
  loading: false,
  error: { type: null },
  mode: "",
  hideSidebar: "show",
  rules: [],
  profile: {
    name: "",
    email: "",
    enabled: false,
    editProfile: {
      name: "",
      email: ""
    }
  },
  dataLoaded: false,
  isPosting: false
};

const reducer = (state, action) => {
  let newState = state;
  switch (action.type) {
    case LOADING_DATA: {
      newState = {
        ...newState,
        loading: true
      };
      return newState;
    }
    case DATA_LOADING_FAILED: {
      newState = {
        ...newState,
        loading: false,
        error: { type: action.data }
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
    case DATA_LOADED: {
      return {
        ...newState,
        loading: false,
        accounts: action.data.accounts,
        formattedAccountOptions: getFormattedAccounts(action.data.accounts),
        legalName: action.data.loggedinUser,
        rules: action.data.autodeposits,
        dataLoaded: true
      };
    }
    case SET_AUTODEPOSIT: {
      const { account, autodepositRule, mode } = action.data;
      return {
        ...newState,
        account,
        autodepositRule, // Set rule with reference number,
        email: autodepositRule.directDepositHandle,
        mode,
        hideSidebar: "hidden"
      };
    }
    case REGISTER: {
      return {
        ...newState,
        email: "",
        account: "",
        mode: "CREATE",
        hideSidebar: "hidden"
      };
    }
    case HIDESIDEBAR: {
      return {
        ...newState,
        hideSidebar: action.data.hideSidebar
      };
    }
    case UPDATE_RULES: {
      return {
        ...newState,
        rules: action.data,
        email: "",
        account: "",
        mode: "",
        autodepositRule: {},
        hideSidebar: "show"
      };
    }
    case CLEAR_AUTO_DEPOSIT_FORM: {
      return {
        ...newState,
        email: "",
        account: "",
        mode: "",
        autodepositRule: [],
        hideSidebar: "show"
      };
    }
    case POSTING: {
      return {
        ...newState,
        isPosting: action.data
      };
    }
    default: {
      return newState;
    }
  }
};

const useAutodepositReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
};
export default useAutodepositReducer;
