import React, { useContext } from "react";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";
import useRedirect from "utils/hooks/useRedirect";
import { qualtricsIDs } from "globalConstants";
import { Button } from "StyleGuide/Components";
import DataStore from "utils/store";
import { ACCOUNTS_OVERVIEW_ALL_ACCOUNTS } from "utils/store/storeSchema";
import { TransferContext } from "../TransferProvider";
import "styles/forms/global.scss";

const TransferOneTimeComplete = () => {
  const { oneTimeTransfer } = useContext(TransferContext);
  const { onSendAnotherTransfer, onGoToOverview, state } = oneTimeTransfer;

  // clear the cache for accounts overview
  DataStore.del(ACCOUNTS_OVERVIEW_ALL_ACCOUNTS);

  useRedirect("#create", !state.createCompleted);

  if (!state.createCompleted) {
    return null;
  }

  const onHandleSendAnotherTransfer = () => {
    onSendAnotherTransfer();
  };

  const onHandleGoToOverview = () => {
    onGoToOverview();
  };

  return (
    <>
      <div
        className="move-money-complete-label tablet"
        id={qualtricsIDs.oneTimeTransfer}
      >
        <img className="checkmark-icon" alt="Check Mark" src={checkMarkIcon} />
        <span className="label" data-testid="onetime-complete-success-message">
          {state.successMessage}
        </span>
      </div>
      <form className="rebank-form review-form">
        <LabelDetails labelData={state.preparedDataForComplete} />
        <div className="button-container">
          <div className="bordered-button">
            <Button block secondary onClick={onHandleGoToOverview}>
              Go to overview
            </Button>
          </div>
          <div className="text-button" id="sendAnotherTransfer">
            <Button block text onClick={onHandleSendAnotherTransfer}>
              Send another transfer
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TransferOneTimeComplete;
