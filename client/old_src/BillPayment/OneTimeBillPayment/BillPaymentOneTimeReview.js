import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import useRedirect from "utils/hooks/useRedirect";
import { Button } from "StyleGuide/Components";
import useInterval from "utils/hooks/useInterval";
import { BillPaymentContext } from "../BillPaymentProvider";
import "styles/forms/global.scss";

const BillPaymentOneTimeReview = props => {
  BillPaymentOneTimeReview.propTypes = {
    prevTab: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };

  const { prevTab, nextTab } = props;

  const { oneTimeBillPay } = useContext(BillPaymentContext);
  const {
    preparedDataForReview,
    isPosting,
    fetchingPayments,
    matchingPayments
  } = oneTimeBillPay.state;
  const {
    onCancelReview,
    onPayBill,
    onShowDuplicatePayment,
    onChangeSingleValue
  } = oneTimeBillPay;
  const [fetchingInterval, setFetchingInterval] = useState(500);
  const [payBillClicked, setPayBillClick] = useState(false);

  useRedirect("#create", !oneTimeBillPay.state.createCompleted);

  const onHandlePayBill = () => {
    setPayBillClick(true); // need to track this for call from useInterval
    onChangeSingleValue({ name: "isPosting", value: true });
    if (!fetchingPayments) {
      setPayBillClick(false);
      if (matchingPayments && matchingPayments.length) {
        onShowDuplicatePayment(nextTab, matchingPayments[0]); // just show most recent if more then one
      } else {
        onPayBill(nextTab);
      }
    }
  };
  const shouldCallPayBill = !fetchingPayments && payBillClicked;

  useInterval(() => {
    if (shouldCallPayBill) {
      setFetchingInterval(null);
      onHandlePayBill();
    }
  }, fetchingInterval);

  if (!oneTimeBillPay.state.createCompleted) {
    return null;
  }

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

export default BillPaymentOneTimeReview;
