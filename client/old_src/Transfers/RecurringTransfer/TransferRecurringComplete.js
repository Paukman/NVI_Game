import React, { useContext } from "react";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import checkMarkIcon from "assets/icons/CheckMark/checkmark-green.svg";
import useRedirect from "utils/hooks/useRedirect";
import { qualtricsIDs } from "globalConstants";
import { transferErrors } from "utils/MessageCatalog";
import { Button } from "StyleGuide/Components";
import { TransferContext } from "../TransferProvider";
import "styles/forms/global.scss";

const TransferRecurringComplete = () => {
  const { recurringTransfer } = useContext(TransferContext);
  const { preparedDataForReview } = recurringTransfer.state;
  const { onSendAnotherTransfer } = recurringTransfer;

  useRedirect("#create", !recurringTransfer.state.createCompleted);

  if (!recurringTransfer.state.createCompleted) {
    return null;
  }

  const onHandleSendAnotherTransfer = () => {
    onSendAnotherTransfer();
  };

  return (
    <>
      <div
        className="move-money-complete-label tablet"
        id={qualtricsIDs.recurringTransfer}
      >
        <img className="checkmark-icon" alt="Check Mark" src={checkMarkIcon} />
        <span
          className="label"
          data-testid="recurring-complete-success-message"
        >
          {transferErrors.MSG_RBTR_004_RECURRING}
        </span>
      </div>
      <form className="rebank-form review-form">
        <LabelDetails labelData={preparedDataForReview} />
        <div className="button-container">
          <div className="bordered-button complete-page-button">
            <Button secondary block onClick={onHandleSendAnotherTransfer}>
              Send another transfer
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TransferRecurringComplete;
