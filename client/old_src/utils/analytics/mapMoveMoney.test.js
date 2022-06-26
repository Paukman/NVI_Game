import dayjs from "dayjs";
import MockDate from "mockdate";

import * as mappers from "./mapMoveMoney";

const {
  mapBillPayment,
  mapTransfer,
  mapETransferRequest,
  mapETransferSend
} = mappers;

const accounts = [
  {
    name: "No-Fee All-In Account",
    number: "7679",
    currency: "CAD",
    bankAccount: {
      accountId: "from-01",
      routingId: "A",
      country: "CAD"
    },
    balance: { currency: "CAD", value: 43428.49 },
    availableBalance: { currency: "CAD", value: 93428.49 },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "DP_LOC_R",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
  },
  {
    name: "Springboard Savings Account",
    number: "1479",
    currency: "CAD",
    balance: { currency: "CAD", value: 49651.39 },
    availableBalance: { currency: "CAD", value: 49651.39 },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_SPRINGBOARD",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
  }
];

const mockedOneTimeBillPayment = {
  fromAccounts: accounts,
  when: dayjs("May 28, 2021", "MMM DD, YYYY"),
  from: accounts[0].id,
  reviewNumberOfPayments: "1",
  fromCurrency: accounts[0].currency,
  toCurrency: "CAD",
  amount: "$0.42"
};

const mockedRecurringBillPayment = {
  reviewEnding: null,
  fromAccounts: accounts,
  starting: dayjs("May 28, 2021", "MMM DD, YYYY"),
  from: accounts[0].id,
  reviewNumberOfPayments: "9",
  fromCurrency: accounts[0].currency,
  toCurrency: "CAD",
  amount: "$12.59",
  frequency: "biweekly"
};

const mockedOneTimeTransfer = {
  from: accounts[0].id,
  to: accounts[1].id,
  fromAccounts: accounts,
  toAccounts: accounts,
  when: dayjs("May 28, 2021", "MMM DD, YYYY"),
  fromCurrency: accounts[0].currency,
  toCurrency: accounts[1].currency,
  amount: "$12.59"
};

const mockedRecurringTransfer = {
  reviewEnding: dayjs("June 28, 2021", "MMM DD, YYYY"),
  fromAccounts: accounts,
  toAccounts: accounts,
  starting: dayjs("May 28, 2021", "MMM DD, YYYY"),
  from: accounts[0].id,
  to: accounts[1].id,
  reviewNumberOfTransfers: "9",
  fromCurrency: accounts[0].currency,
  toCurrency: accounts[1].currency,
  amount: "$566.83",
  frequency: "biweekly"
};

const mockedETransferSend = {
  withdrawalAccounts: accounts,
  from: { id: accounts[0].id },
  amount: "$1023.99",
  message: "ZOMG I'm sending you moola."
};

const mockedETransferRequest = {
  withdrawalAccounts: accounts,
  to: { id: accounts[1].id },
  amount: "$2000.13",
  message: "Give me all your moolaaaa!"
};

describe("Testing mapMoveMoney", () => {
  beforeEach(() => {
    MockDate.set("2021-05-28T12:00:00");
  });
  afterEach(() => {
    MockDate.reset();
  });

  it("should map a one-time bill payment", async () => {
    const mappedState = mapBillPayment(mockedOneTimeBillPayment);

    expect(mappedState).toEqual({
      fromAccountSubCode: "DP_LOC_R",
      fromAccountType: "Chequing",
      fromCurrencyCode: "CAD",
      isBeta: false,
      isMemo: false,
      isRecurringTransfer: false,
      recurranceEndDate: "N/A",
      recurranceInterval: "N/A",
      recurranceLimit: 0,
      toAccountSubCode: "N/A",
      toAccountType: "N/A",
      toCurrencyCode: "CAD",
      transactionAmount: 1,
      transactionDaysInFuture: 0
    });
  });

  it("should map a recurring bill payment", async () => {
    const mappedState = mapBillPayment(mockedRecurringBillPayment);

    expect(mappedState).toEqual({
      fromAccountSubCode: "DP_LOC_R",
      fromAccountType: "Chequing",
      fromCurrencyCode: "CAD",
      isBeta: false,
      isMemo: false,
      isRecurringTransfer: true,
      recurranceEndDate: "N/A",
      recurranceInterval: "Biweekly",
      recurranceLimit: 9,
      toAccountSubCode: "N/A",
      toAccountType: "N/A",
      toCurrencyCode: "CAD",
      transactionAmount: 12,
      transactionDaysInFuture: 0 // For never ending recurring payments, this should be 0 (PO confirmed.)
    });
  });

  it("should handle a bill payment with `reviewEnding` as a string or dayjs object", async () => {
    let mappedState = mapBillPayment({
      ...mockedRecurringBillPayment,
      reviewEnding: dayjs("July 28, 2021", "MMM DD, YYYY")
    });
    expect(mappedState.recurranceEndDate).toBe("07/28/21");

    mappedState = mapBillPayment({
      ...mockedRecurringBillPayment,
      reviewEnding: "July 29, 2021"
    });
    expect(mappedState.recurranceEndDate).toBe("07/29/21");
  });

  it("should map a one-time transfer", async () => {
    const mappedState = mapTransfer(mockedOneTimeTransfer);

    expect(mappedState).toEqual({
      fromAccountSubCode: "DP_LOC_R",
      fromAccountType: "Chequing",
      fromCurrencyCode: "CAD",
      isBeta: false,
      isMemo: false,
      isRecurringTransfer: false,
      recurranceEndDate: "N/A",
      recurranceInterval: "N/A",
      recurranceLimit: 0,
      toAccountSubCode: "RETDP_SPRINGBOARD",
      toAccountType: "Saving",
      toCurrencyCode: "CAD",
      transactionAmount: 12,
      transactionDaysInFuture: 0
    });
  });

  it("should map a recurring transfer", async () => {
    const mappedState = mapTransfer(mockedRecurringTransfer);

    expect(mappedState).toEqual({
      fromAccountSubCode: "DP_LOC_R",
      fromAccountType: "Chequing",
      fromCurrencyCode: "CAD",
      isBeta: false,
      isMemo: false,
      isRecurringTransfer: true,
      recurranceEndDate: "06/28/21",
      recurranceInterval: "Biweekly",
      recurranceLimit: 9,
      toAccountSubCode: "RETDP_SPRINGBOARD",
      toAccountType: "Saving",
      toCurrencyCode: "CAD",
      transactionAmount: 566,
      transactionDaysInFuture: 0
    });
  });

  it("should handle transfer with `reviewEnding` as a string or dayjs object", async () => {
    let mappedState = mapTransfer({
      ...mockedRecurringTransfer,
      reviewEnding: dayjs("July 28, 2021", "MMM DD, YYYY")
    });
    expect(mappedState.recurranceEndDate).toBe("07/28/21");

    mappedState = mapTransfer({
      ...mockedRecurringTransfer,
      reviewEnding: "July 29, 2021"
    });
    expect(mappedState.recurranceEndDate).toBe("07/29/21");
  });

  it("should map a send e-Transfer transaction", async () => {
    const mappedState = mapETransferSend(mockedETransferSend);

    expect(mappedState).toEqual({
      fromAccountSubCode: "DP_LOC_R",
      fromAccountType: "Chequing",
      fromCurrencyCode: "CAD",
      isBeta: false,
      isMemo: true,
      isRecurringTransfer: false,
      recurranceEndDate: "N/A",
      recurranceInterval: "N/A",
      recurranceLimit: 0,
      toAccountSubCode: "N/A",
      toAccountType: "N/A", // We are sending money to a recipient.
      toCurrencyCode: "N/A",
      transactionAmount: 1023,
      transactionDaysInFuture: 0
    });
  });

  it("should map a request e-Transfer transaction", async () => {
    const mappedState = mapETransferRequest(mockedETransferRequest);

    expect(mappedState).toEqual({
      fromAccountSubCode: "N/A", // We are requesting money from a recipient.
      fromAccountType: "N/A",
      fromCurrencyCode: "N/A",
      isBeta: false,
      isMemo: true,
      isRecurringTransfer: false,
      recurranceEndDate: "N/A",
      recurranceInterval: "N/A",
      recurranceLimit: 0,
      toAccountSubCode: "RETDP_SPRINGBOARD",
      toAccountType: "Saving", // We are sending money to a recipient.
      toCurrencyCode: "CAD",
      transactionAmount: 2000,
      transactionDaysInFuture: 0
    });
  });
});
