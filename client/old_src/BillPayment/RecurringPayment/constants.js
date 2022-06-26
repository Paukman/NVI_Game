import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { endingOptions } from "../constants";

dayjs.extend(customParseFormat);

export const frequencyOptions = [
  {
    text: "Weekly",
    value: "weekly"
  },
  {
    text: "Every two weeks",
    value: "biweekly"
  },
  {
    text: "Monthly",
    value: "monthly"
  },
  {
    text: "Yearly",
    value: "yearly"
  }
];

export const amountValidationGetValuesFrom =
  "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk";
export const amountValidationState = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
      balance: { currency: "CAD", value: 2000.01 },
      availableBalance: { currency: "CAD", value: 2000.01 },
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
      balance: { currency: "CAD", value: 1000.01 },
      availableBalance: { currency: "CAD", value: 1000.01 },
      type: "Deposit",
      subType: "Saving",
      status: "30",
      subProductCode: "RETDP_SPRINGBOARD",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    }
  ]
};

export const recurringBillState = {
  fromAccounts: [
    {
      name: "No-Fee All-In Account",
      number: "7679",
      currency: "CAD",
      balance: { currency: "CAD", value: 89499.46 },
      availableBalance: { currency: "CAD", value: 89499.46 },
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
      balance: { currency: "CAD", value: 39593.01 },
      availableBalance: { currency: "CAD", value: 39593.01 },
      type: "Deposit",
      subType: "Saving",
      status: "30",
      subProductCode: "RETDP_SPRINGBOARD",
      customerId: "0002471847",
      id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    }
  ],
  fromAccountsFormatted: [
    {
      text: "No-Fee All-In Account (7679) - $89,499.46",
      key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
    },
    {
      text: "Springboard Savings Account (1479) - $39,593.01",
      key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
      value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    }
  ],
  from: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
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
    }
  ],
  billPayeesFormatted: [
    {
      text: "TELUS MOBILITY (2625)",
      key: "2625",
      value: "2625"
    },
    {
      text: "WESTBURNE WEST (0056)",
      key: "0056",
      value: "0056"
    }
  ],
  to: "2625",
  amount: "$1.00",
  starting: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  endingOption: endingOptions.never,
  ending: null,
  numberOfPayments: "",
  endDateNoOfPaymentsMessage: "",
  note: "",
  preparedDataForReview: {
    From: {
      visible: true,
      imageIcon: "/static/media/account.da6f95e9.svg",
      title: "From",
      label: "No-Fee All-In Account (7679) - $89,499.46"
    },
    DownArrow: {
      visible: true,
      imageIcon: "/static/media/arrow_down.7fd6fb37.svg"
    },
    To: {
      visible: true,
      imageIcon: "/static/media/pay-bill.02e044a3.svg",
      title: "To",
      label: "TELUS MOBILITY (2625)"
    },
    Amount: {
      visible: true,
      imageIcon: "/static/media/money.c79bdc3d.svg",
      title: "Amount",
      label: "$1.00"
    },
    Starting: {
      visible: true,
      imageIcon: "/static/media/calendar.315e3dcf.svg",
      title: "Starting",
      label: "Apr 06, 2020"
    },
    Ending: {
      imageIcon: "/static/media/end-date.ddb6c077.svg",
      label: "May 28, 2020",
      title: "Ending",
      visible: true
    },
    NumberOf: {
      imageIcon: "/static/media/recurring.2888b0b8.svg",
      label: "5",
      title: "Number of payments",
      visible: true
    },
    Note: {
      visible: false,
      imageIcon: "/static/media/note.24cb4478.svg",
      title: "Note",
      label: ""
    },
    Message: {
      visible: true,
      message:
        "Bill payments submitted after 8pm MT will be processed the next business day. We recommend making bill payments at least 2-3 business days before a bill comes due."
    }
  },
  createCompleted: true
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

export const recurringBillStateWitCreditCard = {
  ...recurringBillState,
  fromAccounts: [...recurringBillState.fromAccounts, testCreditAccount],
  fromAccountsFormatted: [
    ...recurringBillState.fromAccountsFormatted,
    {
      text: "CREDIT CARD TEST ACCOUNT (7679) - $39,486.63",
      key: "testid",
      value: "testid"
    }
  ]
};

export const recurringBillStateNoPreparedData = {
  from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
  to: "2625",
  amount: "$1.00",
  starting: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  endingOption: endingOptions.never,
  ending: null,
  numberOfPayments: "",
  endDateNoOfPaymentsMessage: "",
  note: "",
  preparedDataForReview: []
};
