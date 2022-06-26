import React, { useContext, useCallback, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import useIsMounted from "utils/hooks/useIsMounted";
import { manualApiSend, transfersUrl } from "api";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { transferErrors } from "utils/MessageCatalog";
import {
  SCHEDULED_TRANSFERS,
  TRASFER_IMMEDIATE_FROM_ACCOUNTS,
  TRASFER_FUTURE_DATED_FROM_ACCOUNTS,
  TRASFER_RECURRING_FROM_ACCOUNTS,
  TRASFER_TO_ACCOUNTS
} from "utils/store/storeSchema";
import { ModalContext } from "Common/ModalProvider";
import { MessageContext } from "StyleGuide/Components";
import { unFormatCurrency } from "utils";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import {
  prepareCancelReviewMessage,
  prepareTransferErrorMessage,
  notSupportedFutureDatedTransfer,
  futureDateCrossCurrency,
  loadData,
  getCurrencies,
  getInitialTransferAccounts,
  prepareDataForExchangeAPICall,
  prepareTransferSuccessMessage,
  isToAccountValid
} from "./utils";
import useOneTimeReducer from "./useOneTimeReducer";
import {
  ON_CHANGE,
  LOADED_DATA,
  CLEAN_FORM,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  POSTING,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES,
  UPDATING_EXCHANGE_RATE,
  FAILED_CALL,
  SUCCESS_CALL,
  NO_CALL
} from "./constants";

export const url = "";

const useOneTime = () => {
  const [oneTimeState, updateState] = useOneTimeReducer();
  const isMounted = useIsMounted();
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const history = useHistory();
  const location = useLocation();

  const moveMoneyAnalytics = useMoveMoneyAnalytics(moneyMovementType.TRANSFER);

  useEffect(() => {
    if (location.pathname.includes("one-time") && location.hash === "#create") {
      moveMoneyAnalytics.started();
    }
  }, [location.hash, location.pathname]);

  useEffect(() => hideModal, []);

  const goBackAndChangeDate = () => {
    // put back today's date, we don't care if the same
    updateState({ type: ON_CHANGE, data: { name: "when", value: dayjs() } });
  };

  const handleAccountReset = fieldName => {
    // put back account selected to null
    if (fieldName === "when") {
      goBackAndChangeDate();
    } else {
      updateState({ type: ON_CHANGE, data: { name: fieldName, value: "" } });
      updateState({
        type: ON_CHANGE,
        data: { name: "isDisplayedToAmount", value: false }
      });
    }
  };

  const isFutureDated = (name, value) => {
    const futureDated = futureDateCrossCurrency(oneTimeState, name, value);
    if (futureDated.isFutureDatedCrossCurrency) {
      showModal({
        content: futureDated.message,
        onClose: () => {
          handleAccountReset(name);
        },
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={() => hideModal()}
            >
              OK
            </button>
          </>
        )
      });
    }
  };

  const goBack = () => {
    hideModal();
  };

  const onCleanForm = () => {
    updateState({ type: CLEAN_FORM });
  };

  const onGoToOverview = () => {
    history.push("/overview");
  };

  const onCancel = () => {
    hideModal();
    onCleanForm();
    history.push(`one-time#create`);
  };

  const onTryAgainGetExchangeRate = async tryAgainData => {
    hideModal();
    // eslint-disable-next-line no-use-before-define
    await updateExchangeRate({
      fieldToUpdate: tryAgainData.fieldToUpdate,
      exchangeAmount: tryAgainData.exchangeAmount,
      fromCurrency: tryAgainData.fromCurrency,
      toCurrency: tryAgainData.toCurrency,
      fieldName: tryAgainData.fieldName,
      fieldValue: tryAgainData.fieldValue
    });
  };

  const updateExchangeRate = async ({
    fieldToUpdate,
    exchangeAmount,
    fromCurrency,
    toCurrency,
    fieldName, // "to" or "from"
    fieldValue
  }) => {
    // case change is coming from 'from' or 'to'
    const tryAgainData = {
      fieldToUpdate,
      exchangeAmount,
      fromCurrency,
      toCurrency,
      fieldName,
      fieldValue
    };
    if (fieldName && fieldValue) {
      const currencies = getCurrencies(oneTimeState, fieldName, fieldValue);
      ({ fromCurrency, toCurrency } = currencies);
    }
    if (
      fromCurrency &&
      toCurrency &&
      fromCurrency !== toCurrency &&
      exchangeAmount &&
      exchangeAmount !== "$0.00" &&
      parseFloat(unFormatCurrency(exchangeAmount)).toFixed(2) !== "0.00"
    ) {
      try {
        updateState({ type: UPDATING_EXCHANGE_RATE, data: true });
        const data = prepareDataForExchangeAPICall(
          fieldToUpdate,
          exchangeAmount,
          fromCurrency,
          toCurrency
        );

        const result = await manualApiSend({
          url: `${transfersUrl}/exchangerate`,
          data,
          verb: "POST"
        });
        if (!isMounted()) {
          return null;
        }
        updateState({
          type: UPDATE_EXCHANGE_RATE,
          data: { result, fieldToUpdate }
        });
        updateState({ type: UPDATING_EXCHANGE_RATE, data: false });

        // to be able to trigger validation
        return {
          type: SUCCESS_CALL,
          fromAmount: parseFloat(result.data.fromAmount).toFixed(2),
          toAmount: parseFloat(result.data.toAmount).toFixed(2),
          fromCurrency
        };
      } catch (error) {
        if (!isMounted()) {
          return null;
        }
        updateState({ type: UPDATING_EXCHANGE_RATE, data: false });
        showModal({
          content: transferErrors.MSG_RBTR_054(),
          actions: (
            <>
              <button
                type="button"
                className="ui button basic"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="ui button basic"
                onClick={() => onTryAgainGetExchangeRate(tryAgainData)}
              >
                Try again
              </button>
            </>
          )
        });
        return FAILED_CALL;
      }
    }
    return NO_CALL;
  };

  const onChange = ({ name, value }) => {
    updateState({ type: ON_CHANGE, data: { name, value } });
    updateState({ type: UPDATE_CURRENCIES, data: { name, value } });
    updateState({
      type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
      data: { name, value }
    });

    isFutureDated(name, value);

    if (notSupportedFutureDatedTransfer(oneTimeState, name, value)) {
      showModal({
        content: transferErrors.MSG_RBTR_026_FDT(),
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={() => {
                goBackAndChangeDate();
                hideModal();
              }}
            >
              OK
            </button>
          </>
        )
      });
    }
  };

  useEffect(() => {
    if (location.hash !== "#create") {
      return;
    }

    const { to, from } = getInitialTransferAccounts(oneTimeState, location);
    if (to) {
      onChange({ name: "to", value: to });
    }
    if (from) {
      onChange({ name: "from", value: from });
    }
  }, [location, oneTimeState.toAccounts, oneTimeState.fromAccounts]);

  const showTransferError = error => {
    const errorMessage = prepareTransferErrorMessage(oneTimeState, error);
    return showModal({
      content: errorMessage,
      actions: (
        <button type="button" className="ui button basic" onClick={goBack}>
          OK
        </button>
      )
    });
  };

  const onTransfer = async nextTab => {
    updateState({ type: POSTING, data: true });
    const errorMessage = isToAccountValid(oneTimeState);
    if (errorMessage) {
      if (!isMounted()) {
        return;
      }
      updateState({ type: POSTING, data: false });
      showModal({
        content: errorMessage,
        actions: (
          <button type="button" className="ui button basic" onClick={goBack}>
            OK
          </button>
        )
      });
      return;
    }
    try {
      await manualApiSend({
        url: `${transfersUrl}/`,
        data: oneTimeState.preparedDataForPost,
        keys: [
          SCHEDULED_TRANSFERS,
          TRASFER_IMMEDIATE_FROM_ACCOUNTS,
          TRASFER_FUTURE_DATED_FROM_ACCOUNTS,
          TRASFER_RECURRING_FROM_ACCOUNTS,
          TRASFER_TO_ACCOUNTS
        ] // one we want to clear from the cache
      });

      const { dataOneTime } = await loadData();
      if (!isMounted()) {
        return;
      }
      moveMoneyAnalytics.success(oneTimeState);
      updateState({ type: LOADED_DATA, data: dataOneTime });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: transferErrors.MSG_RBTR_004_OLD
      });
      const successMessage = prepareTransferSuccessMessage(oneTimeState);
      updateState({
        type: ON_CHANGE,
        data: { name: "successMessage", value: successMessage }
      });
      updateState({ type: POSTING, data: false });
      onCleanForm();
      nextTab();
    } catch (error) {
      if (!isMounted()) {
        return;
      }
      moveMoneyAnalytics.failed(oneTimeState);
      updateState({ type: POSTING, data: false });
      showTransferError(error);
    }
  };

  const prepareDataForReview = () => {
    updateState({ type: PREPARE_DATA_FOR_REVIEW });
  };

  const prepareDataForPost = () => {
    updateState({ type: PREPARE_DATA_FOR_POST });
  };

  const onSendAnotherTransfer = () => {
    onCleanForm();
    history.push(`one-time#create`);
  };

  const onCancelReview = () => {
    const cancelReviewModalMessage = prepareCancelReviewMessage(oneTimeState);
    showModal({
      content: cancelReviewModalMessage,
      actions: (
        <>
          <button type="button" className="ui button basic" onClick={goBack}>
            Back
          </button>
          <button type="button" className="ui button basic" onClick={onCancel}>
            Confirm
          </button>
        </>
      )
    });
  };

  const noRequirementsMetAlert = useCallback(() => {
    if (isMounted()) {
      showModal({
        content: transferErrors.MSG_RBTR_040(),
        actions: (
          <button
            type="button"
            className="ui button basic"
            onClick={() => {
              if (location.state) {
                history.goBack();
              } else {
                history.push("/overview");
              }
            }}
          >
            OK
          </button>
        )
      });
    }
  }, [hideModal, showModal, history, location.state]);

  return {
    oneTimeState,
    updateStateOneTime: updateState,
    history,
    show: showModal,
    hide: hideModal,
    showMessage,
    onCleanForm,
    prepareDataForReview,
    prepareDataForPost,
    onSendAnotherTransfer,
    onTransfer,
    onCancelReview,
    noRequirementsMetAlert,
    goBackAndChangeDate,
    goBack,
    onCancel,
    onChange,
    updateExchangeRate,
    handleAccountReset,
    isFutureDated,
    onGoToOverview
  };
};
export default useOneTime;
