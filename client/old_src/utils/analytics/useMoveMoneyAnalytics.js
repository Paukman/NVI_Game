import mixpanel from "mixpanel-browser";

import {
  mapBillPayment,
  mapTransfer,
  mapETransferSend,
  mapETransferRequest
} from "./mapMoveMoney";

// Transfer Type
export const moneyMovementType = {
  BILL_PAYMENT: "Bill Payment",
  TRANSFER: "Transfer",
  E_TRANSFER_SEND: "e-Transfer send",
  E_TRANSFER_REQUEST: "e-Transfer request"
};

const mapper = {
  [moneyMovementType.BILL_PAYMENT]: mapBillPayment,
  [moneyMovementType.TRANSFER]: mapTransfer,
  [moneyMovementType.E_TRANSFER_SEND]: mapETransferSend,
  [moneyMovementType.E_TRANSFER_REQUEST]: mapETransferRequest
};

const useMoveMoneyAnalytics = transferType => {
  const track = (eventName, props) => {
    mixpanel.track(eventName, props);
  };

  const started = async () => {
    track("Money Movement Started", { transferType });
  };

  const review = async props => {
    track("Money Movement Information Completed", {
      transferType,
      ...mapper[transferType](props)
    });
  };

  const confirm = async props => {
    track("Money Movement Confirm Transaction", {
      transferType,
      ...mapper[transferType](props)
    });
  };

  const success = async props => {
    track("Money Movement Success", {
      transferType,
      ...mapper[transferType](props)
    });
  };

  const failed = async props => {
    track("Money Movement Failed", {
      transferType,
      ...mapper[transferType](props)
    });
  };

  const duplicatePayment = async props => {
    const trackProps = {
      transferType,
      ...mapper[transferType](props.state)
    };
    track("Duplicate Bill Payment", {
      ...trackProps,
      actionTaken: props.action
    });
  };

  return { started, review, confirm, success, failed, duplicatePayment };
};

export default useMoveMoneyAnalytics;
