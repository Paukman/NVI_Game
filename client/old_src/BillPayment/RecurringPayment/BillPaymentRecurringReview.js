import React, { useContext } from "react";
import PropTypes from "prop-types";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import useRedirect from "utils/hooks/useRedirect";
import { Button } from "StyleGuide/Components";
import { BillPaymentContext } from "../BillPaymentProvider";
import "styles/forms/global.scss";

const BillPaymentRecurringReview = props => {
  BillPaymentRecurringReview.propTypes = {
    prevTab: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };

  const { prevTab, nextTab } = props;

  const { recurringBillPay } = useContext(BillPaymentContext);
  const { preparedDataForReview, isPosting } = recurringBillPay.state;
  const { onCancelReview, onPayBill } = recurringBillPay;

  useRedirect("#create", !recurringBillPay.state.createCompleted);

  if (!recurringBillPay.state.createCompleted) {
    return null;
  }

  const onHandlePayBill = () => {
    onPayBill(nextTab);
  };

  const onHandleEdit = () => {
    prevTab();
  };

  const onHandleCancel = () => {
    onCancelReview();
  };

  return (
    <>
      <form className="rebank-form review-form">
        <LabelDetails labelData={preparedDataForReview} />
        <div className="button-container">
          <div className="primary-button">
            <Button primary block onClick={onHandlePayBill} loading={isPosting}>
              {isPosting ? null : "Pay bill"}
            </Button>
          </div>
          <div className="bordered-button">
            <Button
              block
              onClick={onHandleEdit}
              unclickable={isPosting}
              secondary
            >
              Edit
            </Button>
          </div>
          <div className="text-button">
            <Button block onClick={onHandleCancel} unclickable={isPosting} text>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default BillPaymentRecurringReview;
