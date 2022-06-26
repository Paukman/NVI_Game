import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";
import { INTERAC_PROFILES } from "utils/store/storeSchema";
import { etransfersBaseUrl, manualApiFetch, manualApiSend } from "api";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { MessageContext } from "StyleGuide/Components";
import { interacPreferences } from "utils/MessageCatalog";
import { ModalContext } from "Common/ModalProvider";
import useErrorModal from "utils/hooks/useErrorModal";
import useInteracPreferencesAnalytics from "utils/analytics/useInteracPreferencesAnalytics";
import useProfileReducer, {
  LOADING_USER_PROFILE,
  LOADED_USER_PROFILE,
  ON_USER_PROFILE_CHANGE,
  SAVING_USER_PROFILE,
  USER_PROFILE_SAVED,
  SAVING_USER_PROFILE_FAILED,
  CANCEL_PROFILE_EDIT,
  CANCEL_PROFILE_CREATE
} from "./useProfileReducer";
import { errorMessages } from "../utils";

import { BASE_PATH_PROFILE } from "../constants";

export const initialState = {
  name: "",
  email: "",
  enabled: false,
  success: false,
  loading: false,
  saving: false,
  error: false,
  editing: false,
  profileUpdated: false,
  editProfile: {
    name: "",
    email: ""
  }
};

export const profileURL = `${etransfersBaseUrl}/profile`;

const useProfile = () => {
  const [profileState, updateState] = useProfileReducer();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const isMounted = useIsMounted();
  const history = useHistory();
  const { showErrorModal } = useErrorModal();
  const interacPreferencesAnalytics = useInteracPreferencesAnalytics();

  useEffect(() => {
    const loadProfile = async () => {
      updateState({ type: LOADING_USER_PROFILE });
      try {
        const res = await manualApiFetch(profileURL, INTERAC_PROFILES);
        const data = (res && res.value) || [];
        if (!isMounted()) {
          return;
        }
        updateState({ type: LOADED_USER_PROFILE, data });
      } catch (e) {
        if (isMounted()) {
          showErrorModal();
        }
      }
    };
    loadProfile();
  }, [updateState, history, isMounted]);

  const onProfileChange = event => {
    updateState({
      type: ON_USER_PROFILE_CHANGE,
      data: {
        name: event.target.name,
        value: event.target.value
      }
    });
  };

  const updateProfile = async data => {
    const formData = {
      registrationName: data.name.trim(),
      notificationHandle: data.email
    };
    try {
      updateState({ type: SAVING_USER_PROFILE });
      // const result = await api.put(profileURL, formData, {});
      const result = await manualApiSend({
        verb: "PUT",
        url: profileURL,
        data: formData,
        keys: [INTERAC_PROFILES] // one we want to clear from the cache
      });
      if (result.status === 200 && isMounted()) {
        interacPreferencesAnalytics.profileUpdated();
        updateState({
          type: USER_PROFILE_SAVED,
          data: {
            name: data.name.trim(),
            email: data.email
          }
        });
        history.push(`${BASE_PATH_PROFILE}/view-profile`);
        showMessage({
          type: "success",
          top: snackbarTop,
          content: interacPreferences.MSG_RBET_040("updated")
        });
      }
    } catch (e) {
      if (isMounted()) {
        showModal({
          content: errorMessages.systemError(),
          actions: (
            <button
              type="button"
              className="ui button basic"
              onClick={() => hideModal()}
            >
              OK
            </button>
          )
        });
        updateState({ type: SAVING_USER_PROFILE_FAILED, error: true });
      }
    }
  };

  const createProfile = async data => {
    const formData = {
      registrationName: data.name.trim(),
      notificationHandle: data.email
    };
    try {
      updateState({ type: SAVING_USER_PROFILE });
      const result = await manualApiSend({
        url: profileURL,
        data: formData,
        keys: [INTERAC_PROFILES] // one we want to clear from the cache
      });
      if (result.status === 200 && isMounted()) {
        interacPreferencesAnalytics.profileCreated();
        updateState({
          type: USER_PROFILE_SAVED,
          data: {
            name: data.name.trim(),
            email: data.email
          }
        });
        history.push(`${BASE_PATH_PROFILE}/view-profile`);
        showMessage({
          type: "success",
          top: snackbarTop,
          content: interacPreferences.MSG_RBET_040("created")
        });
      }
    } catch (e) {
      if (isMounted()) {
        // error types can be extracted and displayed, invalid email, email already exists...
        updateState({ type: SAVING_USER_PROFILE_FAILED, error: true });
      }
    }
  };

  const cancelProfileEdit = () => {
    updateState({ type: CANCEL_PROFILE_EDIT });
  };

  const cancelProfileCreate = () => {
    updateState({ type: CANCEL_PROFILE_CREATE });
  };

  return {
    profileState,
    updateProfile,
    onProfileChange,
    cancelProfileEdit,
    cancelProfileCreate,
    createProfile,
    show: showModal,
    hide: hideModal,
    showMessage
  };
};
export default useProfile;
