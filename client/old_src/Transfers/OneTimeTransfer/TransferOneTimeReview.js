import React, { useContext } from "react";
import PropTypes from "prop-types";
import LabelDetails from "Common/ReviewLabelDetails/LabelDetails";
import useRedirect from "utils/hooks/useRedirect";
import { Button } from "StyleGuide/Components";
import { TransferContext } from "../TransferProvider";
import "styles/forms/global.scss";

const TransferOneTimeReview = props => {
  TransferOneTimeReview.propTypes = {
    prevTab: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };

  const { prevTab, nextTab } = props;

  const { oneTimeTransfer } = useContext(TransferContext);
  const { onCancelReview, onTransfer, state } = oneTimeTransfer;

  useRedirect("#create", !state.createCompleted);

  if (!oneTimeTransfer.state.createCompleted) {
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
        <LabelDetails labelData={state.preparedDataForReview} />
        <div className="button-container">
          <div className="primary-button">
            <Button
              primary
              block
              onClick={onHandleTransfer}
              loading={state.isPosting}
            >
              {state.isPosting ? null : "Send"}
            </Button>
          </div>
          <div className="bordered-button">
            <Button
              block
              onClick={onHandleEdit}
              unclickable={state.isPosting}
              secondary
            >
              Edit
            </Button>
          </div>
          <div className="text-button">
            <Button
              block
              onClick={onHandleCancel}
              unclickable={state.isPosting}
              text
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TransferOneTimeReview;
