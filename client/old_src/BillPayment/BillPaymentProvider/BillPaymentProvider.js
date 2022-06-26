import PropTypes from "prop-types";
import React, { createContext } from "react";
import useOneTime from "./hooks/useOneTime";
import useRecurring from "./hooks/useRecurring";
import useLoadData from "./hooks/useLoadData";
import {
  persistDataBetweenForms,
  handleOnPayAnotherBillOneTime,
  handleOnPayAnotherBillRecurring
} from "./hooks/utils";

export const BillPaymentContext = createContext();

const BillPaymentProvider = ({ children }) => {
  BillPaymentProvider.propTypes = {
    children: PropTypes.node.isRequired
  };
  const oneTime = useOneTime();
  const recurring = useRecurring();
  const { handleAddPayee } = useLoadData(
    oneTime.updateStateOneTime,
    recurring.updateStateRecurring
  );

  const onFieldsChanges = ({ name, value }) => {
    persistDataBetweenForms({ name, value }, oneTime, recurring);
  };

  const onPayAnotherBillOneTime = () => {
    handleOnPayAnotherBillOneTime(oneTime, recurring);
  };

  const onPayAnotherBillRecurring = () => {
    handleOnPayAnotherBillRecurring(oneTime, recurring);
  };

  return (
    <BillPaymentContext.Provider
      value={{
        handleAddPayee,
        oneTimeBillPay: {
          state: oneTime.oneTimeBillState,
          onChange: onFieldsChanges,
          creditAccountWarning: oneTime.creditAccountWarning,
          prepareDataForReview: oneTime.prepareDataForReview,
          onCancelReview: oneTime.onCancelReview,
          onCleanForm: oneTime.onCleanForm,
          prepareDataForPost: oneTime.prepareDataForPost,
          onPayBill: oneTime.onPayBill,
          onPayAnotherBill: onPayAnotherBillOneTime,
          updateExchangeRate: oneTime.updateExchangeRate,
          onGoToOverview: oneTime.onGoToOverview,
          checkForDoublePayments: oneTime.checkForDoublePayments,
          onShowDuplicatePayment: oneTime.onShowDuplicatePayment,
          onChangeSingleValue: oneTime.onChangeSingleValue
        },
        recurringBillPay: {
          state: recurring.recurringBillState,
          onChange: onFieldsChanges,
          creditAccountWarning: recurring.creditAccountWarning,
          updateEndDateNoOfPaymentsMessage:
            recurring.updateEndDateNoOfPaymentsMessage,
          prepareDataForReview: recurring.prepareDataForReview,
          onCancelReview: recurring.onCancelReview,
          onCleanForm: recurring.onCleanForm,
          prepareDataForPost: recurring.prepareDataForPost,
          onPayBill: recurring.onPayBill,
          onPayAnotherBill: onPayAnotherBillRecurring,
          checkForDoublePayments: recurring.checkForDoublePayments,
          onShowDuplicatePayment: recurring.onShowDuplicatePayment,
          onChangeSingleValue: recurring.onChangeSingleValue
        }
      }}
    >
      {children}
    </BillPaymentContext.Provider>
  );
};

export default BillPaymentProvider;
