import React, { useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import useIsMounted from "utils/hooks/useIsMounted";
import { manualApiSend, transfersUrl } from "api";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import {
  SCHEDULED_TRANSFERS,
  TRASFER_IMMEDIATE_FROM_ACCOUNTS,
  TRASFER_FUTURE_DATED_FROM_ACCOUNTS,
  TRASFER_RECURRING_FROM_ACCOUNTS,
  TRASFER_TO_ACCOUNTS
} from "utils/store/storeSchema";
import { transferErrors } from "utils/MessageCatalog";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import { ModalContext } from "Common/ModalProvider";
import { MessageContext } from "StyleGuide/Components";
import {
  prepareCancelReviewMessage,
  prepareTransferErrorMessage,
  loadData
} from "./utils";
import useRecurringReducer, {
  UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE
} from "./useRecurringReducer";
import {
  ON_CHANGE,
  CLEAN_FORM,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  POSTING,
  LOADED_DATA,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
  UPDATE_CURRENCIES
} from "./constants";

export const url = "";

const useRecurring = () => {
  const [recurringState, updateState] = useRecurringReducer();
  const isMounted = useIsMounted();
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();
  const location = useLocation();

  const moveMoneyAnalytics = useMoveMoneyAnalytics(moneyMovementType.TRANSFER);

  useEffect(() => {
    if (
      location.pathname.includes("recurring") &&
      location.hash === "#create"
    ) {
      moveMoneyAnalytics.started();
    }
  }, [location.hash, location.pathname]);

  const onCleanForm = () => {
    updateState({ type: CLEAN_FORM });
  };

  const goBack = () => {
    hideModal();
  };

  const confirm = () => {
    hideModal();
    onCleanForm();
    history.push(`recurring#create`);
  };

  const showTransferError = error => {
    const errorMessage = prepareTransferErrorMessage(recurringState, error);
    return showModal({
      content: errorMessage,
      actions: (
        <button type="button" className="ui button basic" onClick={goBack}>
          OK
        </button>
      )
    });
  };
  const onChange = ({ name, value }) => {
    updateState({ type: ON_CHANGE, data: { name, value } });
    updateState({ type: UPDATE_CURRENCIES, data: { name, value } });
    updateState({
      type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
      data: { name, value }
    });
  };

  const updateEndDateNoOfTransfersMessage = () => {
    updateState({ type: UPDATE_END_DATE_NO_OF_TRANSFERS_MESSAGE });
  };

  const prepareDataForReview = () => {
    updateState({ type: PREPARE_DATA_FOR_REVIEW });
  };

  const prepareDataForPost = () => {
    updateState({ type: PREPARE_DATA_FOR_POST });
  };

  const onTransfer = async nextTab => {
    updateState({ type: POSTING, data: true });
    try {
      await manualApiSend({
        url: `${transfersUrl}/`,
        data: recurringState.preparedDataForPost,

        keys: [
          SCHEDULED_TRANSFERS,
          TRASFER_IMMEDIATE_FROM_ACCOUNTS,
          TRASFER_FUTURE_DATED_FROM_ACCOUNTS,
          TRASFER_RECURRING_FROM_ACCOUNTS,
          TRASFER_TO_ACCOUNTS
        ] // one we want to clear from the cache
      });

      const { dataRecurring } = await loadData();
      if (!isMounted()) {
        return;
      }
      moveMoneyAnalytics.success(recurringState);
      updateState({ type: LOADED_DATA, data: dataRecurring });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: transferErrors.MSG_RBTR_004_RECURRING
      });
      updateState({ type: POSTING, data: false });
      nextTab();
    } catch (error) {
      if (!isMounted()) {
        return;
      }
      moveMoneyAnalytics.failed(recurringState);
      updateState({ type: POSTING, data: false });
      showTransferError(error);
    }
  };

  const onSendAnotherTransfer = () => {
    onCleanForm();
    history.push(`recurring#create`);
  };

  const onCancelReview = () => {
    const cancelReviewModalMessage = prepareCancelReviewMessage(recurringState);
    showModal({
      content: cancelReviewModalMessage,
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={goBack}>
            Back
          </button>
          <button type="button" className="ui button basic" onClick={confirm}>
            Confirm
          </button>
        </>
      )
    });
  };

  return {
    recurringState,
    updateStateRecurring: updateState,
    onChange,
    updateEndDateNoOfTransfersMessage,
    onCancelReview,
    goBack,
    confirm,
    prepareDataForReview,
    prepareDataForPost,
    onSendAnotherTransfer,
    onTransfer,
    show: showModal,
    hide: hideModal,
    onCleanForm,
    history,
    showMessage
  };
};
export default useRecurring;
