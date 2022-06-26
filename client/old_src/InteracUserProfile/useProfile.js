/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";
import { etransfersBaseUrl, manualApiFetch, manualApiSend } from "api";
import { INTERAC_PROFILES } from "utils/store/storeSchema";
import { eTransferErrors, interacPreferences } from "utils/MessageCatalog";
import { ModalContext } from "Common/ModalProvider";
import { MessageContext } from "StyleGuide/Components/Message";
import useInteracPreferencesAnalytics from "utils/analytics/useInteracPreferencesAnalytics";

export const profileURL = `${etransfersBaseUrl}/profile`;

const useProfile = () => {
  const [profile, setProfile] = useState({
    render: false,
    error: null,
    loading: true,
    saving: false
  });
  const history = useHistory();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { show } = useContext(MessageContext);
  const isMounted = useIsMounted();
  const interacPreferencesAnalytics = useInteracPreferencesAnalytics();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await manualApiFetch(profileURL, INTERAC_PROFILES);
        if (isMounted()) {
          setProfile(state => ({
            ...state,
            loading: false
          }));
          if (!res) {
            setProfile(state => ({
              ...state,
              render: true
            }));
          }
        }
        return res;
      } catch (e) {
        if (isMounted()) {
          history.push("/overview");
          showModal({
            title: "System Error",
            content: <div>{eTransferErrors.MSG_REBAS_000}</div>,
            actions: (
              <button
                type="button"
                className="ui button basic"
                onClick={() => {
                  hideModal();
                }}
              >
                OK
              </button>
            )
          });
          setProfile(state => ({
            ...state,
            render: false,
            loading: false,
            error: e
          }));
          return e;
        }
      }
    };
    fetchProfile();
  }, []);

  const createProfile = async data => {
    const formData = {
      registrationName: data.name,
      notificationHandle: data.email
    };
    setProfile(state => ({
      ...state,
      saving: true
    }));
    try {
      const result = await manualApiSend({
        url: profileURL,
        data: formData,
        keys: [INTERAC_PROFILES]
      });
      if (result.status === 200 && isMounted()) {
        interacPreferencesAnalytics.profileCreated();
        setProfile(profile => ({
          ...profile,
          render: false,
          error: null,
          loading: false,
          saving: false
        }));
        show({
          type: "success",
          top: 140,
          content: interacPreferences.MSG_RBET_040("created")
        });
        return null;
      }
    } catch (e) {
      if (isMounted()) {
        setProfile(state => ({
          ...state,
          error: e,
          loading: false,
          saving: false
        }));
        showModal({
          title: "System Error",
          content: (
            <>
              We couldn’t save your <i>Interac</i> user profile. Please try
              again.
            </>
          ),
          actions: (
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                hideModal();
              }}
            >
              OK
            </button>
          )
        });
        return e;
      }
    }
  };

  const goNext = () => {
    setProfile(state => ({
      ...state,
      render: false,
      error: null,
      loading: false,
      saving: false
    }));
  };

  return { profile, createProfile, goNext };
};

export default useProfile;
