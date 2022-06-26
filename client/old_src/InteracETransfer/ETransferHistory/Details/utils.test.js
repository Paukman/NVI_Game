import { etransfersBaseUrl } from "api";
import { mockApiData } from "utils/TestUtils";
import { requestETransferErrors } from "utils/MessageCatalog";
import {
  cancelETransfer,
  backOnCancelTransaction,
  confirmOnCancelTransfer,
  confirmOnCancelRequest,
  cancelETransferAPI,
  cancelRequestAPI,
  IsPendingTransaction,
  getRecipientEmail,
  getMemo,
  getLabelToOrRequestedFrom,
  getLabelFromOrAccount,
  resendNotification,
  resendNotificationAPI,
  transformData,
  prepareErrorModal,
  getTitle
} from "./utils";

const eTransferDetails = {
  recipient: {
    aliasName: "Test Receipient"
  },
  fromAccount: {
    accountName: "Basic Account",
    accountNumber: "3536"
  },
  amount: {
    value: 0.01
  },
  eTransferId: "2332448jksdfhksdfo3u",
  type: "transfer"
};

const requestMoneyDetails = {
  sender: {
    aliasName: "Test Receipient"
  },
  amount: {
    value: 0.01,
    currency: "CAD"
  },
  eTransferId: "CysBAuvy6gCi8dXwU1LMaw",
  type: "request"
};
const snackbarTop = 140;

describe("Testing cancelETransfer", () => {
  it(">> cancelETransfer should return if eTransferDetails null", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    cancelETransfer(null, modal, null, snackbarTop, null);
    expect(modal.show).not.toHaveBeenCalled();
  });
  it(">> cancelETransfer should call modal", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    cancelETransfer(eTransferDetails, modal, null, snackbarTop, null);
    expect(modal.show).toHaveBeenCalled();
  });
});

describe("Testing backOnCancelTransaction", () => {
  it(">> backOnCancelTransaction should hide the modal", () => {
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    backOnCancelTransaction(modal);
    expect(modal.hide).toHaveBeenCalled();
  });
});

describe("Testing confirmOnCancelTransfer", () => {
  it(">> confirmOnCancelTransfer should hide the modal and call setIsCancelling", () => {
    const setIsCancelling = jest.fn();
    const setIsCancelled = jest.fn();
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    confirmOnCancelTransfer(
      modal,
      setIsCancelling,
      showMessage,
      snackbarTop,
      eTransferDetails.eTransferId,
      eTransferDetails.recipient.aliasName,
      setIsCancelled
    );
    expect(modal.hide).toHaveBeenCalled();
    expect(setIsCancelling).toHaveBeenCalled();
  });
});
describe("Testing confirmOnCancelRequest", () => {
  it(">> confirmOnCancelRequest should hide the modal and call setIsCancelling", () => {
    const setIsCancelling = jest.fn();
    const setIsCancelled = jest.fn();
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    confirmOnCancelRequest(
      modal,
      setIsCancelling,
      showMessage,
      snackbarTop,
      eTransferDetails.eTransferId,
      eTransferDetails.recipient.aliasName,
      setIsCancelled
    );
    expect(modal.hide).toHaveBeenCalled();
    expect(setIsCancelling).toHaveBeenCalled();
  });
});

describe("Testing resendNotification", () => {
  it(">> resendNotification should call setIsSendingNotification", () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 200,
        method: "get"
      }
    ]);
    const setIsSendingNotification = jest.fn();
    resendNotification(
      eTransferDetails,
      modal,
      showMessage,
      snackbarTop,
      closeMessage,
      setIsSendingNotification
    );
    expect(setIsSendingNotification).toHaveBeenCalled();
  });
});

describe("Testing resendNotificationAPI", () => {
  it(">> resendNotificationAPI with transfer type should call etransfer API and showMessage on success", async () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 200,
        method: "get"
      }
    ]);
    await resendNotificationAPI(
      eTransferDetails.eTransferId,
      "transfer",
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      snackbarTop,
      closeMessage
    );
    expect(showMessage).toHaveBeenCalled();
  });

  it(">> resendNotificationAPI with request type should call outgoing money request API and showMessage on success", async () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/outgoingmoneyrequest/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 200,
        method: "get"
      }
    ]);
    await resendNotificationAPI(
      eTransferDetails.eTransferId,
      "request",
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      snackbarTop,
      closeMessage
    );
    expect(showMessage).toHaveBeenCalled();
  });
  it(">> resendNotificationAPI with transfer type should call etransfer API and should show modal on error", async () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 500,
        method: "get",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to send"
            }
          }
        }
      }
    ]);
    await resendNotificationAPI(
      eTransferDetails.eTransferId,
      "transfer",
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      snackbarTop,
      closeMessage
    );
    expect(modal.show).toHaveBeenCalled();
  });
  it(">> resendNotificationAPI with request type should call outgoing money request API and should show modal on error", async () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/outgoingmoneyrequest/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 500,
        method: "get",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to send"
            }
          }
        }
      }
    ]);
    await resendNotificationAPI(
      eTransferDetails.eTransferId,
      "request",
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      snackbarTop,
      closeMessage
    );
    expect(modal.show).toHaveBeenCalled();
  });
  it(">> resendNotificationAPI with request type should call outgoing money request API and should show modal on max send limit error", async () => {
    const showMessage = jest.fn();
    const closeMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/outgoingmoneyrequest/sendNotice/:${eTransferDetails.eTransferId}`,
        status: 500,
        method: "get",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "ETRN0027",
              message:
                "Exceeded max number of notifications for the Money Request."
            }
          }
        }
      }
    ]);
    await resendNotificationAPI(
      eTransferDetails.eTransferId,
      "request",
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      snackbarTop,
      closeMessage
    );
    expect(modal.show).toHaveBeenCalled();
  });
});

describe("Testing cancelETransferAPI", () => {
  it(">> cancelETransferAPI should call showMessage on success", async () => {
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const setIsCancelled = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/`,
        data: { data: { eTransferId: eTransferDetails.eTransferId } },
        status: 200,
        method: "DELETEWITHDATA"
      }
    ]);
    await cancelETransferAPI(
      eTransferDetails.eTransferId,
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      setIsCancelled,
      snackbarTop
    );
    expect(setIsCancelled).toHaveBeenCalled();
    expect(showMessage).toHaveBeenCalled();
  });
  it(">> cancelETransferAPI should call modal on error", async () => {
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/`,
        results: {},
        status: 500,
        method: "DELETEWITHDATA",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to cancel"
            }
          }
        }
      }
    ]);
    await cancelETransferAPI(
      eTransferDetails.eTransferId,
      eTransferDetails.recipient.aliasName,
      modal,
      showMessage,
      () => jest.fn(),
      snackbarTop
    );
    expect(modal.show).toHaveBeenCalled();
  });
});

describe("Testing IsPendingTransaction", () => {
  it(">> IsPendingTransaction should return false if eTransferStatus is not as per pending status list", () => {
    const result = IsPendingTransaction("test");
    expect(result).toBe(false);
  });
  it(">> IsPendingTransaction should return false if eTransferATBPaymentStatus is Pending but eTransferStatus is Pending Direct Deposit", () => {
    const result = IsPendingTransaction("Pending Direct Deposit");
    expect(result).toBe(false);
  });
  it(">> IsPendingTransaction should return true if eTransferStatus is as per send pending status list", () => {
    const result = IsPendingTransaction("Transfer Available");
    expect(result).toBe(true);
  });
  it(">> IsPendingTransaction should return true if eTransferStatus is as per received pending status list", () => {
    const result = IsPendingTransaction("Available");
    expect(result).toBe(true);
  });
});

describe("Testing getRecipientEmail", () => {
  it(">> getRecipientEmail should return null if input is null", () => {
    const result = getRecipientEmail(null);
    expect(result).toBe(null);
  });
  it(">> getRecipientEmail should return null if notificationPreference is blank", () => {
    const recipient = {
      aliasName: "Test Receipient",
      notificationPreference: []
    };

    const result = getRecipientEmail(recipient);
    expect(result).toBe(null);
  });
  it(">> getRecipientEmail should return null if notificationPreference has inactive notificationPreference", () => {
    const recipient = {
      aliasName: "Test Receipient",
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "test@atb.com",
          isActive: false
        }
      ]
    };

    const result = getRecipientEmail(recipient);
    expect(result).toBe(null);
  });
  it(">> getRecipientEmail should return null if notificationPreference has other than email as notificationPreference", () => {
    const recipient = {
      aliasName: "Test Receipient",
      notificationPreference: [
        {
          notificationHandleType: "phone",
          notificationHandle: "857-847-8888",
          isActive: true
        }
      ]
    };

    const result = getRecipientEmail(recipient);
    expect(result).toBe(null);
  });
  it(">> getRecipientEmail should return email address if notificationPreference has active email", () => {
    const recipient = {
      aliasName: "Test Receipient",
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "test@atb.com",
          isActive: true
        }
      ]
    };

    const result = getRecipientEmail(recipient);
    expect(result).toBe("test@atb.com");
  });
});

describe("Testing prepareErrorModal", () => {
  it(">> prepareErrorModal should return blank if error is null", () => {
    const result = prepareErrorModal(null, "");
    expect(result).toBe("");
  });
  it(">> prepareErrorModal should return max limit error if error code is ETRN0027", () => {
    const error = {
      response: {
        status: 500,
        data: { code: "ETRN0027" }
      }
    };
    const result = prepareErrorModal(error, "");
    expect(result).toBe(requestETransferErrors.MSG_RBET_024);
  });
});

describe("Testing getMemo", () => {
  it(">> getMemo should return memo for Sent status", () => {
    let recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Transfer Available"
    };

    let result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "Test Receipient has not yet accepted this transaction."
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Transfer Initiated"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "Test Receipient has not yet accepted this transaction."
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Pending Direct Deposit"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "Test Receipient has not yet accepted this transaction."
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Authentication Successful"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "Test Receipient has not yet accepted this transaction."
    );
  });

  it(">> getMemo should return memo for Requested status", () => {
    let recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Available"
    };

    let result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "Test Receipient has not yet fulfilled this request for money by Interac e-Transfer."
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Initiated"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );

    expect(result).toEqual(
      "Test Receipient has not yet fulfilled this request for money by Interac e-Transfer."
    );
  });

  it(">> getMemo should return memo for Received status for Transfer", () => {
    let recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Completed"
    };

    let result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual("Test Receipient has accepted this transaction.");

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Fulfilled",
      eTransferType: "Fulfill Money Request"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer",
      recipient.eTransferType
    );
    expect(result).toEqual(
      requestETransferErrors.MSG_RBET_071(recipient.aliasName)
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Deposit Complete"
    };
    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "request"
    );
    expect(result).toEqual(
      "Test Receipient has fulfilled this request for money by Interac e-Transfer."
    );

    recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Completed"
    };

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "received"
    );
    expect(result).toEqual(
      "Test Receipient has fulfilled this request for money by Interac e-Transfer."
    );

    result = getMemo(recipient.eTransferStatus, recipient.aliasName, false, "");
    expect(result).toBeNull();
  });

  it(">> getMemo should return memo for Received status for Request", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Completed"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "request"
    );
    expect(result).toEqual(
      "Test Receipient has fulfilled this request for money by Interac e-Transfer."
    );
  });

  it(">> getMemo should return memo for Received status for Received", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Completed"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "received"
    );
    expect(result).toEqual(
      "Test Receipient has fulfilled this request for money by Interac e-Transfer."
    );
  });

  it(">> getMemo should return memo for Requested status", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Initiated"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "requested"
    );
    expect(result).toEqual(
      "Test Receipient has not yet fulfilled this request for money by Interac e-Transfer."
    );
  });

  it(">> getMemo should return memo for Cancelled status for transfer type", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Cancelled"
    };

    let result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(
      "This transaction has been cancelled. The funds have been returned to your account."
    );

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "request"
    );
    expect(result).toEqual(requestETransferErrors.MSG_RBET_037F);

    result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "received"
    );
    expect(result).toEqual(
      "We will notify Test Receipient that you've declined their Interac e-Transfer deposit."
    );

    result = getMemo(recipient.eTransferStatus, recipient.aliasName, false, "");
    expect(result).toBeNull();
  });

  it(">> getMemo should return memo for currently Cancelled status", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Cancelled"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      true,
      "transfer"
    );
    expect(result).toEqual(requestETransferErrors.MSG_RBET_063);
  });

  it(">> getMemo should return memo for previously Cancelled status", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Cancelled"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(requestETransferErrors.MSG_RBET_037C);
  });

  it(">> getMemo should return memo for Cancelled status for request type", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Cancelled"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "request"
    );
    expect(result).toEqual(requestETransferErrors.MSG_RBET_037F);
  });

  it(">> getMemo should return memo for Cancelled status for received type", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "Cancelled"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "received"
    );
    expect(result).toEqual(
      "We will notify Test Receipient that you've declined their Interac e-Transfer deposit."
    );
  });

  it(">> getMemo should return memo for previously Cancelled status", () => {
    const recipient = {
      aliasName: "Test Receipient",
      atbPaymentStatus: "Cancelled",
      eTransferStatus: "Cancelled"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toEqual(requestETransferErrors.MSG_RBET_037C);
  });

  it(">> getMemo should return null for not matching status", () => {
    const recipient = {
      aliasName: "Test Receipient",
      eTransferStatus: "ABC"
    };

    const result = getMemo(
      recipient.eTransferStatus,
      recipient.aliasName,
      false,
      "transfer"
    );
    expect(result).toBeNull();
  });
});

describe("Testing transformData", () => {
  it(">> transformData should return null if input is null", () => {
    const result = transformData(null, "transfer");
    expect(result).toBeNull();
  });
  it(">> transformData should return data if type is transfer", () => {
    const transforInputData = {
      etransferStatus: "Cancelled",
      amount: 5.0,
      eTransferId: "Yd7k2YLzhpWuBkGxOyGCIQ",
      expiryDate: "2020-12-06T22:12:37.000Z",
      requestedExecutionDate: "2020-10-13T22:12:37.000Z",
      notificationStatus: "sent",
      fromAccount: { accountName: "Basic Account", accountNumber: "6679" },
      recipient: {
        aliasName: "Guy Incognito",
        notificationPreference: [
          {
            notificationHandleType: "Email",
            notificationHandle: "qwigibo@atb.com",
            isActive: true
          }
        ]
      }
    };
    const result = transformData(transforInputData, "transfer");
    expect(result.eTransferId).toEqual("Yd7k2YLzhpWuBkGxOyGCIQ");
    expect(result.aliasName).toEqual("Guy Incognito");
    expect(result.emailAccount).toEqual("Guy Incognito (qwigibo@atb.com)");
    expect(result.bankAccount).toEqual("Basic Account (6679)");
  });
  it(">> transformData should return data if type is request", () => {
    const transforInputData = {
      etransferStatus: "Cancelled",
      amount: 5.0,
      moneyRequestId: "Yd7k2YLzhpWuBkGxOyGCIQ",
      expiryDate: "2020-12-06T22:12:37.000Z",
      requestedExecutionDate: "2020-10-13T22:12:37.000Z",
      notificationStatus: "sent",
      depositAccount: { accountName: "Basic Account", accountNumber: "6679" },
      requestedFrom: {
        aliasName: "Guy Incognito",
        notificationPreference: [
          {
            notificationHandleType: "Email",
            notificationHandle: "qwigibo@atb.com",
            isActive: true
          }
        ]
      }
    };
    const result = transformData(transforInputData, "request");
    expect(result.eTransferId).toEqual("Yd7k2YLzhpWuBkGxOyGCIQ");
    expect(result.aliasName).toEqual("Guy Incognito");
    expect(result.emailAccount).toEqual("Guy Incognito (qwigibo@atb.com)");
    expect(result.bankAccount).toEqual("Basic Account (6679)");
  });
  it(">> transformData should return data if type is received", () => {
    const transforInputData = {
      etransferStatus: "Cancelled",
      amount: 5.0,
      moneyRequestId: "Yd7k2YLzhpWuBkGxOyGCIQ",
      receivedDate: "2020-12-06T22:12:37.000Z",
      requestedExecutionDate: "2020-10-13T22:12:37.000Z",
      notificationStatus: "sent",
      depositAccount: { accountName: "Basic Account", accountNumber: "6679" },
      requestedFrom: {
        senderRegistrationName: "Guy Incognito",
        notificationPreference: [
          {
            notificationHandleType: "Email",
            notificationHandle: "qwigibo@atb.com",
            isActive: true
          }
        ]
      }
    };
    const result = transformData(transforInputData, "received");
    expect(result.aliasName).toEqual("Guy Incognito");
    expect(result.emailAccount).toEqual("Guy Incognito");
    expect(result.bankAccount).toEqual("Basic Account (6679)");
  });

  it(">> transformData should return data if type is not matching", () => {
    const transforInputData = {
      etransferStatus: "Not Matched",
      amount: 5.0,
      moneyRequestId: "Yd7k2YLzhpWuBkGxOyGCIQ",
      expiryDate: "2020-12-06T22:12:37.000Z",
      requestedExecutionDate: "2020-10-13T22:12:37.000Z",
      notificationStatus: "sent",
      depositAccount: { accountName: "Basic Account", accountNumber: "6679" },
      requestedFrom: {
        aliasName: "Guy Incognito",
        notificationPreference: [
          {
            notificationHandleType: "Email",
            notificationHandle: "qwigibo@atb.com",
            isActive: true
          }
        ]
      }
    };
    const result = transformData(transforInputData, "not matched");
    expect(result.eTransferStatus).toBeUndefined();
  });
});

describe("Testing cancelRequestAPI", () => {
  it(">> cancelRequestAPI should call showMessage on success", async () => {
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    const setIsCancelled = jest.fn();
    mockApiData([
      {
        url: `${etransfersBaseUrl}/outgoingmoneyrequest/CysBAuvy6gCi8dXwU1LMaw`,
        status: 200,
        method: "DELETE"
      }
    ]);
    await cancelRequestAPI(
      requestMoneyDetails.eTransferId,
      requestMoneyDetails.sender.aliasName,
      modal,
      showMessage,
      setIsCancelled,
      snackbarTop
    );
    expect(setIsCancelled).toHaveBeenCalled();
    expect(showMessage).toHaveBeenCalled();
  });
  it(">> cancelETransferAPI should call modal on error", async () => {
    const showMessage = jest.fn();
    const modal = {
      show: jest.fn(),
      hide: jest.fn()
    };
    mockApiData([
      {
        url: `${etransfersBaseUrl}/outgoingmoneyrequest/CysBAuvy6gCi8dXwU1LMaw`,
        results: {},
        status: 500,
        method: "DELETE",
        error: {
          response: {
            data: {
              statusCode: 500,
              code: "GENERIC_ERROR",
              message: "Unable to cancel"
            }
          }
        }
      }
    ]);
    await cancelRequestAPI(
      requestMoneyDetails.eTransferId,
      requestMoneyDetails.sender.aliasName,
      modal,
      showMessage,
      () => jest.fn(),
      snackbarTop
    );
    expect(modal.show).toHaveBeenCalled();
  });
});

describe("Testing getTitle", () => {
  it(">> getTitle should return title for transfer", () => {
    const result = getTitle("transfer");
    expect(result).toEqual("Send money details");
  });

  it(">> getTitle should return title for received", () => {
    const result = getTitle("received");
    expect(result).toEqual("Receive money details");
  });

  it(">> getTitle should return title for request", () => {
    const result = getTitle("request");
    expect(result).toEqual("Request money details");
  });

  it(">> getTitle should return null for no matching type", () => {
    const result = getTitle("not matched");
    expect(result).toBeNull();
  });
});

describe("Testing getLabelToOrRequestedFrom", () => {
  it(">> getLabelToOrRequestedFrom should return text for transfer", () => {
    const result = getLabelToOrRequestedFrom("transfer");
    expect(result).toEqual("To");
  });

  it(">> getLabelToOrRequestedFrom should return text for received", () => {
    const result = getLabelToOrRequestedFrom("received");
    expect(result).toEqual("From");
  });

  it(">> getLabelToOrRequestedFrom should return text for request", () => {
    const result = getLabelToOrRequestedFrom("request");
    expect(result).toEqual("Requested from");
  });

  it(">> getLabelToOrRequestedFrom should return null for no matching type", () => {
    const result = getLabelToOrRequestedFrom("not matched");
    expect(result).toBeNull();
  });
});

describe("Testing getLabelFromOrAccount", () => {
  it(">> getLabelFromOrAccount should return text for transfer", () => {
    const result = getLabelFromOrAccount("transfer");
    expect(result).toEqual("From");
  });

  it(">> getLabelFromOrAccount should return text for received", () => {
    const result = getLabelFromOrAccount("received");
    expect(result).toEqual("To");
  });

  it(">> getLabelFromOrAccount should return text for request", () => {
    const result = getLabelFromOrAccount("request");
    expect(result).toEqual("Deposit account");
  });

  it(">> getLabelToOrRequestedFrom should return null for no matching type", () => {
    const result = getLabelFromOrAccount("not matched");
    expect(result).toBeNull();
  });
});
