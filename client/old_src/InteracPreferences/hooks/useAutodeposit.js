import React, { useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { findByBankAccount } from "utils";
import useIsMounted from "utils/hooks/useIsMounted";
import {
  accountsBaseUrl,
  etransfersBaseUrl,
  manualApiFetch,
  manualApiSend
} from "api";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import DataStore from "utils/store";
import {
  ETRANSFER_AUTODEPOSIT,
  AUTODEPOSIT_RULES
} from "utils/store/storeSchema";
import { interacPreferences } from "utils/MessageCatalog";
import { ModalContext } from "Common/ModalProvider";
import { MessageContext } from "StyleGuide/Components";
import useInteracPreferencesAnalytics from "utils/analytics/useInteracPreferencesAnalytics";
import {
  prepareAutoDepositRuleToPost,
  prepareAutoDepositRuleToPut,
  prepareErrorModal,
  autoDepositStatus
} from "./utils";
import { autoDepositconfig } from "./constants";
import useAutodepositReducer, {
  LOADING_DATA,
  DATA_LOADED,
  DATA_LOADING_FAILED,
  ON_CHANGE,
  SET_AUTODEPOSIT,
  REGISTER,
  CLEAR_AUTO_DEPOSIT_FORM,
  POSTING,
  UPDATE_RULES
} from "./useAutodepositReducer";

import {
  RULES_VIEW_PAGE,
  CREATE_PROFILE_PAGE,
  NO_PROFILE_PAGE
} from "../constants";

export const accountsURL = `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferAutoDeposit`;
export const autoDepositsURL = `${etransfersBaseUrl}/autodeposits/`;

export const profileURL = `${etransfersBaseUrl}/profile`;

const useAutodeposit = ({ enabled = false }) => {
  const [autodepositState, updateState] = useAutodepositReducer();
  const isMounted = useIsMounted();
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();
  const interacPreferencesAnalytics = useInteracPreferencesAnalytics();

  const goBackToViewPage = () => {
    hideModal();
    history.push(RULES_VIEW_PAGE);
  };

  const goBack = () => {
    hideModal();
  };

  const clearForm = () => {
    updateState({
      type: CLEAR_AUTO_DEPOSIT_FORM
    });
  };

  const showNoProfileAlert = () => {
    return showModal({
      content: interacPreferences.NO_PROFILE_Error(),
      actions: (
        <>
          <button
            type="button"
            className="ui button basic"
            onClick={() => {
              history.push(NO_PROFILE_PAGE);
              hideModal();
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            onClick={() => {
              history.push(CREATE_PROFILE_PAGE);
              hideModal();
            }}
          >
            Create profile
          </button>
        </>
      )
    });
  };

  const onKeyDown = () => {
    return null;
  };

  const getAutoDepositRules = async () => {
    DataStore.del(AUTODEPOSIT_RULES);
    return manualApiFetch(autoDepositsURL, AUTODEPOSIT_RULES, 600000);
  };

  const loadData = useCallback(async () => {
    if (!isMounted()) {
      return undefined;
    }
    updateState({ type: LOADING_DATA });
    let accounts = null;
    let autodeposits = null;
    // clear all errors
    updateState({ type: DATA_LOADING_FAILED, data: null });
    try {
      accounts = await manualApiFetch(
        accountsURL,
        ETRANSFER_AUTODEPOSIT,
        600000
      );
      if (!isMounted()) {
        return undefined;
      }
    } catch (e) {
      if (isMounted()) {
        updateState({ type: DATA_LOADING_FAILED, data: "ACCOUNTS" });
      }
    }
    try {
      autodeposits = await getAutoDepositRules();
      if (autodepositState?.error?.type === "AUTODEPOSIT_RULES") {
        updateState({ type: DATA_LOADING_FAILED, data: null });
      }
      if (!isMounted()) {
        return undefined;
      }
    } catch (e) {
      if (isMounted()) {
        updateState({ type: DATA_LOADING_FAILED, data: "AUTODEPOSIT_RULES" });
      }
    }
    if (!isMounted()) {
      return undefined;
    }
    const data = {
      accounts: accounts?.value || [],
      autodeposits: autodeposits?.value || []
    };
    updateState({ type: DATA_LOADED, data });
    return null;
  }, [updateState, isMounted]);

  useEffect(() => {
    loadData();
  }, [loadData, enabled]);

  const onChange = event => {
    updateState({
      type: ON_CHANGE,
      data: {
        name: event.target.name,
        value: event.target.value
      }
    });
  };

  const setAutoDepositRule = useCallback(
    rule => {
      const selectedAccount = findByBankAccount(
        rule.bankAccount,
        autodepositState.accounts
      );
      updateState({
        type: SET_AUTODEPOSIT,
        data: {
          account: selectedAccount?.id,
          autodepositRule: rule,
          mode:
            rule.registrationStatus === autoDepositStatus.Pending
              ? "PENDING"
              : "UPDATE"
        }
      });
    },
    [updateState, autodepositState.accounts]
  );

  const updateAutoDepositRule = async () => {
    updateState({ type: POSTING, data: true });
    try {
      await manualApiSend({
        url: autoDepositconfig.url,
        data: prepareAutoDepositRuleToPut(autodepositState),
        config: autoDepositconfig.data,
        keys: AUTODEPOSIT_RULES,
        verb: "PUT"
      });

      if (!isMounted()) {
        return undefined;
      }
      interacPreferencesAnalytics.autodepositRegistrationUpdated();
      const autodeposits = await getAutoDepositRules();
      updateState({
        type: UPDATE_RULES,
        data: (autodeposits && autodeposits.value) || []
      });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: interacPreferences.MSG_RBET_051B
      });
      updateState({ type: POSTING, data: false });
      history.push(RULES_VIEW_PAGE);
    } catch (error) {
      if (!isMounted()) {
        return undefined;
      }
      updateState({ type: POSTING, data: false });
      showModal({
        content: interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT(),
        actions: (
          <button type="button" className="ui button basic" onClick={goBack}>
            OK
          </button>
        )
      });
    }
    return true;
  };

  const deleteRule = async rule => {
    let deleteResult = null;
    try {
      deleteResult = await manualApiSend({
        verb: "DELETE",
        url: `${autoDepositsURL}${rule.directDepositReferenceNumber}`,
        keys: AUTODEPOSIT_RULES
      });
      // re-render the view page with new autodeposit rules
      const autodeposits = await manualApiFetch(
        autoDepositsURL,
        AUTODEPOSIT_RULES,
        600000
      );
      if (!isMounted()) {
        return undefined;
      }
      interacPreferencesAnalytics.autodepositRegistrationCancelled();
      updateState({
        type: UPDATE_RULES,
        data: (autodeposits && autodeposits.value) || []
      });
      goBackToViewPage();
      showMessage({
        type: "success",
        top: snackbarTop,
        content: interacPreferences.MSG_RBET_051C()
      });
      return deleteResult;
    } catch (err) {
      if (!isMounted()) {
        return undefined;
      }
      showModal({
        content: interacPreferences.ERR_SYSTEM_SAVE_AUTODEPOSIT(),
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
      return deleteResult;
    }
  };

  const deleteAutoDepositRule = async rule => {
    showModal({
      content: interacPreferences.MSG_RBET_058(rule.directDepositHandle),
      actions: (
        <>
          <button
            type="button"
            className="ui button basic"
            onClick={() => hideModal()}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ui button basic"
            data-testid="delete-rule"
            onClick={async () => {
              await deleteRule(rule);
            }}
          >
            Delete email
          </button>
        </>
      )
    });
  };

  const createAutodepositRule = async () => {
    try {
      if (!isMounted()) {
        return undefined;
      }
      updateState({ type: POSTING, data: true });
      await manualApiSend({
        url: autoDepositconfig.url,
        data: prepareAutoDepositRuleToPost(autodepositState),
        config: autoDepositconfig.data,
        keys: AUTODEPOSIT_RULES
      });
      interacPreferencesAnalytics.autodepositRegistrationCompleted();
      const autodeposits = await getAutoDepositRules();
      if (!isMounted()) {
        return undefined;
      }
      updateState({
        type: UPDATE_RULES,
        data: autodeposits.value || []
      });
      showModal({
        content: interacPreferences.SUCCESS_AUTODEPOSIT(),
        actions: (
          <button
            type="button"
            className="ui button basic"
            onClick={goBackToViewPage}
          >
            OK
          </button>
        )
      });
      updateState({ type: POSTING, data: false });
      return interacPreferences.SUCCESS_AUTODEPOSIT();
    } catch (error) {
      if (!isMounted()) {
        return undefined;
      }
      updateState({ type: POSTING, data: false });
      const modalContent = prepareErrorModal(error);
      showModal({
        content: modalContent,
        actions: (
          <button type="button" className="ui button basic" onClick={goBack}>
            OK
          </button>
        )
      });
      return modalContent;
    }
  };

  const handleRegister = () => {
    if (autodepositState.rules.length < 5) {
      interacPreferencesAnalytics.autodepositRegistrationStarted();
      updateState({
        type: REGISTER
      });
    } else {
      showModal({
        content: interacPreferences.ERR_SYSTEM_MAXIMUM_AUTODEPOSIT(),
        actions: (
          <button type="button" className="ui button basic" onClick={goBack}>
            OK
          </button>
        )
      });
    }
  };

  return {
    autodepositState,
    createAutodepositRule,
    updateAutoDepositRule,
    deleteAutoDepositRule,
    setAutoDepositRule,
    onAutodepositChange: onChange,
    clearForm,
    handleRegister,
    onKeyDown,
    show: showModal,
    hide: hideModal,
    updateAutoDepositState: updateState,
    goBack,
    deleteRule,
    loadData,
    showNoProfileAlert,
    showMessage
  };
};
export default useAutodeposit;
