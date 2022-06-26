import { useReducer } from "react";

export const BLOCK_LOCATION = "BLOCK_LOCATION";
export const BLOCK_CLOSING_BROWSER = "BLOCK_CLOSING_BROWSER";
export const SHOW_MODAL = "SHOW_MODAL";
export const COMMIT = "COMMIT";
export const CANCEL = "CANCEL";

export const initialState = {
  blocked: false,
  blockedCloseBrowser: false,
  showModal: false,
  confirm: false
};
export const promptReducer = (state, action) => {
  const newState = state;
  switch (action.type) {
    case BLOCK_LOCATION:
      return {
        ...newState,
        blocked: true,
        confirm: false
      };
    case BLOCK_CLOSING_BROWSER:
      return {
        ...newState,
        blockedCloseBrowser: true,
        confirm: false
      };
    case SHOW_MODAL:
      return {
        ...newState,
        showModal: action.data
      };
    case COMMIT:
      return {
        ...newState,
        blockedCloseBrowser: false,
        showModal: false,
        blocked: false,
        confirm: true
      };
    case CANCEL:
      return {
        ...newState,
        showModal: false
      };
    default:
      return newState;
  }
};

const usePromptReducer = () => {
  const [state, dispatch] = useReducer(promptReducer, initialState);
  return [state, dispatch];
};
export default usePromptReducer;
