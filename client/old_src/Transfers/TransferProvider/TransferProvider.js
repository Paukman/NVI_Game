import PropTypes from "prop-types";
import React, { createContext } from "react";
import useMoveMoneyAnalytics, {
  moneyMovementType
} from "utils/analytics/useMoveMoneyAnalytics";
import useOneTime from "./hooks/useOneTime";
import useRecurring from "./hooks/useRecurring";
import useScheduled from "./hooks/useScheduled";
import useLoadData from "./hooks/useLoadData";
import {
  persistDataBetweenForms,
  handleOnSendAnotherTransferOneTime,
  handleOnSendAnotherTransferRecurring
} from "./hooks/utils";

export const TransferContext = createContext();

const TransferProvider = ({ children }) => {
  TransferProvider.propTypes = {
    children: PropTypes.node.isRequired
  };

  const oneTime = useOneTime();
  const recurring = useRecurring();
  const scheduled = useScheduled();
  const moveMoneyAnalytics = useMoveMoneyAnalytics(moneyMovementType.TRANSFER);

  useLoadData(
    oneTime.updateStateOneTime,
    recurring.updateStateRecurring,
    oneTime.noRequirementsMetAlert
  );

  const onFieldsChanges = ({ name, value }) => {
    persistDataBetweenForms({ name, value }, oneTime, recurring);
  };

  const onSendAnotherTransferOneTime = () => {
    handleOnSendAnotherTransferOneTime(oneTime, recurring);
  };

  const onSendAnotherTransferRecurring = () => {
    handleOnSendAnotherTransferRecurring(oneTime, recurring);
  };

  // Would be ideal to call analytics.review inside the oneTime and recurring hooks. However,
  // doing so breaks tests for a reason I can't figure out.
  const oneTimePrepareForReview = () => {
    oneTime.prepareDataForReview();
    moveMoneyAnalytics.review(oneTime.oneTimeState);
  };
  const recurringPrepareForReview = () => {
    recurring.prepareDataForReview();
    moveMoneyAnalytics.review(recurring.recurringState);
  };

  return (
    <TransferContext.Provider
      value={{
        oneTimeTransfer: {
          state: oneTime.oneTimeState,
          onChange: onFieldsChanges,
          onTransfer: oneTime.onTransfer,
          onCancelReview: oneTime.onCancelReview,
          onSendAnotherTransfer: onSendAnotherTransferOneTime,
          prepareDataForReview: oneTimePrepareForReview,
          prepareDataForPost: oneTime.prepareDataForPost,
          updateExchangeRate: oneTime.updateExchangeRate,
          onGoToOverview: oneTime.onGoToOverview
        },
        recurringTransfer: {
          state: recurring.recurringState,
          updateEndDateNoOfTransfersMessage:
            recurring.updateEndDateNoOfTransfersMessage,
          onChange: onFieldsChanges,
          onTransfer: recurring.onTransfer,
          onCancelReview: recurring.onCancelReview,
          onSendAnotherTransfer: onSendAnotherTransferRecurring,
          prepareDataForReview: recurringPrepareForReview,
          prepareDataForPost: recurring.prepareDataForPost
        },
        scheduledTransfer: {
          isViewingDetails: scheduled.viewDetailsState,
          setIsViewingDetails: scheduled.setViewDetailsState
        }
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};
export default TransferProvider;
