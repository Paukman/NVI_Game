import React from "react";

export const payBillDataMock = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
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
      balance: { currency: "CAD", value: 42442.26 },
      availableBalance: { currency: "CAD", value: 42442.26 },
      type: "Deposit",
      subType: "Saving",
      status: "30",
      subProductCode: "RETDP_SPRINGBOARD",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    },
    {
      name: "CREDIT CARD TEST ACCOUNT",
      number: "4435",
      currency: "CAD",
      balance: { currency: "CAD", value: 39486.63 },
      availableBalance: { currency: "CAD", value: 89486.63 },
      type: "CreditCard",
      subType: "Chequing",
      subTypeV1: "Chequing",
      status: "30",
      subProductCode: "DP_LOC_R",
      customerId: "0002471847",
      id: "testid"
    }
  ],
  billPayees: [
    {
      billPayeeId: "0056",
      payeeName: "WESTBURNE WEST",
      payeeNickname: "WESTBURNE WEST",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "360056"
    },
    {
      billPayeeId: "1967",
      payeeName: "TELUS MOBILITY",
      payeeNickname: "TELUS MOBILITY",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "32151967"
    },
    {
      billPayeeId: "3333",
      payeeName: "USD Mastercard",
      payeeNickname: "USD Mastercard",
      ATBMastercardCurrency: "USD",
      ATBMastercardIndicator: false,
      payeeCustomerReference: "12345678"
    }
  ]
};

export const paymentType = {
  recurring: "Recurring",
  futureDated: "FutureDated",
  immediate: "Immediate"
};

export const recurringFrequency = {
  weekly: "weekly",
  biweekly: "biweekly",
  monthly: "monthly",
  yearly: "yearly"
};

export const endingOptions = {
  never: "never",
  endDate: "endDate",
  numberOfPayments: "numberOfPayments"
};

export const amountRange = {
  min: 0.01,
  max: 99999.99
};

export const amountExchangeRate = {
  min: 1.0,
  max: 50000,
  maxVIP: 99999.99
};

export const MAX_NUM_OF_PAYMENTS = 999;

export const primaryOptions = {
  notSelected: "notSelected",
  selectedFrom: "selectedFrom",
  selectedTo: "selectedTo"
};

export const divider = [
  {
    key: "divider",
    value: "divider",
    content: <div className="ui horizontal divider">Ineligible accounts</div>,
    disabled: true
  }
];

export const recentPayments = [
  {
    amount: { currency: "CAD", value: 100 },
    payeeCustomerReference: "75877458",
    payeeName: "TELUS MOBILITY",
    payeeNickname: "TELUS MOBILITY",
    paymentId: "id1",
    paymentType: "Immediate",
    postedDate: "2019-01-28",
    remainingPayments: null,
    sourceAccountNumber: "7679",
    sourceAccountProductName: "No-Fee All-In Account",
    status: "completed"
  },
  {
    amount: { currency: "CAD", value: 1 },
    payeeCustomerReference: "755478549",
    payeeName: "CITY OF CALGARY PROPERTY TAX",
    payeeNickname: "AAACityCalgary",
    paymentId: "id2",
    paymentType: "Immediate",
    postedDate: "2021-06-02",
    remainingPayments: null,
    sourceAccountNumber: "7979",
    sourceAccountProductName: "Basic Account",
    status: "completed"
  }
];
