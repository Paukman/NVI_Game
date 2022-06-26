import { remapTransactions } from "./utils";

describe("Verify remapTransactions function with valid data", () => {
  const props = [
    {
      transactionId: null,
      postingDate: "2019-10-22T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      runningBalance: {
        currency: null,
        value: 0.0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "37152c6be3e616310fd8cd9ac47ad817"
    },
    {
      transactionId: null,
      postingDate: "2019-10-21T06:00:00.000Z",
      netAmount: {
        currency: "CAD",
        value: 1234.58
      },
      runningBalance: {
        currency: null,
        value: 0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "12345c6be3e616323fd8232ac47ad817"
    }
  ];

  const results = [
    {
      transactionId: null,
      transactionDate: "2019-10-22T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      runningBalance: {
        currency: null,
        value: 0.0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "37152c6be3e616310fd8cd9ac47ad817"
    },
    {
      transactionId: null,
      transactionDate: "2019-10-21T06:00:00.000Z",
      netAmount: {
        currency: "CAD",
        value: 1234.58
      },
      runningBalance: {
        currency: null,
        value: 0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "12345c6be3e616323fd8232ac47ad817"
    }
  ];
  it("transaction mapping data test", () => {
    const remappedTransactions = remapTransactions("debit", props);
    expect(remappedTransactions).toEqual(results);
  });
});

describe("Verify remapTransactions function with empty data", () => {
  const emptyProps = [];

  it("transaction mapping data test", () => {
    const remappedTransactions = remapTransactions("debit", emptyProps);
    expect(remappedTransactions.length).toEqual(0);
  });
});

describe("Verify remapTransactions function with undefined data", () => {
  const undefinedProps = undefined;
  it("transaction mapping data test", () => {
    const remappedTransactions = remapTransactions("debit", undefinedProps);
    expect(remappedTransactions).toBeNull();
  });
});

describe("Verify remapTransactions function for credit card data", () => {
  const props = [
    {
      transactionId: null,
      postedDate: "2019-10-22T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      runningBalance: {
        currency: null,
        value: 0.0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "37152c6be3e616310fd8cd9ac47ad817"
    },
    {
      transactionId: null,
      postedDate: "2019-10-21T06:00:00.000Z",
      netAmount: {
        currency: "CAD",
        value: 1234.58
      },
      runningBalance: {
        currency: null,
        value: 0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "12345c6be3e616323fd8232ac47ad817"
    }
  ];

  const results = [
    {
      transactionId: null,
      transactionDate: "2019-10-22T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      runningBalance: {
        currency: null,
        value: 0.0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "37152c6be3e616310fd8cd9ac47ad817"
    },
    {
      transactionId: null,
      transactionDate: "2019-10-21T06:00:00.000Z",
      netAmount: {
        currency: "CAD",
        value: 1234.58
      },
      runningBalance: {
        currency: null,
        value: 0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "12345c6be3e616323fd8232ac47ad817"
    }
  ];
  it("transaction mapping data test", () => {
    const remappedTransactions = remapTransactions("creditcard", props);
    expect(remappedTransactions).toEqual(results);
  });
});
