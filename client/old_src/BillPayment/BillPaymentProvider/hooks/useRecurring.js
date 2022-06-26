import React, { useContext, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import { billPaymentErrors } from "utils/MessageCatalog";
import useGetSnackbarTop from "utils/hooks/useGetSnackbarTop";
import DataStore from "utils/store";
import useApiWithRSA from "Common/Challenge/useApiWithRSA";
import { billPaymentsBaseUrl } from "api";
import {
  BILL_PAYMENT_RECURRING_ACCOUNTS,
  SCHEDULED_PAYMENTS
} from "utils/store/storeSchema";
import { ModalContext } from "Common/ModalProvider";
import { MessageContext } from "StyleGuide/Components";
import useIsMounted from "utils/hooks/useIsMounted";
import useRecurringReducer, {
  ON_CHANGE,
  UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE,
  PREPARE_DATA_FOR_REVIEW,
  CLEAN_FORM,
  PREPARE_DATA_FOR_POST,
  POSTING,
  UPDATE_SUCCESS_MESSAGE
} from "./useRecurringReducer";
import { LOADED_DATA, UPDATE_ACCOUNTS_FOR_ELIGIBILITY } from "./constants";
import {
  preparePaymentSuccessMessage,
  preparePaymentErrorMessage,
  prepareCancelReviewMessage,
  loadAccountAndPayee
} from "./utils";

const useRecurring = () => {
  const isMounted = useIsMounted();
  const [recurringBillState, updateState] = useRecurringReducer();
  const { show: showModal, hide: hideModal } = useContext(ModalContext);
  const { show: showMessage } = useContext(MessageContext);
  const { snackbarTop } = useGetSnackbarTop();
  const history = useHistory();
  const location = useLocation();
  const { post } = useApiWithRSA();
  const moveMoneyAnalytics = useMoveMoneyAnalytics(
    moneyMovementType.BILL_PAYMENT
  );

  useEffect(() => {
    if (
      location.pathname.includes("recurring") &&
      location.hash === "#create"
    ) {
      moveMoneyAnalytics.started();
    }
  }, [location.hash, location.pathname]);

  const goBack = () => {
    hideModal();
  };

  const onCleanForm = () => {
    updateState({ type: CLEAN_FORM });
  };

  const confirm = () => {
    hideModal();
    onCleanForm();
    history.push(`recurring#create`);
  };

  const onCancelCreditCardWarning = () => {
    hideModal();
    history.push(`recurring#create`);
  };

  const onPayAnotherBill = () => {
    onCleanForm();
    history.push(`recurring#create`);
  };

  const creditAccountWarning = () => {
    const found = recurringBillState.fromAccounts.filter(
      account =>
        account.type === "CreditCard" && account.id === recurringBillState.from
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

  const onCancelReview = () => {
    const cancelReviewModalMessage = prepareCancelReviewMessage(
      recurringBillState,
      true
    );
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

  const prepareDataForReview = () => {
    moveMoneyAnalytics.review(recurringBillState);
    updateState({ type: PREPARE_DATA_FOR_REVIEW });
  };

  const onChange = ({ name, value }) => {
    updateState({ type: ON_CHANGE, data: { name, value } });
    updateState({
      type: UPDATE_ACCOUNTS_FOR_ELIGIBILITY,
      data: { name, value }
    });
  };

  const updateEndDateNoOfPaymentsMessage = () => {
    updateState({ type: UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE });
  };

  const prepareDataForPost = () => {
    updateState({ type: PREPARE_DATA_FOR_POST });
  };

  const showPaymentError = error => {
    const errorMessage = preparePaymentErrorMessage(recurringBillState, error);
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
        recurringBillState.preparedDataForPost
      );
      DataStore.del(BILL_PAYMENT_RECURRING_ACCOUNTS);
      DataStore.del(SCHEDULED_PAYMENTS);

      const { dataRecurring } = await loadAccountAndPayee();
      if (!isMounted()) {
        return;
      }

      moveMoneyAnalytics.success(recurringBillState);

      updateState({ type: LOADED_DATA, data: dataRecurring });
      const successMessage = preparePaymentSuccessMessage(
        recurringBillState,
        true
      );
      updateState({ type: UPDATE_SUCCESS_MESSAGE, data: successMessage });
      showMessage({
        type: "success",
        top: snackbarTop,
        content: successMessage
      });
      nextTab();
    } catch (error) {
      moveMoneyAnalytics.failed(recurringBillState);
      if (error) {
        showPaymentError(error);
      }
    } finally {
      updateState({ type: POSTING, data: false });
    }
  };

  return {
    onChange,
    updateEndDateNoOfPaymentsMessage,
    prepareDataForReview,
    prepareDataForPost,
    onCancelReview,
    onCleanForm,
    goBack,
    confirm,
    onPayBill,
    onPayAnotherBill,
    showPaymentError,
    creditAccountWarning,
    onCancelCreditCardWarning,
    history,
    recurringBillState,
    updateStateRecurring: updateState,
    show: showModal,
    hide: hideModal,
    showMessage
  };
};

export default useRecurring;
