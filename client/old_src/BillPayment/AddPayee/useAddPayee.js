import React, { useCallback, useEffect, useContext } from "react";
import { escapeRegExp } from "lodash";
import { billPaymentsBaseUrl, manualApiFetch } from "api";
import { manageContactMessage } from "utils/MessageCatalog";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import DataStore, { APPROVED_CREDITORS } from "utils/store";
import useDebounce from "utils/hooks/useDebounce";
import { MessageContext } from "StyleGuide/Components";
import { BILL_PAYMENT_PAYEES } from "utils/store/storeSchema";
import useIsMounted from "utils/hooks/useIsMounted";
import useContactAnalytics, {
  contactType
} from "utils/analytics/useContactAnalytics";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import { ModalContext } from "Common/ModalProvider";
import useAddPayeeReducer, {
  LOADING_DATA,
  LOADING_DATA_FAILED,
  ON_CHANGE,
  LOADED_DATA,
  SEARCH_COMPLETED,
  SELECTED_PAYEE,
  SET_ERRORS
} from "./useAddPayeeReducer";
import { errorTypes } from "./utils";

export const approvedCreditorsUrl = `${billPaymentsBaseUrl}/approvedCreditors`;
export const addPayeeUrl = `${billPaymentsBaseUrl}/payees`;

const useAddPayee = (handleAddPayee, initialPayee) => {
  const isMounted = useIsMounted();
  const [state, updateState] = useAddPayeeReducer();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { debouncedValue } = useDebounce(state.payeeName, 500);
  const { post } = useApiWithRSA();
  const contactAnalytics = useContactAnalytics();

  useEffect(() => {
    if (debouncedValue?.length) {
      const re = new RegExp(escapeRegExp(debouncedValue), "i");
      const results = state.approvedCreditors
        .filter(creditor => re.test(creditor.name))
        .map(creditor => ({
          title: creditor.name,
          name: creditor.name,
          id: creditor.id
        }));
      updateState({ type: SEARCH_COMPLETED, results });
    }
  }, [debouncedValue, updateState, state.approvedCreditors]);

  const setInitialPayeeValues = useCallback(({ accountNumber, id }, payees) => {
    const getPayeeName = () =>
      payees.find(payee => payee.id === id)?.name ?? "";

    if (id) {
      const payeeName = getPayeeName();
      updateState({
        type: ON_CHANGE,
        data: {
          name: "payeeName",
          value: payeeName
        }
      });
      updateState({ type: SELECTED_PAYEE, data: payeeName });
    }
    if (accountNumber) {
      updateState({
        type: ON_CHANGE,
        data: {
          name: "account",
          value: accountNumber
        }
      });
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!isMounted()) {
        return;
      }
      updateState({ type: LOADING_DATA });
      try {
        const approvedCreditors = await manualApiFetch(
          approvedCreditorsUrl,
          APPROVED_CREDITORS
        );
        if (!isMounted()) {
          return;
        }
        updateState({ type: LOADED_DATA, data: approvedCreditors.value });
        if (initialPayee) {
          setInitialPayeeValues(initialPayee, approvedCreditors.value);
        }
      } catch (e) {
        if (isMounted()) {
          updateState({ type: LOADING_DATA_FAILED });
        }
      }
    };
    loadData();
  }, [updateState, isMounted, setInitialPayeeValues]);

  const onInputChange = event => {
    updateState({
      type: ON_CHANGE,
      data: {
        name: event.target.name,
        value: event.target.value
      }
    });
  };

  const handleResultSelect = result => {
    updateState({
      type: ON_CHANGE,
      data: {
        name: "payeeName",
        value: result.name
      }
    });
    updateState({ type: SELECTED_PAYEE, data: result.name });
  };

  const handleSearchChange = (e, data) => {
    const search = {
      name: "payeeName",
      value: data.value
    };
    updateState({ type: ON_CHANGE, data: search });
  };

  const delay = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  const handleSystemError = async handleModal => {
    handleModal();
    await delay();
    showModal({
      content: (
        <div>
          <h4>System Error</h4>
          <p>
            {manageContactMessage.MSG_RBBP_019(
              state.nickname
                ? `${state.payeeName}/${state.nickname}`
                : state.payeeName
            )}
          </p>
        </div>
      ),
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
  };

  const addPayee = async handleModal => {
    // reset errors in the state from the api call so the form will look clean
    updateState({
      type: SET_ERRORS,
      data: {}
    });
    const selectedCreditor = state.approvedCreditors.find(
      creditor => creditor.name === state.selectedPayee
    );
    const payeeNickname = state.nickname || state.payeeName.substr(0, 20);

    const submitData = {
      approvedCreditorId: selectedCreditor?.id,
      payeeCustomerReference: state.account,
      payeeNickname
    };

    try {
      await post(`${billPaymentsBaseUrl}/payees`, submitData);
      DataStore.del(BILL_PAYMENT_PAYEES);
      if (!isMounted()) {
        return;
      }
      contactAnalytics.contactAdded(contactType.PAYEE);
      handleAddPayee({
        payeeName: state.selectedPayee,
        account: state.account,
        payeeNickname
      });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: manageContactMessage.MSG_RBBP_018(
          state.nickname || state.payeeName
        )
      });
      handleModal();
    } catch (error) {
      if (error?.response?.data?.code) {
        switch (error.response.data.code) {
          case "BP0009":
            updateState({
              type: SET_ERRORS,
              data: {
                account: {
                  type: errorTypes.INVALID_ACCOUNT
                }
              }
            });
            break;
          default: {
            handleSystemError(handleModal);
          }
        }
      } else if (error) {
        handleSystemError(handleModal);
      }
    }
  };

  return {
    debouncedValue,
    handleResultSelect,
    handleSearchChange,
    onInputChange,
    addPayeeState: state,
    addPayee,
    updateState
  };
};

export default useAddPayee;
