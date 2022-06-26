import React, { useContext } from "react";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";
import useRedirect from "utils/hooks/useRedirect";
import { qualtricsIDs } from "globalConstants";
import { DynamicButton } from "StyleGuide/Components";
import { BillPaymentContext } from "../BillPaymentProvider";
import "styles/forms/global.scss";

const BillPaymentRecurringComplete = () => {
  const { recurringBillPay } = useContext(BillPaymentContext);
  const { preparedDataForReview, successMessage } = recurringBillPay.state;
  const { onPayAnotherBill } = recurringBillPay;

  useRedirect("#create", !recurringBillPay.state.createCompleted);

  if (!recurringBillPay.state.createCompleted) {
    return null;
  }

  const onHandlePayAnotherBill = () => {
    onPayAnotherBill();
  };

  return (
    <>
      <div
        className="move-money-complete-label tablet"
        id={qualtricsIDs.recurringPayment}
      >
        <img className="checkmark-icon" alt="Check Mark" src={checkMarkIcon} />
        <span className="label">{successMessage}</span>
      </div>
      <form className="rebank-form review-form">
        <LabelDetails labelData={preparedDataForReview} />
        <div className="button-container">
          <DynamicButton
            className="bill-payment-complete-button"
            onClick={onHandlePayAnotherBill}
            secondary
            id="bill-payment-recurring-complete-buttons-pay-another-bill"
          >
            Pay another bill
          </DynamicButton>
        </div>
      </form>
    </>
  );
};

export default BillPaymentRecurringComplete;
