import React from "react";
import { formatCurrency } from "utils/formatCurrency";
import api, { etransfersBaseUrl, manualApiSend } from "api";
import { eTransferErrors, requestETransferErrors } from "utils/MessageCatalog";
import SuccessIcon from "assets/icons/Status/Success.svg";
import ErrorIcon from "assets/icons/Status/Error.svg";
import InProgressIcon from "assets/icons/Status/InProgress.svg";

export const cancelETransferAPI = async (
  eTransferId,
  recipientName,
  modal,
  showMessage,
  setIsCancelled,
  snackbarTop
) => {
  let deleteResult = null;
  try {
    deleteResult = await manualApiSend({
      verb: "DELETEWITHDATA",
      url: `${etransfersBaseUrl}/`,
      data: { eTransferId }
    });
    setIsCancelled(true);
    showMessage({
      top: snackbarTop,
      type: "success",
      content: eTransferErrors.MSG_RBET_037B(recipientName)
    });
    return deleteResult;
  } catch (err) {
    modal.show({
      content: eTransferErrors.MSG_RBET_037D,
      actions: (
        <button
          type="button"
          className="ui button basic"
          onClick={() => modal.hide()}
        >
          OK
        </button>
      )
    });
    return deleteResult;
  }
};

export const cancelRequestAPI = async (
  requestMoneyID,
  senderName,
  modal,
  showMessage,
  setIsCancelled,
  snackbarTop
) => {
  let deleteResult = null;
  try {
    deleteResult = await manualApiSend({
      verb: "DELETE",
      url: `${etransfersBaseUrl}/outgoingmoneyrequest/${requestMoneyID}`,
      data: {
        declineReason: "declined"
      }
    });
    setIsCancelled(true);
    showMessage({
      top: snackbarTop,
      type: "success",
      content: requestETransferErrors.MSG_RBET_067B(senderName)
    });
    return deleteResult;
  } catch (err) {
    modal.show({
      content: requestETransferErrors.MSG_RBET_067C,
      actions: (
        <button
          type="button"
          className="ui button basic"
          onClick={() => modal.hide()}
        >
          OK
        </button>
      )
    });
    return deleteResult;
  }
};

export const backOnCancelTransaction = async modal => {
  modal.hide();
};

export const confirmOnCancelTransfer = async (
  modal,
  setIsCancelling,
  showMessage,
  snackbarTop,
  eTransferId,
  recipientName,
  setIsCancelled
) => {
  modal.hide();
  setIsCancelling(true);
  await cancelETransferAPI(
    eTransferId,
    recipientName,
    modal,
    showMessage,
    setIsCancelled,
    snackbarTop
  );
  setIsCancelling(false);
};

export const confirmOnCancelRequest = async (
  modal,
  setIsCancelling,
  showMessage,
  snackbarTop,
  requestMoneyID,
  senderName,
  setIsCancelled
) => {
  modal.hide();
  setIsCancelling(true);
  await cancelRequestAPI(
    requestMoneyID,
    senderName,
    modal,
    showMessage,
    setIsCancelled,
    snackbarTop
  );
  setIsCancelling(false);
};

export const getRecipientEmail = recipient => {
  if (!recipient) return null;
  if (
    recipient &&
    recipient.notificationPreference &&
    recipient.notificationPreference.length > 0
  ) {
    const notificationPreference =
      recipient.notificationPreference.filter(
        selected =>
          selected.notificationHandleType === "Email" &&
          selected.isActive === true
      )[0] || null;
    if (notificationPreference)
      return notificationPreference.notificationHandle;
  }
  return null;
};

export const cancelETransfer = async (
  eTransferDetails,
  modal,
  showMessage,
  setIsCancelling,
  setIsCancelled,
  snackbarTop
) => {
  if (!eTransferDetails) return;
  const recipientName = eTransferDetails.aliasName;
  const recipientEmail = getRecipientEmail(eTransferDetails.recipient);
  const senderAccount = eTransferDetails.bankAccount;
  modal.show({
    content: eTransferErrors.MSG_RBET_037(
      senderAccount,
      recipientName,
      recipientEmail,
      formatCurrency(eTransferDetails.amount.value)
    ),
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            backOnCancelTransaction(modal);
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="ui button basic"
          data-testid="cancel-etransfer"
          onClick={() => {
            confirmOnCancelTransfer(
              modal,
              setIsCancelling,
              showMessage,
              snackbarTop,
              eTransferDetails.eTransferId,
              recipientName,
              setIsCancelled
            );
          }}
        >
          Confirm
        </button>
      </>
    )
  });
};

export const cancelRequest = async (
  eTransferDetails,
  modal,
  showMessage,
  setIsCancelling,
  setIsCancelled,
  snackbarTop
) => {
  if (!eTransferDetails) return;
  const sender = eTransferDetails.aliasName;
  modal.show({
    content: eTransferErrors.MSG_RBET_067(
      eTransferDetails.emailAccount,
      formatCurrency(eTransferDetails.amount.value)
    ),
    actions: (
      <>
        <button
          type="button"
          className="ui button basic"
          onClick={() => {
            backOnCancelTransaction(modal);
          }}
        >
          Back
        </button>
        <button
          type="button"
          className="ui button basic"
          data-testid="cancel-etransfer"
          onClick={() => {
            confirmOnCancelRequest(
              modal,
              setIsCancelling,
              showMessage,
              snackbarTop,
              eTransferDetails.eTransferId,
              sender,
              setIsCancelled
            );
          }}
        >
          Confirm
        </button>
      </>
    )
  });
};

export const cancelTransaction = async (
  eTransferDetails,
  modal,
  showMessage,
  setIsCancelling,
  setIsCancelled,
  snackbarTop
) => {
  if (!eTransferDetails) return;
  if (eTransferDetails.type === "transfer") {
    cancelETransfer(
      eTransferDetails,
      modal,
      showMessage,
      setIsCancelling,
      setIsCancelled,
      snackbarTop
    );
  }
  if (eTransferDetails.type === "request") {
    cancelRequest(
      eTransferDetails,
      modal,
      showMessage,
      setIsCancelling,
      setIsCancelled,
      snackbarTop
    );
  }
};

export const prepareErrorModal = (error, recipientName) => {
  if (!error) {
    return "";
  }
  if (
    error &&
    error.response &&
    error.response.status &&
    error.response.data &&
    error.response.data.code
  ) {
    const isMaximumLimitResend =
      error.response &&
      error.response.status === 500 &&
      error.response.data.code === "ETRN0027";
    if (isMaximumLimitResend) {
      return requestETransferErrors.MSG_RBET_024;
    }
  }
  return eTransferErrors.MSG_RBET_062(recipientName);
};

export const resendNotificationAPI = async (
  eTransferId,
  type,
  recipientName,
  modal,
  showMessage,
  snackbarTop,
  closeMessage
) => {
  let notificationResult = null;
  try {
    if (type === "request") {
      notificationResult = await api.get(
        `${etransfersBaseUrl}/outgoingmoneyrequest/sendNotice/:${eTransferId}`
      );
    } else {
      notificationResult = await api.get(
        `${etransfersBaseUrl}/sendNotice/:${eTransferId}`
      );
    }

    closeMessage();
    showMessage({
      top: snackbarTop,
      type: "success",
      content: eTransferErrors.MSG_RBET_038(recipientName)
    });
    return notificationResult;
  } catch (error) {
    const modalContent = prepareErrorModal(error, recipientName);
    modal.show({
      content: modalContent,
      actions: (
        <button
          type="button"
          className="ui button basic"
          onClick={() => modal.hide()}
        >
          OK
        </button>
      )
    });
    return notificationResult;
  }
};
export const resendNotification = async (
  eTransferDetails,
  modal,
  showMessage,
  snackbarTop,
  closeMessage,
  setIsSendingNotification
) => {
  if (!eTransferDetails) return;
  const recipientName = eTransferDetails.aliasName;
  setIsSendingNotification(true);
  await resendNotificationAPI(
    eTransferDetails.eTransferId,
    eTransferDetails.type,
    recipientName,
    modal,
    showMessage,
    snackbarTop,
    closeMessage
  );
  setIsSendingNotification(false);
};

export const IsPendingTransaction = eTransferStatus => {
  return [
    "Transfer Initiated",
    "Transfer Available",
    "Available",
    "Initiated"
  ].includes(eTransferStatus);
};

export const mapStatus = status => {
  if (
    [
      "Transfer Initiated",
      "Transfer Available",
      "Pending Direct Deposit",
      "Authentication Successful"
    ].includes(status)
  ) {
    return { status: "Sent", icon: InProgressIcon };
  }
  if (["Initiated", "Available"].includes(status)) {
    return { status: "Requested", icon: InProgressIcon };
  }
  if (["Completed", "Fulfilled", "Deposit Complete"].includes(status)) {
    return { status: "Received", icon: SuccessIcon };
  }
  if (
    [
      "Authentication Failure",
      "Declined",
      "Cancelled",
      "Expired",
      "Direct Deposit Failed",
      "Deposit Failed"
    ].includes(status)
  ) {
    return { status: "Cancelled", icon: ErrorIcon };
  }

  return status;
};

export const getLabelFromOrAccount = type => {
  switch (type) {
    case "transfer":
      return "From";
    case "received":
      return "To";
    case "request":
      return "Deposit account";
    default:
      return null;
  }
};

export const getLabelToOrRequestedFrom = type => {
  switch (type) {
    case "transfer":
      return "To";
    case "received":
      return "From";
    case "request":
      return "Requested from";
    default:
      return null;
  }
};

export const getTitle = type => {
  switch (type) {
    case "transfer":
      return "Send money details";
    case "received":
      return "Receive money details";
    case "request":
      return "Request money details";
    default:
      return null;
  }
};

export const getMemo = (
  eTransferStatus,
  aliasName,
  isCancelled,
  type,
  eTransferType
) => {
  const { status } = mapStatus(eTransferStatus);
  switch (status) {
    case "Sent":
      return eTransferErrors.MSG_RBET_061C(aliasName);
    case "Received":
      if (type === "transfer") {
        return eTransferType &&
          eTransferType.toString().includes("Fulfill Money Request")
          ? requestETransferErrors.MSG_RBET_071(aliasName)
          : requestETransferErrors.MSG_RBET_013B(aliasName);
      }
      if (type === "request" || type === "received") {
        return requestETransferErrors.MSG_RBET_071C(aliasName);
      }
      return null;
    case "Requested":
      return requestETransferErrors.MSG_RBET_071B(aliasName);
    case "Cancelled":
      if (type === "transfer") {
        return isCancelled
          ? requestETransferErrors.MSG_RBET_063
          : requestETransferErrors.MSG_RBET_037C;
      }
      if (type === "request") {
        return requestETransferErrors.MSG_RBET_037F;
      }
      if (type === "received") {
        return requestETransferErrors.MSG_RBET_044(aliasName);
      }
      return null;
    default:
      return null;
  }
};

export const transformData = (inputData, type) => {
  if (!inputData) return null;
  const outputData = {
    eTransferStatus: inputData.eTransferStatus,
    amount: inputData.amount,
    requestedExecutionDate: inputData.requestedExecutionDate,
    type
  };
  if (type === "transfer") {
    return {
      ...outputData,
      eTransferId: inputData.eTransferId,
      bankAccount: `${inputData.fromAccount.accountName} (${inputData.fromAccount.accountNumber})`,
      emailAccount: `${inputData.recipient.aliasName} (${inputData.recipient.notificationPreference[0].notificationHandle})`,
      aliasName: inputData.recipient.aliasName,
      expiryDate: inputData.expiryDate,
      notificationStatus: inputData.notificationStatus,
      eTransferType: inputData.eTransferType
    };
  }
  if (type === "request") {
    return {
      ...outputData,
      eTransferId: inputData.moneyRequestId,
      emailAccount: `${inputData.requestedFrom.aliasName} (${inputData.requestedFrom.notificationPreference[0].notificationHandle})`,
      bankAccount: `${inputData.depositAccount.accountName} (${inputData.depositAccount.accountNumber})`,
      aliasName: inputData.requestedFrom.aliasName,
      expiryDate: inputData.expiryDate,
      notificationStatus: inputData.notificationStatus
    };
  }
  if (type === "received") {
    return {
      ...outputData,
      emailAccount: `${inputData.requestedFrom.senderRegistrationName}`,
      bankAccount: `${inputData.depositAccount.accountName} (${inputData.depositAccount.accountNumber})`,
      aliasName: inputData.requestedFrom.senderRegistrationName,
      expiryDate: inputData.receivedDate
    };
  }

  return outputData;
};
