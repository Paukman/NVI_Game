import React from "react";
import {
  filterQuickActions,
  getQuickActionProps,
  mapQuickActions
} from "./mapQuickActions";

const account = {
  type: "deposit",
  name: "My account",
  number: "007",
  bankAccount: {
    accountId: "000123",
    routingId: "01234",
    country: "CAD"
  },
  currency: "CAD",
  creditCardNumber: "123456789",
  associatedCreditCardNumbers: ["987654321"]
};

describe("filterQuickActions", () => {
  it(">> Should convert a quickActions object into an array of keys that are true", () => {
    const filtered = filterQuickActions({
      transferFrom: true,
      payBill: true,
      etransfer: true,
      makePayment: false,
      contribute: false,
      makeBillPayment: false
    });

    expect(filtered).toBeInstanceOf(Array);
    expect(filtered.length).toBe(3);

    expect(filtered).toContain("transferFrom");
    expect(filtered).toContain("payBill");
    expect(filtered).toContain("etransfer");
  });

  it(">> Should filter out any unknown keys", () => {
    const filtered = filterQuickActions({
      these: true,
      keys: true,
      are: true,
      unknown: true
    });
    expect(filtered).toEqual([]);
  });

  it(">> Should filter out all keys not equal to true", () => {
    const filtered = filterQuickActions({
      transferFrom: "true",
      contribute: 12345,
      makePayment: true
    });
    expect(filtered).toEqual(["makePayment"]);
  });

  it(">> Should always sort keys in the same order", () => {
    const filteredA = filterQuickActions({
      payBill: true,
      makePayment: true,
      etransfer: true,
      contribute: true,
      transferFrom: true,
      makeBillPayment: true
    });
    const filteredB = filterQuickActions({
      makePayment: true,
      contribute: true,
      makeBillPayment: true,
      etransfer: true,
      transferFrom: true,
      payBill: true
    });

    const expectedOrder = [
      "etransfer",
      "payBill",
      "transferFrom",
      "makeBillPayment",
      "contribute",
      "makePayment"
    ];
    expect(filteredA).toEqual(expectedOrder);
    expect(filteredB).toEqual(expectedOrder);
  });
});

describe("getQuickActionProps", () => {
  it(">> Should return quick action props if action is valid quick action", () => {
    const props = getQuickActionProps("makePayment", account);
    expect(props).toBeDefined();
  });

  it(">> Should return undefined if action is invalid quick action", () => {
    const props = getQuickActionProps("invalidQuickAction", account);
    expect(props).toBeUndefined();
  });

  it(">> Should return correct props for `payBill` quick action", () => {
    const props = getQuickActionProps("payBill", account);
    const payBillProps = {
      label: "Pay bill",
      id: "My account (007) pay-bill",
      redirectTo: {
        pathname: "/move-money/bill-payment/one-time",
        hash: "#create",
        from: account.bankAccount
      }
    };
    expect(props).toMatchObject(payBillProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });

  it(">> Should return correct props for `makeBillPayment` quick action", () => {
    const props = getQuickActionProps("makeBillPayment", account);
    const makeBillPaymentProps = {
      label: "Make payment",
      id: "My account (007) make-bill-payment",
      redirectTo: {
        pathname: "/move-money/bill-payment/one-time",
        hash: "#create",
        to: {
          accountNumber: account.creditCardNumber,
          currency: account.currency,
          associatedAccountNumbers: account.associatedCreditCardNumbers
        }
      }
    };
    expect(props).toMatchObject(makeBillPaymentProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });

  it(">> Should return correct props for `reload` quick action", () => {
    const props = getQuickActionProps("reload", account);
    const reloadProps = {
      label: "Reload",
      id: "My account (007) reload",
      redirectTo: {
        pathname: "/move-money/bill-payment/one-time",
        hash: "#create",
        to: {
          accountNumber: account.creditCardNumber,
          currency: account.currency,
          associatedAccountNumbers: account.associatedCreditCardNumbers
        }
      }
    };
    expect(props).toMatchObject(reloadProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });

  it(">> Should return correct props for `transferFrom` quick action", () => {
    const props = getQuickActionProps("transferFrom", account);
    const transferFromProps = {
      label: "Transfer",
      id: "My account (007) transfer-from",
      redirectTo: {
        pathname: "/move-money/transfer-between-accounts/one-time",
        hash: "#create",
        from: account.bankAccount
      }
    };
    expect(props).toMatchObject(transferFromProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });

  it(">> Should return correct props for `contribute` quick action", () => {
    const props = getQuickActionProps("contribute", account);
    const contributeProps = {
      label: "Contribute",
      id: "My account (007) contribute",
      redirectTo: {
        pathname: "/move-money/transfer-between-accounts/one-time",
        hash: "#create",
        to: account.bankAccount
      }
    };
    expect(props).toMatchObject(contributeProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });

  it(">> Should return correct props for `makePayment` quick action", () => {
    const props = getQuickActionProps("makePayment", account);
    const makePaymentProps = {
      label: "Make payment",
      id: "My account (007) make-payment",
      redirectTo: {
        pathname: "/move-money/transfer-between-accounts/one-time",
        hash: "#create",
        to: account.bankAccount
      }
    };
    expect(props).toMatchObject(makePaymentProps);
    expect(props.icon).toMatch(/.*\.svg$/);
  });
});

describe("mapQuickActions", () => {
  it(">> Should return an empty array when no quick actions are provided", () => {
    const mapped = mapQuickActions(undefined, account);
    expect(mapped).toEqual([]);
  });

  it(">> Should map a quickAction object into an array of props for each QuickAction that will be rendered", () => {
    const mapped = mapQuickActions(
      {
        transferFrom: true,
        makePayment: false,
        contribute: false,
        payBill: true,
        makeBillPayment: false,
        etransfer: false
      },
      account
    );
    expect(mapped).toMatchObject([
      {
        label: "Pay bill",
        id: "My account (007) pay-bill",
        redirectTo: {
          pathname: "/move-money/bill-payment/one-time",
          hash: "#create",
          from: account.bankAccount
        }
      },
      {
        label: "Transfer",
        id: "My account (007) transfer-from",
        redirectTo: {
          pathname: "/move-money/transfer-between-accounts/one-time",
          hash: "#create",
          from: account.bankAccount
        }
      }
    ]);
  });
  it(">> Should map a quickAction for eTransfer", () => {
    const mapped = mapQuickActions(
      {
        transferFrom: false,
        makePayment: false,
        contribute: false,
        payBill: false,
        makeBillPayment: false,
        etransfer: true
      },
      account
    );
    expect(mapped).toMatchObject([
      {
        label: (
          <React.Fragment>
            Send by <i>Interac</i> e-Transfer
          </React.Fragment>
        ),
        id: "My account (007) etransfer",
        redirectTo: {
          pathname: "/move-money/send-money",
          hash: "#create",
          from: account.bankAccount
        }
      }
    ]);
  });

  it(">> Should map a quickAction for reload Load & Go", () => {
    const mapped = mapQuickActions(
      {
        transferFrom: false,
        makePayment: false,
        contribute: false,
        payBill: false,
        makeBillPayment: false,
        etransfer: false,
        reload: true
      },
      account
    );
    expect(mapped).toMatchObject([
      {
        label: "Reload",
        id: "My account (007) reload",
        redirectTo: {
          pathname: "/move-money/bill-payment/one-time",
          hash: "#create"
        }
      }
    ]);
  });
});
