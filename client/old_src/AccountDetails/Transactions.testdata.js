export const transactionsData = [
  {
    transactionId: null,
    postedDate: "2019-10-15T06:00:00.000Z",
    transactionDate: "2019-10-15T06:00:00.000Z",
    netAmount: {
      currency: null,
      value: 1.8
    },
    transactionStatus: "Pending",
    accountingEffectType: "Credit",
    description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
    key: "37152c6be3e616310fd8cd9ac47ad817"
  },
  {
    transactionId: null,
    postedDate: "2019-10-15T06:00:00.000Z",
    transactionDate: "2019-10-15T06:00:00.000Z",
    netAmount: {
      currency: null,
      value: 1.8
    },
    transactionStatus: "Pending",
    accountingEffectType: "Debit",
    description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
    key: "37152c6be3e616310fd8cd9ac47ad818"
  },
  {
    transactionId: null,
    postedDate: "2019-10-12T06:00:00.000Z",
    transactionDate: "2019-10-12T06:00:00.000Z",
    netAmount: {
      currency: null,
      value: 1.8
    },
    transactionStatus: "Pending",
    accountingEffectType: "Debit",
    description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
    key: "37152c6be3e616310fd8cd9ac47ad819"
  },
  {
    transactionId: "270957100081630",
    postedDate: "2019-09-26T06:00:00.000Z",
    transactionDate: "2019-09-26T06:00:00.000Z",
    netAmount: {
      currency: "CAD",
      value: 39.82
    },
    transactionStatus: "Completed",
    accountingEffectType: "Debit",
    description: "MAYERTHORPE CO-OP #168",
    key: "4cf206ede8c6b7c2248aa02c8653c8ca"
  }
];

export const noTransactions = {
  moreItem: false,
  transactions: []
};

export const creditCardOnlyOnePage = {
  moreItem: false,
  transactions: transactionsData
};

export const creditCardFirstPage = {
  moreItem: true,
  transactions: transactionsData
};

export const creditCardSecondPage = {
  moreItem: true,
  transactions: [
    {
      transactionId: null,
      postedDate: "2019-10-15T06:00:00.000Z",
      transactionDate: "2019-10-15T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "DESCRIPTION ON NEXT PAGE",
      key: "adadsf234234"
    }
  ]
};

export const creditCardPendingTransactions = {
  moreItem: false,
  transactions: [
    {
      transactionId: null,
      transactionDate: "2019-10-15T06:00:00.000Z",
      netAmount: {
        currency: null,
        value: 1.8
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "A pending transaction",
      key: "adadsf234234"
    }
  ]
};

export const depositFirstPage = {
  moreItem: true,
  transactions: [
    {
      transactionId: "297901856003697",
      postedDate: "2019-10-24T06:00:00.000Z",
      postingDate: "2019-10-24T06:00:00.000Z",
      netAmount: { currency: "CAD", value: 1.28 },
      transactionStatus: "Completed",
      accountingEffectType: "Credit",
      description: "PAYMENT - THANK YOU",
      key: "dakey"
    }
  ]
};

export const depositSecondPage = {
  moreItem: true,
  transactions: [
    {
      transactionId: "2979018560032697",
      postingDate: "2019-10-24T06:00:00.000Z",
      netAmount: { currency: "CAD", value: 1.28 },
      transactionStatus: "Completed",
      accountingEffectType: "Credit",
      description: "DEPOSIT SECOND PAGE",
      key: "dakey1"
    }
  ]
};
