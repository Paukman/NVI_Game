import { useReducer } from "react";
import { extractProfile } from "./utils";

export const initialState = {
  name: "",
  email: "",
  enabled: false,
  success: false,
  loading: false,
  saving: false,
  error: { type: null },
  editing: false,
  profileUpdated: false,
  editProfile: {
    name: "",
    email: ""
  },
  dataLoaded: false
};

export const LOADING_USER_PROFILE = "loadingUserProfile";
export const LOADED_USER_PROFILE = "loadedUserProfile";
export const USER_PROFILE_FAILED = "userProfileFailed";
export const ON_USER_PROFILE_CHANGE = "onUserProfileChange";
export const SAVING_USER_PROFILE = "savingUserProfile";
export const USER_PROFILE_SAVED = "userProfileSaved";
export const SAVING_USER_PROFILE_FAILED = "savingUserProfileFailed";
export const CANCEL_PROFILE_EDIT = "cancelProfileEdit";
export const CANCEL_PROFILE_CREATE = "cancelProfileCreate";
export const CREATING_PROFILE_FAILED = "savingProfileFailed";

export const reducer = (state, action) => {
  let newState = state;
  switch (action.type) {
    case LOADING_USER_PROFILE:
      return {
        ...newState,
        loading: true
      };
    case LOADED_USER_PROFILE: {
      const extracted = extractProfile(action.data, initialState);
      return {
        ...newState,
        loading: false,
        name: extracted.name,
        email: extracted.email,
        enabled: extracted.enabled,
        editProfile: {
          name: extracted.name,
          email: extracted.email
        },
        dataLoaded: true,
        error: { type: null }
      };
    }
    case USER_PROFILE_FAILED: {
      return {
        ...initialState,
        error: { type: action.data }
      };
    }
    case ON_USER_PROFILE_CHANGE: {
      const { name, value } = action.data;
      let editState = newState.editProfile;
      editState = {
        ...editState,
        [name]: value
      };
      newState = {
        ...newState,
        editProfile: editState,
        error: { type: null }
      };
      return newState;
    }
    case SAVING_USER_PROFILE: {
      return {
        ...newState,
        saving: true
      };
    }
    case USER_PROFILE_SAVED: {
      const { name, email } = action.data;
      let editState = newState.editProfile;
      editState = {
        ...editState,
        name,
        email
      };
      newState = {
        ...newState,
        name,
        email,
        editProfile: editState,
        enabled: true,
        saving: false,
        error: { type: null },
        profileUpdated: true
      };
      return newState;
    }
    case SAVING_USER_PROFILE_FAILED: {
      return {
        ...newState,
        saving: false,
        error: { type: action.error }
      };
    }
    case CANCEL_PROFILE_EDIT: {
      let editState = newState.editProfile;
      editState = {
        ...editState,
        name: newState.name,
        email: newState.email
      };
      newState = {
        ...newState,
        editProfile: editState
      };
      return newState;
    }
    case CANCEL_PROFILE_CREATE: {
      let editState = newState.editProfile;
      editState = {
        ...editState,
        name: "",
        email: ""
      };
      newState = {
        ...newState,
        editProfile: editState
      };
      return newState;
    }
    case CREATING_PROFILE_FAILED: {
      return {
        ...newState,
        saving: false,
        error: { type: action.error }
      };
    }
    default:
      throw new Error();
  }
};

const useProfileReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return [state, dispatch];
};

export default useProfileReducer;
