import { failedTransactionMessages } from "utils/MessageCatalog";
import { mapFailedTransaction } from "./mapFailedTransaction";

const mockedTransfer = {
  isAcknowledged: false,
  paymentType: "Transfer",
  paymentOrderDate: "2021-04-15",
  failureDate: "2021-04-15",
  failureReason: null,
  amount: {
    currency: "CAD",
    value: 100
  },
  fromAccount: {
    currency: "CAD",
    name: "ATB Advantage Account",
    nickname: null,
    productFamily: "Deposit",
    productGroup: "Chequing",
    number: "768062779"
  },
  paymentOrderNumber: "001145538131",
  toAccount: {
    currency: "CAD",
    name: "Basic Account",
    nickname: null,
    productFamily: "Deposit",
    productGroup: "Chequing",
    number: "768023679"
  },
  recurringPaymentInformation: null
};

const mockedBillPayment = {
  isAcknowledged: false,
  paymentType: "BillPayment",
  paymentOrderDate: "2021-04-06",
  failureDate: "2021-04-06",
  failureReason: null,
  amount: {
    currency: "CAD",
    value: 50
  },
  fromAccount: {
    currency: "CAD",
    name: "No-Fee All-In Account",
    nickname: null,
    number: "720573279"
  },
  paymentOrderNumber: "001145326326",
  payee: {
    name: "AARONS CANADA",
    nickname: "Aaron payee",
    customerReference: "123456789108"
  },
  recurringPaymentInformation: null
};

describe("mapFailedTransaction", () => {
  it(">> Should map a transfer from the API", () => {
    const transaction = mapFailedTransaction(mockedTransfer);
    expect(transaction).toEqual({
      id: "001145538131",
      desc: "A scheduled transfer of $100.00 failed.",
      from: "ATB Advantage Account (2779)",
      to: "Basic Account (3679)",
      amount: "$100.00",
      failureDate: "Apr 15, 2021",
      failureReason: "Unknown",
      associatedFees: "None",
      isAcknowledged: false,
      accountStatusDesc: null,
      recurringPaymentInformation: null
    });
  });

  it(">> Should map a bill payment from the API", () => {
    const transaction = mapFailedTransaction(mockedBillPayment);
    expect(transaction).toEqual({
      id: "001145326326",
      desc: "A scheduled payment of $50.00 to Aaron payee (9108) failed.",
      from: "No-Fee All-In Account (3279)",
      to: "Aaron payee (9108)",
      amount: "$50.00",
      failureDate: "Apr 06, 2021",
      failureReason: "Unknown",
      associatedFees: "None",
      isAcknowledged: false,
      accountStatusDesc: null,
      recurringPaymentInformation: null
    });
  });

  describe("Format account names", () => {
    it(">> Should format `to` and `from` accounts with nicknames", () => {
      const { to, from } = mapFailedTransaction({
        ...mockedTransfer,
        fromAccount: {
          ...mockedTransfer.fromAccount,
          nickname: "From account nickname"
        },
        toAccount: {
          ...mockedTransfer.toAccount,
          nickname: "To account nickname"
        }
      });
      expect(from).toBe("From account nickname (2779)");
      expect(to).toBe("To account nickname (3679)");
    });

    it(">> Should format `to` and `from` accounts without nicknames", () => {
      const { to, from } = mapFailedTransaction({
        ...mockedTransfer,
        fromAccount: {
          ...mockedTransfer.fromAccount,
          nickname: null,
          name: "From name",
          number: "12345678"
        },
        toAccount: {
          ...mockedTransfer.toAccount,
          nickname: null,
          name: "To name",
          number: "87654321"
        }
      });
      expect(from).toBe("From name (5678)");
      expect(to).toBe("To name (4321)");
    });

    it(">> Should format `to` with the account status for failed transfers", () => {
      const { from, to } = mapFailedTransaction({
        ...mockedTransfer,
        fromAccount: {
          ...mockedTransfer.fromAccount,
          name: "From name",
          number: "12345678"
        },
        toAccount: {
          ...mockedTransfer.toAccount,
          name: "To name",
          number: "87654321"
        },
        paymentType: "Transfer",
        failureReason: "Funding_Account_Closed"
      });
      expect(from).toBe("From name (5678)");
      expect(to).toBe("To name (4321) - closed");
    });

    it(">> Should format `from` with the account status for failed bill payments", () => {
      const { from, to } = mapFailedTransaction({
        ...mockedBillPayment,
        fromAccount: {
          ...mockedBillPayment.fromAccount,
          name: "From name",
          number: "12345678"
        },
        payee: {
          ...mockedBillPayment.payee,
          nickname: "My fancy payee",
          customerReference: "88888888"
        },
        paymentType: "BillPayment",
        failureReason: "Funding_Account_Locked"
      });
      expect(from).toBe("From name (5678) - locked");
      expect(to).toBe("My fancy payee (8888)");
    });
  });

  describe("Failure reason", () => {
    it(">> Should handle a failure reason of Funding_Account_Closed", () => {
      const { failureReason } = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: "Funding_Account_Closed"
      });
      expect(failureReason).toBe("Account closed");
    });

    it(">> Should handle a failure reason of Funding_Account_Dormant", () => {
      const { failureReason } = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: "Funding_Account_Dormant"
      });
      expect(failureReason).toBe("Account inactive");
    });

    it(">> Should handle a failure reason of Funding_Account_Locked", () => {
      const { failureReason } = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: "Funding_Account_Locked"
      });
      expect(failureReason).toBe("Account locked");
    });

    it(">> Should handle a failure reason of Funding_Account_NSF", () => {
      const { failureReason } = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: "Funding_Account_NSF"
      });
      expect(failureReason).toBe("Insufficient funds");
    });

    it(">> Should default failure reason to Unknown", () => {
      let transaction = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: "Unhandled failure reason"
      });
      expect(transaction.failureReason).toBe("Unknown");

      transaction = mapFailedTransaction({
        ...mockedTransfer,
        failureReason: undefined
      });
      expect(transaction.failureReason).toBe("Unknown");
    });
  });

  describe("Description", () => {
    it(">> Should handle a transfer with a closed account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Closed"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004B("$100.00", "closed")
      );
    });
    it(">> Should handle a transfer with a inactive account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Dormant"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004B("$100.00", "inactive")
      );
    });
    it(">> Should handle a transfer with a locked account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Locked"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004B("$100.00", "locked")
      );
    });
    it(">> Should handle a transfer with insufficient funds", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_NSF"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_001("$100.00", "insufficient funds")
      );
    });

    it(">> Should handle a transfer with an unknown failure reason", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Unknown failure reason"
      });
      expect(desc).toBe(failedTransactionMessages.MSG_RBFTA_001B("$100.00"));
    });

    it(">> Should handle a transfer with a null failure reason", () => {
      const { desc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: null
      });
      expect(desc).toBe(failedTransactionMessages.MSG_RBFTA_001B("$100.00"));
    });

    it(">> Should handle a bill payment with a closed account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: "Funding_Account_Closed"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004(
          "$50.00",
          "Aaron payee (9108)",
          "closed"
        )
      );
    });
    it(">> Should handle a bill payment with a inactive account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: "Funding_Account_Dormant"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004(
          "$50.00",
          "Aaron payee (9108)",
          "inactive"
        )
      );
    });
    it(">> Should handle a bill payment with a locked account", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: "Funding_Account_Locked"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_004(
          "$50.00",
          "Aaron payee (9108)",
          "locked"
        )
      );
    });

    it(">> Should handle a bill payment with insufficient funds", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: "Funding_Account_NSF"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_002(
          "$50.00",
          "Aaron payee (9108)",
          "insufficient funds"
        )
      );
    });

    it(">> Should handle a bill payment with an unknown failure reason", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: "Unknown"
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_002B("$50.00", "Aaron payee (9108)")
      );
    });
    it(">> Should handle a bill payment with a null failure reason", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "BillPayment",
        failureReason: null
      });
      expect(desc).toBe(
        failedTransactionMessages.MSG_RBFTA_002B("$50.00", "Aaron payee (9108)")
      );
    });

    it(">> Should handle an unknown payment type", () => {
      const { desc } = mapFailedTransaction({
        ...mockedBillPayment,
        paymentType: "Unhandled payment type",
        failureReason: "Funding_Account_NSF"
      });
      expect(desc).toBe("");
    });
  });

  describe("Account status description", () => {
    it(">> Should have an account status description for a transfer with a closed account", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Closed"
      });
      expect(accountStatusDesc).toBe(
        failedTransactionMessages.MSG_RBFTA_004C(
          "Basic Account (3679)",
          "closed"
        )
      );
    });
    it(">> Should have an account status description for a transfer with a inactive account", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Dormant"
      });
      expect(accountStatusDesc).toBe(
        failedTransactionMessages.MSG_RBFTA_004C(
          "Basic Account (3679)",
          "inactive"
        )
      );
    });
    it(">> Should have an account status description for a transfer with a locked account", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_Locked"
      });
      expect(accountStatusDesc).toBe(
        failedTransactionMessages.MSG_RBFTA_004C(
          "Basic Account (3679)",
          "locked"
        )
      );
    });
    it(">> Should not have an account status description for a transfer with insufficient funds", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Funding_Account_NSF"
      });
      expect(accountStatusDesc).toBeNull();
    });

    it(">> Should not have an account status description for a transfer with an unknown failure reason", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: "Unknown failure reason"
      });
      expect(accountStatusDesc).toBeNull();
    });

    it(">> Should not have an account status description for a transfer with a null failure reason", () => {
      const { accountStatusDesc } = mapFailedTransaction({
        ...mockedTransfer,
        paymentType: "Transfer",
        failureReason: null
      });
      expect(accountStatusDesc).toBeNull();
    });
  });
});
