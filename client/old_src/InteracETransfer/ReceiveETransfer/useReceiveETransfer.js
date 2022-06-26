import React, { useState, useContext, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { getFormattedAccountsForCurrency, formatCurrency } from "utils";
import {
  accountsBaseUrl,
  asyncResolver,
  etransfersBaseUrl,
  manualApiSend
} from "api";
import { ModalContext } from "Common/ModalProvider";
import { eTransferErrors } from "utils/MessageCatalog";
import useIsMounted from "utils/hooks/useIsMounted";
import {
  handleError,
  isAuthenticated,
  loadTransfers,
  loadEligibleAccounts
} from "./utils";

const useReceiveETransfer = id => {
  const history = useHistory();

  const [receiveEState, setReceiveEState] = useState({
    loading: false,
    error: null,
    authenticated: false,
    receiveFormData: {
      answer: ""
    },
    receiveMoneyData: null,
    receiveMoneyError: null,
    eligibleAccountsError: null,
    eligibleAccounts: null,
    eligibleAccountsFormatted: null,
    saving: false,
    amountFormatted: null
  });

  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const isMounted = useIsMounted();

  const showErrorModal = useCallback(
    message => {
      showModal({
        content: message,
        actions: (
          <button
            type="button"
            className="ui button basic"
            onClick={() => {
              hideModal();
              history.push("/overview");
            }}
          >
            OK
          </button>
        )
      });
    },
    [hideModal, history, showModal]
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await asyncResolver([
          {
            fn: loadTransfers,
            args: `${etransfersBaseUrl}/incomingetransfers/${id}`,
            key: "incommingTransfers"
          },
          {
            fn: loadEligibleAccounts,
            args: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferTo`,
            key: "eligibleAccounts"
          }
        ]);
        if (!isMounted()) {
          return null;
        }
        const { incommingTransfers, eligibleAccounts } = data;
        if (eligibleAccounts.error) {
          setReceiveEState(state => ({
            ...state,
            loading: false,
            eligibleAccountsError: eligibleAccounts.error
          }));
          showErrorModal(<>{eTransferErrors.MSG_REBAS_000}</>);
          return eligibleAccounts.error;
        }

        if (incommingTransfers.error) {
          setReceiveEState(state => ({
            ...state,
            loading: false,
            receiveMoneyError: incommingTransfers.error
          }));
          const { message } = handleError(incommingTransfers.error);
          if (message) {
            showErrorModal(message);
          }
          return incommingTransfers.error;
        }

        const isAuth = isAuthenticated(incommingTransfers.result);
        const toAccounts = eligibleAccounts.result?.data || [];
        if (!toAccounts.length) {
          showErrorModal(<>{eTransferErrors.MSG_RBET_066_NO_ACCOUNTS()}</>);
          return null;
        }
        setReceiveEState(state => ({
          ...state,
          receiveMoneyData: incommingTransfers.result?.data || null,
          loading: false,
          authenticated: isAuth,
          eligibleAccounts: toAccounts,
          eligibleAccountsFormatted: getFormattedAccountsForCurrency(
            toAccounts,
            "CAD"
          ),
          amountFormatted: incommingTransfers.result?.data?.amount?.value
            ? formatCurrency(incommingTransfers.result.data.amount.value)
            : null
        }));
        return data;
      } catch (error) {
        if (!isMounted()) {
          return error;
        }
        const { message } = handleError(error);
        if (!message) {
          return error;
        }
        showErrorModal(message);
        setReceiveEState(state => ({
          ...state,
          loading: false,
          error
        }));
        return error;
      }
    };
    fetchData();
  }, [id, isMounted, showErrorModal]);

  const authenticateTransfer = async answer => {
    try {
      setReceiveEState(state => ({
        ...state,
        authenticated: false,
        saving: true
      }));
      await manualApiSend({
        url: `${etransfersBaseUrl}/incomingetransfers/${id}/authenticate`,
        data: {
          answer,
          hashType: receiveEState.receiveMoneyData.eTransferSecurity.hashType,
          hashSalt: receiveEState.receiveMoneyData.eTransferSecurity.hashSalt
        }
      });
      setReceiveEState(state => ({
        ...state,
        authenticated: true,
        saving: false
      }));
      return null;
    } catch (error) {
      if (!isMounted()) {
        return { error };
      }
      setReceiveEState(state => ({
        ...state,
        receiveMoneyError: error,
        saving: false
      }));
      const { message, invalidAnswer } = handleError(error);
      if (invalidAnswer === "inline") {
        return { error: message };
      }
      showErrorModal(message);
      return null;
    }
  };

  return {
    receiveEState,
    authenticateTransfer
  };
};

export default useReceiveETransfer;
