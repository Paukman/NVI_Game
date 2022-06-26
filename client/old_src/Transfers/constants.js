import React from "react";
import dayjs from "dayjs";
import oneTimeTransferIcon from "assets/icons/PayBillOneTime/pay-bill-one-time.svg";
import recurringTransferIcon from "assets/icons/PayBillRecurring/pay-bill-recurring-tab.svg";
import scheduledTransfersIcon from "assets/icons/Scheduled/etransfer-history.svg";

export const BASE_PATH = "/move-money/transfer-between-accounts";
export const BASE_PATH_ONE_TIME =
  "/move-money/transfer-between-accounts/one-time";
export const BASE_PATH_RECURRING =
  "/move-money/transfer-between-accounts/recurring";
export const BASE_PATH_SCHEDULED_TRANSFERS =
  "/move-money/transfer-between-accounts/scheduled-transfers";

export const EXCHANGE_RATE_TITLE = "Foreign exchange rate";
export const EXCHANGE_RATE_TEXT =
  "This rate applies to the current transaction only and includes any and all associated exchange-related fees.";

export const recurringFrequency = {
  weekly: "weekly",
  biweekly: "biweekly",
  monthly: "monthly",
  yearly: "yearly"
};

export const primaryOptions = {
  notSelected: "notSelected",
  selectedFrom: "selectedFrom",
  selectedTo: "selectedTo"
};

export const endingOptions = {
  never: "never",
  endDate: "endDate",
  numberOfTransfers: "numberOfTransfers"
};

export const amountRange = {
  min: 0.01,
  max: 99999.99
};

export const amountExchangeRate = {
  min: 1.0,
  max: 3000.0
};

export const MAX_NUM_OF_PAYMENTS = 999;

export const transferTabItems = [
  {
    url: BASE_PATH_ONE_TIME,
    class: "active",
    name: "One-time transfer",
    icon: oneTimeTransferIcon
  },
  {
    url: BASE_PATH_RECURRING,
    class: "inactive",
    name: "Recurring transfer",
    icon: recurringTransferIcon
  },
  {
    url: BASE_PATH_SCHEDULED_TRANSFERS,
    class: "inactive",
    name: "Scheduled transfers",
    icon: scheduledTransfersIcon
  }
];

export const account01noFee = {
  availableBalance: { currency: "CAD", value: 42000.01 },
  balance: { currency: "CAD", value: 42000.01 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  id: "account_01_NoFee",
  name: "No-Fee All-In Account",
  number: "7679",
  status: "30",
  subProductCode: "DP_LOC_R",
  subType: "Chequing",
  subTypeV1: "Chequing",
  type: "Deposit"
};

export const account02SPRINGBOARD = {
  availableBalance: { currency: "CAD", value: 220387.03 },
  balance: { currency: "CAD", value: 220387.03 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL",
    "account_09_SPRINGBOARDUSD"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  id: "account_02_SPRINGBOARD",
  name: "Springboard Savings Account",
  number: "1479",
  status: "30",
  subProductCode: "RETDP_SPRINGBOARD",
  subType: "Saving",
  subTypeV1: "Saving",
  type: "Deposit"
};

export const account01noFeeUSD = {
  availableBalance: { currency: "USD", value: 42000.01 },
  balance: { currency: "USD", value: 42000.01 },
  currency: "USD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_01_NoFee_USD",
    "account_02_SPRINGBOARD",
    "account_02_SPRINGBOARD_USD"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_01_NoFee_USD",
    "account_02_SPRINGBOARD",
    "account_02_SPRINGBOARD_USD"
  ],
  id: "account_01_NoFee_USD",
  name: "No-Fee All-In USD Account",
  number: "7677",
  status: "30",
  subProductCode: "DP_LOC_R",
  subType: "Chequing",
  subTypeV1: "Chequing",
  type: "Deposit"
};

export const account02SPRINGBOARDUSD = {
  availableBalance: { currency: "USD", value: 220387.03 },
  balance: { currency: "USD", value: 220387.03 },
  currency: "USD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_01_NoFee_USD",
    "account_02_SPRINGBOARD",
    "account_02_SPRINGBOARD_USD"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_01_NoFee_USD",
    "account_02_SPRINGBOARD",
    "account_02_SPRINGBOARD_USD"
  ],
  id: "account_02_SPRINGBOARD_USD",
  name: "Springboard Savings USD Account",
  number: "1477",
  status: "30",
  subProductCode: "RETDP_SPRINGBOARD",
  subType: "Saving",
  subTypeV1: "Saving",
  type: "Deposit"
};

export const singleAccountData = {
  singleAccount: [account02SPRINGBOARD]
};

export const account02SPRINGBOARDDiffBalance = {
  ...account02SPRINGBOARD,
  availableBalance: { currency: "CAD", value: 300000.01 },
  balance: { currency: "CAD", value: 300000.01 }
};

export const account03LLOC = {
  availableBalance: { currency: "CAD", value: 500000 },
  balance: { currency: "CAD", value: 0 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_04_TFSA",
    "account_05_RML",
    "account_06_TPPL"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_04_TFSA",
    "account_05_RML",
    "account_06_TPPL"
  ],
  id: "account_03_LLOC",
  name: "Linked Line of Credit",
  number: "7200",
  status: "30",
  subProductCode: "RETLO_LLOC",
  type: "Loan"
};
export const account04TFSA = {
  availableBalance: { currency: "CAD", value: 3106.88 },
  balance: { currency: "CAD", value: 3106.88 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: ["account_01_NoFee", "account_02_SPRINGBOARD"],
  eligibleFromAccounts: ["account_01_NoFee", "account_02_SPRINGBOARD"],
  id: "account_04_TFSA",
  name: "Tax-Free Saver Account",
  number: "7100",
  status: "30",
  subProductCode: "RETRP_TFSA_SAVING",
  subTypeV1: "TFSA",
  type: "Investment"
};
export const account05RML = {
  availableBalance: { currency: "CAD", value: 0 },
  balance: { currency: "CAD", value: 474662.93 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  id: "account_05_RML",
  name: "Residential Mortgage Loan",
  number: "1100",
  status: "30",
  subProductCode: "RETLO_MRTG_RML",
  type: "Loan"
};
export const account06TPPL = {
  availableBalance: { currency: "CAD", value: 0 },
  balance: { currency: "CAD", value: 361553.29 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  id: "account_06_TPPL",
  name: "TPPL Unsecured and Cash Secured",
  number: "1700",
  status: "30",
  subProductCode: "RETLO_TPPL",
  type: "Loan"
};
export const account07DI = {
  availableBalance: { currency: "CAD", value: 858.11 },
  balance: { currency: "CAD", value: 858.11 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL"
  ],
  id: "account_07_DI",
  name: "Daily Interest Account",
  number: "4700",
  status: "30",
  subProductCode: "RP_DI",
  subTypeV1: "RRSP",
  type: "Investment"
};
export const account08LLOC = {
  availableBalance: { currency: "CAD", value: 500000 },
  balance: { currency: "CAD", value: 0 },
  currency: "CAD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_04_TFSA",
    "account_05_RML",
    "account_06_TPPL"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_04_TFSA",
    "account_05_RML",
    "account_06_TPPL"
  ],
  id: "account_08_LLOC",
  name: "Linked Line of Credit",
  number: "9400",
  status: "30",
  subProductCode: "RETLO_LLOC",
  type: "Loan"
};

export const account09SPRINGBOARDUSD = {
  availableBalance: { currency: "USD", value: 12000.23 },
  balance: { currency: "USD", value: 12000.23 },
  currency: "USD",
  customerId: "0002471847",
  eligibleToAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL",
    "account_09_SPRINGBOARDUSD"
  ],
  eligibleFromAccounts: [
    "account_01_NoFee",
    "account_02_SPRINGBOARD",
    "account_07_DI",
    "account_04_TFSA",
    "account_03_LLOC",
    "account_05_RML",
    "account_08_LLOC",
    "account_06_TPPL",
    "account_09_SPRINGBOARDUSD"
  ],
  id: "account_09_SPRINGBOARDUSD",
  name: "Springboard Savings Account USD",
  number: "1122",
  status: "30",
  subProductCode: "RETDP_SPRINGBOARD",
  subType: "Saving",
  subTypeV1: "Saving",
  type: "Deposit"
};

export const transferDataMock = {
  oneTimeImmediateTransferFromAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account03LLOC,
    account04TFSA,
    account08LLOC,
    account09SPRINGBOARDUSD
  ],
  oneTimeFutureDatedTransferFromAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account04TFSA,
    account09SPRINGBOARDUSD
  ],
  recurringTransferFromAccounts: [account01noFee, account02SPRINGBOARD],
  transfersToAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account03LLOC,
    account04TFSA,
    account05RML,
    account06TPPL,
    account07DI,
    account08LLOC,
    account09SPRINGBOARDUSD
  ],
  transfersToAccountsUSD: [
    account01noFee,
    account02SPRINGBOARD,
    account09SPRINGBOARDUSD
  ]
};

export const transferStateMock = {
  fromAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account03LLOC,
    account04TFSA,
    account08LLOC
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $42,000.01",
      key: "account_01_NoFee",
      value: "account_01_NoFee"
    },
    {
      text: "Springboard Savings Account (1479) | $220,387.03",
      key: "account_02_SPRINGBOARD",
      value: "account_02_SPRINGBOARD"
    },
    {
      text: "Linked Line of Credit (7200) | $500,000.00",
      key: "account_03_LLOC",
      value: "account_03_LLOC"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,106.88",
      key: "account_04_TFSA",
      value: "account_04_TFSA"
    },
    {
      text: "Linked Line of Credit (9400) | $500,000.00",
      key: "account_08_LLOC",
      value: "account_08_LLOC"
    }
  ],
  toAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account04TFSA,
    account03LLOC,
    account05RML,
    account06TPPL,
    account07DI,
    account08LLOC
  ],
  toAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) | $42,000.01",
      key: "account_01_NoFee",
      value: "account_01_NoFee"
    },
    {
      text: "Springboard Savings Account (1479) | $220,387.03",
      key: "account_02_SPRINGBOARD",
      value: "account_02_SPRINGBOARD"
    },
    {
      text: "Linked Line of Credit (7200) | $500,000.00",
      key: "account_03_LLOC",
      value: "account_03_LLOC"
    },
    {
      text: "Tax-Free Saver Account (7100) | $3,106.88",
      key: "account_04_TFSA",
      value: "account_04_TFSA"
    },
    {
      text: "Residential Mortgage Loan (1100) | $0.00",
      key: "account_05_RML",
      value: "account_05_RML"
    },
    {
      text: "TPPL Unsecured and Cash Secured (1700) | $0.00",
      key: "account_06_TPPL",
      value: "account_06_TPPL"
    },
    {
      text: "Daily Interest Account (4700) | $858.11",
      key: "account_07_DI",
      value: "account_07_DI"
    },
    {
      text: "Linked Line of Credit (9400) | $500,000.00",
      key: "account_08_LLOC",
      value: "account_08_LLOC"
    }
  ],
  immediateTransferAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account03LLOC,
    account04TFSA,
    account08LLOC
  ],
  futureDatedTransferAccounts: [
    account01noFee,
    account02SPRINGBOARD,
    account04TFSA
  ],
  recurringAccounts: [account01noFee, account02SPRINGBOARD],
  primary: primaryOptions.notSelected,
  from: "account_01_NoFee",
  to: "account_02_SPRINGBOARD",
  amount: "$1.00",
  when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  starting: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  endingOption: endingOptions.never,
  ending: null,
  numberOfTransfers: "",
  endDateNoOfTransfersMessage: "",
  frequency: "Weekly",
  createCompleted: true,
  preparedDataForReview: {
    From: {
      visible: true,
      imageIcon: "account.svg",
      title: "From",
      label: "No-Fee All-In Account (7679) | $42,000.01"
    },
    DownArrow: { visible: true, imageIcon: "arrow_down.svg" },
    To: {
      visible: true,
      imageIcon: "account.svg",
      title: "To",
      label: "Springboard Savings Account (1479) | $220,387.03"
    },
    Amount: {
      visible: true,
      imageIcon: "money.svg",
      title: "Amount",
      label: "$1.00"
    },
    Frequency: {
      visible: true,
      imageIcon: "frequency.svg",
      title: "Frequency",
      label: "Weekly"
    },
    Starting: {
      visible: true,
      imageIcon: "calendar.svg",
      title: "Starting",
      label: "Mar 18, 2020"
    },
    Ending: {
      visible: true,
      imageIcon: "end-date.svg",
      title: "Ending",
      label: "Never"
    },
    NumOfTransfers: {
      visible: false,
      imageIcon: "recurring.svg",
      title: "Number of transfers",
      label: ""
    },
    Message: { visible: false, message: "" }
  }
};

export const transferStateMockNoPreparedData = {
  from: "account_01_NoFee",
  to: "account_02_SPRINGBOARD",
  amount: "$1.00",
  starting: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  endingOption: endingOptions.never,
  frequency: "Weekly",
  createCompleted: false
};

export const divider = [
  {
    key: "divider",
    value: "divider",
    content: <div className="ui horizontal divider">Ineligible accounts</div>,
    disabled: true
  }
];

export const transferDataMockDataReload = {
  oneTimeImmediateTransferFromAccounts: [
    account01noFee,
    account02SPRINGBOARDDiffBalance,
    account03LLOC,
    account04TFSA,
    account08LLOC
  ],
  oneTimeFutureDatedTransferFromAccounts: [
    account01noFee,
    account02SPRINGBOARDDiffBalance,
    account04TFSA
  ],
  recurringTransferFromAccounts: [
    account01noFee,
    account02SPRINGBOARDDiffBalance
  ],
  transfersToAccounts: [
    account01noFee,
    account02SPRINGBOARDDiffBalance,
    account03LLOC,
    account04TFSA,
    account05RML,
    account06TPPL,
    account07DI,
    account08LLOC
  ]
};
