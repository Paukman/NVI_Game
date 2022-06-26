import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const preparedDataForReview = {
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
  When: {
    visible: true,
    imageIcon: "/static/media/calendar.315e3dcf.svg",
    title: "When",
    label: "Apr 06, 2020"
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
      "Bill payments submitted after 8pm MT will be proce… least 2-3 business days before a bill comes due."
  }
};

export const oneTimeBillState = {
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
  when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  note: "",
  preparedDataForReview,
  preparedDataForComplete: { ...preparedDataForReview },
  createCompleted: true,
  enableFeatureToggle: true,
  fetchingPayments: false,
  matchingPayments: []
};
export const oneTimeBillStateNoPreparedData = {
  to: "2625",
  amount: "$1.00",
  when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
  note: "",
  preparedDataForReview: [],
  createCompleted: false
};
