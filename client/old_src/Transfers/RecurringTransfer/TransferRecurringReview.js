import React, { useContext } from "react";
import PropTypes from "prop-types";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import useRedirect from "utils/hooks/useRedirect";
import { Button } from "StyleGuide/Components";
import { TransferContext } from "../TransferProvider";
import "styles/forms/global.scss";

const TransferRecurringReview = props => {
  TransferRecurringReview.propTypes = {
    prevTab: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };

  const { prevTab, nextTab } = props;

  const { recurringTransfer } = useContext(TransferContext);
  const { preparedDataForReview, isPosting } = recurringTransfer.state;
  const { onCancelReview, onTransfer } = recurringTransfer;

  useRedirect("#create", !recurringTransfer.state.createCompleted);

  if (!recurringTransfer.state.createCompleted) {
    return null;
  }

  const onHandleTransfer = () => {
    onTransfer(nextTab);
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
            <Button
              primary
              block
              onClick={onHandleTransfer}
              loading={isPosting}
            >
              {isPosting ? null : "Send"}
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

export default TransferRecurringReview;
