import React, { useContext, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import dayjs from "dayjs";
import { billPaymentErrors } from "utils/MessageCatalog";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import { billPaymentsBaseUrl, manualApiSend, transfersUrl } from "api";
import { MessageContext } from "StyleGuide/Components";
import { unFormatCurrency } from "utils";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import {
  BILL_PAYMENT_IMMEDIATE_ACCOUNTS,
  SCHEDULED_PAYMENTS
} from "utils/store/storeSchema";
import DataStore from "utils/store";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import useIsMounted from "utils/hooks/useIsMounted";
import { ModalContext } from "Common/ModalProvider";
import useNonExistingPayee from "./useNonExistingPayee";
import { amountExchangeRate, amountRange } from "../../constants";
import useCheckDuplicatePayments from "./useCheckDuplicatePayments";

import {
  preparePaymentSuccessMessage,
  preparePaymentErrorMessage,
  prepareCancelReviewMessage,
  loadAccountAndPayee,
  getCurrencies,
  prepareDataForExchangeAPICall,
  getFutureDateCrossCurrencyError,
  getInitialBillPaymentAccounts,
  prepareDuplicatePaymentMessage
} from "./utils";
import {
  LOADED_DATA,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES,
  UPDATING_EXCHANGE_RATE,
  FAILED_CALL,
  SUCCESS_CALL,
  NO_CALL,
  EXCEEDING_AMOUNT,
  UPDATE_ACCOUNTS_FOR_ELIGIBILITY
} from "./constants";
import useOneTimeReducer, {
  ON_CHANGE,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  POSTING,
  CLEAN_FORM,
  UPDATE_SUCCESS_MESSAGE
} from "./useOneTimeReducer";

const useOneTime = () => {
  const isMounted = useIsMounted();
  const [oneTimeBillState, updateState] = useOneTimeReducer();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const location = useLocation();
  const history = useHistory();
  const { post } = useApiWithRSA();
  const { showNonExistingPayeeAlert } = useNonExistingPayee();

  useCheckDuplicatePayments(oneTimeBillState, updateState);
  const moveMoneyAnalytics = useMoveMoneyAnalytics(
    moneyMovementType.BILL_PAYMENT
  );

  useEffect(() => {
    if (location.pathname.includes("one-time") && location.hash === "#create") {
      moveMoneyAnalytics.started();
    }
  }, [location.hash, location.pathname]);

  const onGoToOverview = () => {
    history.push("/overview");
  };

  const goBack = () => {
    hideModal();
  };

  const onCleanForm = () => {
    updateState({ type: CLEAN_FORM });
  };

  const onCancel = () => {
    hideModal();
    onCleanForm();
    history.push(`one-time#create`);
  };

  const clearExchangeRateFields = fieldToUpdate => {
    updateState({
      type: ON_CHANGE,
      data: { name: "exchangeRateFormatted", value: "" }
    });
    if (fieldToUpdate === "amountTo") {
      updateState({
        type: ON_CHANGE,
        data: { name: "amountTo", value: "" }
      });
    } else {
      updateState({
        type: ON_CHANGE,
        data: { name: "amount", value: "" }
      });
    }
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
    if (
      fieldName &&
      fieldValue &&
      (fieldName === "to" || fieldName === "from")
    ) {
      const currencies = getCurrencies(oneTimeBillState, fieldName, fieldValue);
      ({ fromCurrency, toCurrency } = currencies);
    }
    if (
      fromCurrency &&
      toCurrency &&
      fromCurrency !== toCurrency &&
      exchangeAmount &&
      parseFloat(unFormatCurrency(exchangeAmount)).toFixed(2) !== "0.00" &&
      !(
        // don't even try getting exchange rate if above max limit
        (
          fromCurrency === "CAD" &&
          fieldName === "amount" &&
          parseFloat(unFormatCurrency(exchangeAmount)).toFixed(2) >
            amountRange.max
        )
      )
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
        // Prevent user from doing more than 50k CAD payment
        // on client side, due to exchange rate calculation difference
        // on BaS side (BOC vs ATB Customer rate).
        // Doing this has a drawback on not being able to distinguish between
        // normal and VIP customers ($50k vs $100k)
        if (result.data.fromAmount > amountExchangeRate.max) {
          updateState({ type: UPDATING_EXCHANGE_RATE, data: false });
          clearExchangeRateFields(fieldToUpdate);
          return {
            type: FAILED_CALL,
            error: EXCEEDING_AMOUNT,
            limit: amountExchangeRate.max
          };
        }
        updateState({
          type: UPDATE_EXCHANGE_RATE,
          data: { result, fieldToUpdate }
        });
        updateState({ type: UPDATING_EXCHANGE_RATE, data: false });
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
        if (
          error?.response?.data?.message ===
          "Amount exceedes maximum allowed amount of $50,000.00."
        ) {
          clearExchangeRateFields(fieldToUpdate);
          return {
            type: FAILED_CALL,
            error: EXCEEDING_AMOUNT,
            limit: amountExchangeRate.max
          };
        }
        if (
          error?.response?.data?.message ===
          "Amount exceedes maximum allowed amount of $100,000.00."
        ) {
          clearExchangeRateFields(fieldToUpdate);
          return {
            type: FAILED_CALL,
            error: EXCEEDING_AMOUNT,
            limit: amountExchangeRate.maxVIP
          };
        }
        showModal({
          content: billPaymentErrors.MSG_RBTR_054(),
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
    const futureDated = getFutureDateCrossCurrencyError(
      oneTimeBillState,
      name,
      value
    );
    if (futureDated?.isFutureDatedCrossCurrency) {
      showModal({
        content: futureDated?.message,
        onClose: () => {
          handleAccountReset(name);
        },
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
    }
  };

  const onCancelCreditCardWarning = () => {
    hideModal();
    history.push(`one-time#create`);
  };

  const onPayAnotherBill = () => {
    onCleanForm();
    history.push(`one-time#create`);
  };

  const onCancelReview = () => {
    const cancelReviewModalMessage = prepareCancelReviewMessage(
      oneTimeBillState
    );
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

  const prepareDataForReview = () => {
    moveMoneyAnalytics.review(oneTimeBillState);
    updateState({ type: PREPARE_DATA_FOR_REVIEW });
  };

  const prepareDataForPost = () => {
    updateState({ type: PREPARE_DATA_FOR_POST });
  };

  const showPaymentError = error => {
    const errorMessage = preparePaymentErrorMessage(oneTimeBillState, error);
    return showModal({
      content: errorMessage,
      actions: (
        <button type="button" className="ui button basic" onClick={goBack}>
          OK
        </button>
      )
    });
  };

  const onPayBill = async nextTab => {
    updateState({ type: POSTING, data: true });

    try {
      await post(
        `${billPaymentsBaseUrl}/billpayments`,
        oneTimeBillState.preparedDataForPost
      );
      DataStore.del(BILL_PAYMENT_IMMEDIATE_ACCOUNTS);
      DataStore.del(SCHEDULED_PAYMENTS);

      const { dataOneTime } = await loadAccountAndPayee();
      if (!isMounted()) {
        return;
      }

      moveMoneyAnalytics.success(oneTimeBillState);

      updateState({ type: LOADED_DATA, data: dataOneTime });
      const successMessage = preparePaymentSuccessMessage(oneTimeBillState);
      updateState({ type: UPDATE_SUCCESS_MESSAGE, data: successMessage });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: successMessage
      });
      updateState({ type: POSTING, data: false });
      onCleanForm();
      nextTab();
    } catch (error) {
      moveMoneyAnalytics.failed(oneTimeBillState);
      updateState({ type: POSTING, data: false });
      if (error) {
        showPaymentError(error);
      }
    }
  };

  const onChange = ({ name, value }) => {
    updateState({ type: ON_CHANGE, data: { name, value } });
    updateState({ type: UPDATE_CURRENCIES, data: { name, value } });
    isFutureDated(name, value);
    updateState({
      type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
      data: { name, value }
    });
  };

  useEffect(() => {
    if (location.hash !== "#create") return;

    const { to, from } = getInitialBillPaymentAccounts(
      oneTimeBillState,
      location
    );
    const shouldAddAsNewPayee =
      !to && location.to && oneTimeBillState.billPayees.length;

    if (to) {
      onChange({ name: "to", value: to });
    } else if (shouldAddAsNewPayee) {
      showNonExistingPayeeAlert(location.to);
    }

    if (from) {
      onChange({ name: "from", value: from });
    }
  }, [location, oneTimeBillState.billPayees, oneTimeBillState.fromAccounts]);

  const creditAccountWarning = () => {
    const found = oneTimeBillState.fromAccounts.filter(
      account =>
        account.type === "CreditCard" && account.id === oneTimeBillState.from
    ).length;

    if (found) {
      showModal({
        content: billPaymentErrors.CREDIT_CARD_WARNING(),
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={onCancelCreditCardWarning}
            >
              Cancel
            </button>
            <button type="button" className="ui button basic" onClick={goBack}>
              OK
            </button>
          </>
        )
      });
    }
    return found;
  };

  const checkForDoublePayments = async nextTab => {
    // trigger the hook and show review
    updateState({
      type: ON_CHANGE,
      data: { name: "fetchingPayments", value: true }
    });
    nextTab();
  };

  const onContinueDuplicatePayment = async nextTab => {
    moveMoneyAnalytics.duplicatePayment({
      state: oneTimeBillState,
      action: "Continue"
    });
    hideModal();
    await onPayBill(nextTab);
  };

  const onCancelDuplicatePayment = () => {
    moveMoneyAnalytics.duplicatePayment({
      state: oneTimeBillState,
      action: "Cancel"
    });
    onCancel();
  };

  const onShowDuplicatePayment = async (nextTab, duplicatePayment) => {
    const messageContent = prepareDuplicatePaymentMessage(duplicatePayment);
    if (messageContent) {
      showModal({
        content: messageContent,
        actions: (
          <>
            <button
              type="button"
              className="ui button basic"
              onClick={onCancelDuplicatePayment}
              id="duplicateCancelBtn"
            >
              Cancel
            </button>
            <button
              type="button"
              className="ui button basic"
              onClick={() => onContinueDuplicatePayment(nextTab)}
              id="duplicateContinueBtn"
            >
              Continue
            </button>
          </>
        )
      });
    } else {
      await onPayBill(nextTab);
    }
  };

  const onChangeSingleValue = ({ name, value }) => {
    updateState({ type: ON_CHANGE, data: { name, value } });
  };

  return {
    oneTimeBillState,
    onChange,
    prepareDataForReview,
    prepareDataForPost,
    onCancelReview,
    onCleanForm,
    onPayBill,
    onPayAnotherBill,
    creditAccountWarning,
    goBack,
    onCancel,
    updateStateOneTime: updateState,
    showPaymentError,
    onCancelCreditCardWarning,
    history,
    updateStateRecurring: updateState,
    show: showModal,
    hide: hideModal,
    showMessage,
    updateExchangeRate,
    handleAccountReset,
    isFutureDated,
    onGoToOverview,
    clearExchangeRateFields,
    checkForDoublePayments,
    onShowDuplicatePayment,
    onChangeSingleValue,
    onCancelDuplicatePayment,
    onContinueDuplicatePayment
  };
};

export default useOneTime;
