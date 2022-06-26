import React from "react";
import AddPayee from "BillPayment/AddPayee/AddPayee";

export const LOADING_DATA = "LOADING_DATA";
export const LOADING_DATA_FAILED = "LOADING_DATA_FAILED";
export const LOADED_DATA = "LOADED_DATA";

export const UPDATE_EXCHANGE_RATE = "UPDATE_EXCHANGE_RATE";
export const UPDATE_CURRENCIES = "UPDATE_CURRENCIES";
export const UPDATING_EXCHANGE_RATE = "UPDATING_EXCHANGE_RATE";

export const FAILED_CALL = "FAILED_CALL";
export const SUCCESS_CALL = "SUCCESS_CALL";
export const NO_CALL = "NO_CALL";

export const EXCEEDING_AMOUNT = "EXCEEDING_AMOUNT";

export const duplicatePaymentSettingsOneTime = {
  daysBefore: 2,
  status: "completed"
};
export const duplicatePaymentSettingsFuture = {
  timeAhead: {
    period: "year",
    number: 1
  },
  status: "pending"
};

export const UPDATE_ACCOUNTS_FOR_ELIGIBILITY =
  "UPDATE_ACCOUNTS_FOR_ELIGIBILITY";

export const payBillDataMock = {
  fromBillAccounts: [
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
      name: "Personal - US Dollar Chequing",
      number: "5579",
      currency: "CAD",
      balance: { currency: "USD", value: 152.26 },
      availableBalance: { currency: "USD", value: 152.26 },
      type: "Deposit",
      subType: "Chequing",
      status: "30",
      subProductCode: "RETDP_SPRINGBOARD",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHjwWT_patMxC_VXSu76DnUvU"
    }
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $93,428.49 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Springboard Savings Account (1479) | $39,593.01 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
      value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    },
    {
      text: "Personal - US Dollar Chequing (5579) | $152.01 CAD",
      key: "33ZFwIxk3ZebPZZx1bDHjwWT_patMxC_VXSu76DnUvU",
      value: "33ZFwIxk3ZebPZZx1bDHjwWT_patMxC_VXSu76DnUvU"
    }
  ],
  billPayees: [
    {
      billPayeeId: "0056",
      payeeName: "WESTBURNE WEST",
      payeeNickname: "WESTBURNE WEST",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "363651"
    },
    {
      billPayeeId: "1967",
      payeeName: "TELUS MOBILITY",
      payeeNickname: "TELUS MOBILITY",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "32155816"
    },
    {
      billPayeeId: "6789",
      payeeName: "ATB US DOLLAR MASTER",
      payeeNickname: "ATB US DOLLAR MASTER",
      ATBMastercardCurrency: "USD",
      ATBMastercardIndicator: true,
      payeeCustomerReference: "32152999"
    }
  ],
  billPayeesFormatted: [
    {
      text: <AddPayee />,
      key: "add-payee",
      value: "add-payee"
    },
    {
      text: "TELUS MOBILITY (1967)",
      key: "1967",
      value: "1967"
    },
    {
      text: "WESTBURNE WEST (0056)",
      key: "0056",
      value: "0056"
    },
    {
      text: "ATB US DOLLAR MASTER (6789)",
      key: "6789",
      value: "6789"
    }
  ]
};

export const testCreditAccount = {
  name: "CREDIT CARD TEST ACCOUNT",
  number: "7679",
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
};

export const creditCardWarningDataMock = {
  ...payBillDataMock,
  fromBillAccounts: [...payBillDataMock.fromBillAccounts, testCreditAccount],
  fromAccountsFormatted: [
    ...payBillDataMock.fromAccountsFormatted,
    {
      text: "CREDIT CARD TEST ACCOUNT (7679) | $39,486.63 CAD",
      key: "testid",
      value: "testid"
    }
  ]
};

export const amountRange = {
  min: 0.01,
  max: 99999.99
};

export const ADD_PAYEE = {
  text: <div className="dropdown-link">Add payee</div>,
  key: "add-payee",
  value: "add-payee"
};

export const crossCurrencyBillPayeeData = {
  fromAccounts: [
    {
      currency: "USD",
      customerId: "0002764798",
      id: "idUSD",
      name: "US Dollar Savings Account",
      number: "0179",
      availableBalance: { currency: "USD", value: 30.01 }
    },
    {
      currency: "CAD",
      customerId: "0002764798",
      id: "idCAD",
      name: "CAD Basic Savings Account",
      number: "5579",
      availableBalance: { currency: "CAD", value: 45.63 }
    }
  ],
  usdAccount01: {
    key: "idUSD",
    text: "US Dollar Savings Account (0179) | $30.01 USD",
    value: "idUSD"
  },
  cadAccount02: {
    key: "idCAD",
    text: "CAD Basic Savings Account (5579) | $45.63 CAD",
    value: "idCAD"
  },
  billPayees: [
    {
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      billPayeeId: "CAD01",
      payeeName: "ENMAX",
      payeeCustomerReference: "1234",
      payeeNickname: "ENMAX UPDATE Demo"
    },
    {
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      billPayeeId: "CAD02",
      payeeName: "ENMAX",
      payeeCustomerReference: "4353435",
      payeeNickname: "TEST"
    },
    {
      ATBMastercardCurrency: "USD",
      ATBMastercardIndicator: true,
      billPayeeId: "USD01",
      payeeName: "ATB US DOLLAR MASTERCARD",
      payeeCustomerReference: "4353435",
      payeeNickname: "US Master card"
    }
  ],
  cadPayee01: {
    key: "CAD01",
    text: "ENMAX UPDATE Demo (1234)",
    value: "CAD01"
  },
  cadPayee02: {
    key: "CAD02",
    text: "TEST (3435)",
    value: "CAD02"
  },
  divider: {
    key: "divider",
    value: "divider",
    content: <div className="ui horizontal divider">Ineligible accounts</div>,
    disabled: true
  },
  usdPayee01: {
    key: "USD01",
    text: "US Master card (3435)",
    value: "USD01"
  }
};
