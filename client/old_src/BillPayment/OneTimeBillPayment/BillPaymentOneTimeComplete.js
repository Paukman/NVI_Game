import React, { useContext } from "react";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";
import useRedirect from "utils/hooks/useRedirect";
import { qualtricsIDs } from "globalConstants";
import { Button } from "StyleGuide/Components";
import DataStore from "utils/store";
import { ACCOUNTS_OVERVIEW_ALL_ACCOUNTS } from "utils/store/storeSchema";
import { BillPaymentContext } from "../BillPaymentProvider";
import "styles/forms/global.scss";

const BillPaymentOneTimeComplete = () => {
  const { oneTimeBillPay } = useContext(BillPaymentContext);
  const { onPayAnotherBill, onGoToOverview, state } = oneTimeBillPay;

  // clear the cache for accounts overview
  DataStore.del(ACCOUNTS_OVERVIEW_ALL_ACCOUNTS);
  useRedirect("#create", !oneTimeBillPay.state.createCompleted);

  if (!oneTimeBillPay.state.createCompleted) {
    return null;
  }

  const onHandlePayAnotherBill = () => {
    onPayAnotherBill();
  };

  const onHandleGoToOverview = () => {
    onGoToOverview();
  };

  return (
    <>
      <div
        className="move-money-complete-label tablet"
        id={qualtricsIDs.oneTimePayment}
      >
        <img className="checkmark-icon" alt="Check Mark" src={checkMarkIcon} />
        <span className="label">{state.successMessage}</span>
      </div>
      <form className="rebank-form review-form">
        <LabelDetails labelData={state.preparedDataForComplete} />
        <div className="button-container">
          <div className="bordered-button">
            <Button block secondary onClick={onHandlePayAnotherBill}>
              Pay another bill
            </Button>
          </div>
          {state.enableFeatureToggle && (
            <div className="text-button">
              <Button block text onClick={onHandleGoToOverview}>
                Go to Overview
              </Button>
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default BillPaymentOneTimeComplete;
