import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const mockData = [
  {
    targetAccountProductName: "Test Column",
    targetAccountNumber: "3456",
    amount: {
      value: 1
    },
    sourceAccountProductName: "Test Product Name",
    sourceAccountNumber: "456789",
    paymentDate: "2020-06-01"
  },
  {
    targetAccountProductName: "Test Column",
    targetAccountNumber: "1234",
    amount: {
      value: 1
    },
    sourceAccountProductName: "Test Product Name",
    sourceAccountNumber: "456789",
    paymentDate: "2020-05-28"
  }
];

export const expectedBody = genericClickHandler => {
  return {
    columns: [
      [
        {
          data: (
            <>
              <span className="acct-name">Test Column</span>({}
              1234
              {})
            </>
          ),
          header: "to",
          width: {
            widescreen: "four",
            desktop: "five",
            tablet: "four",
            mobile: "sixteen"
          }
        },
        {
          data: "$1.00",
          header: "Amount",
          width: {
            widescreen: "two",
            desktop: "two",
            tablet: "two",
            mobile: "sixteen"
          }
        },
        {
          data: (
            <>
              <span className="acct-name">Test Product Name</span>({})
            </>
          ),
          header: "From",
          width: {
            desktop: "six",
            tablet: "five",
            mobile: "eight"
          }
        },
        {
          data: "June 01, 2020",
          header: "Next scheduled",
          hasIcon: true,
          width: {
            desktop: "four",
            tablet: "five",
            mobile: "eight"
          }
        }
      ]
    ],
    chevron: {
      icon: "chevron-right.svg",
      alt: "chevron alt tag",
      onClick: genericClickHandler
    },
    trash: {
      icon: "trashcan.svg",
      alt: "trash alt tag",
      onClick: () => {}
    }
  };
};

export const oneTimeData = {
  amount: 1,
  recurringType: "never",
  from: {
    name: "Test Account 1",
    id: "123456"
  },
  to: {
    name: "Test Account 2",
    id: "456789"
  },
  when: dayjs("01-19-2020", "MM-DD-YYYY")
};

export const recurringData = {
  amount: 1,
  recurringType: "never",
  from: {
    name: "Test Account 1",
    id: "123456"
  },
  to: {
    name: "Test Account 2",
    id: "456789"
  },
  starting: dayjs("01-22-2020", "MM-DD-YYYY"),
  endDate: dayjs("01-31-2020", "MM-DD-YYYY"),
  frequency: "weekly"
};

export const withdrawalAccountsSuccess = [
  {
    name: "Basic Account",
    number: "4779",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 44985.74
    },
    availableBalance: {
      currency: "CAD",
      value: 44985.74
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471837",
    id: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
  }
];

export const depositAccountsSuccess = [
  {
    name: "No-Fee All-In Account",
    number: "7679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49313.12
    },
    availableBalance: {
      currency: "CAD",
      value: 99313.12
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_SLOC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
  },
  {
    name: "Springboard Savings Account",
    number: "1479",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49651.39
    },
    availableBalance: {
      currency: "CAD",
      value: 49651.39
    },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_SPRINGBOARD",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
  },
  {
    name: "US Dollar Savings Account",
    number: "5779",
    currency: "USD",
    balance: {
      currency: "USD",
      value: 50041.5
    },
    availableBalance: {
      currency: "USD",
      value: 50041.5
    },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_USD_SAVINGS",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj8zP5lY0oNZH3acXxuxekSU"
  },
  {
    name: "Basic Account",
    number: "6679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49981291.74
    },
    availableBalance: {
      currency: "CAD",
      value: 49981291.74
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
  },
  {
    name: "Springboard Savings Account",
    number: "2279",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49835.51
    },
    availableBalance: {
      currency: "CAD",
      value: 49835.51
    },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_SPRINGBOARD",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I"
  },
  {
    name: "Basic Account",
    number: "8479",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 46965.23
    },
    availableBalance: {
      currency: "CAD",
      value: 46965.23
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI"
  },
  {
    name: "No-Fee All-In Account",
    number: "6879",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49775.1
    },
    availableBalance: {
      currency: "CAD",
      value: 99775.1
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_SLOC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y"
  },
  {
    name: "Basic Account",
    number: "7679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 980244.8
    },
    availableBalance: {
      currency: "CAD",
      value: 980644.8
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc"
  }
];

export const depositAccountsSuccessNonUSD = [
  {
    name: "No-Fee All-In Account",
    number: "7679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49313.12
    },
    availableBalance: {
      currency: "CAD",
      value: 99313.12
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_SLOC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
  },
  {
    name: "Springboard Savings Account",
    number: "1479",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49651.39
    },
    availableBalance: {
      currency: "CAD",
      value: 49651.39
    },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_SPRINGBOARD",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
  },
  {
    name: "Basic Account",
    number: "6679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49981291.74
    },
    availableBalance: {
      currency: "CAD",
      value: 49981291.74
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
  },
  {
    name: "Springboard Savings Account",
    number: "2279",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49835.51
    },
    availableBalance: {
      currency: "CAD",
      value: 49835.51
    },
    type: "Deposit",
    subType: "Saving",
    status: "30",
    subProductCode: "RETDP_SPRINGBOARD",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHjxTsNI7RA4tg-Pek-DLHJ0I"
  },
  {
    name: "Basic Account",
    number: "8479",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 46965.23
    },
    availableBalance: {
      currency: "CAD",
      value: 46965.23
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj9hsjmA3VoePn4NqhC68yfI"
  },
  {
    name: "No-Fee All-In Account",
    number: "6879",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 49775.1
    },
    availableBalance: {
      currency: "CAD",
      value: 99775.1
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_SLOC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj-myiv7ecipHGmh_ZDG_m2Y"
  },
  {
    name: "Basic Account",
    number: "7679",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: 980244.8
    },
    availableBalance: {
      currency: "CAD",
      value: 980644.8
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471847",
    id: "33ZFwIxk3ZebPZZx1bDHj5BHdY77pFThxhcFHkednoc"
  }
];
export const withdrawalAccountsEmpty = [];
export const depositAccountsEmpty = [];

export const oneTimeTransferDetailsData = {
  transferId:
    "AJIuJEeccXkdl4tPDD0AvY93NTp9JAYqCfuO87mbhjiuP6TV1Rl2jdFyfVF1eSWT_z1CkiHoC6GQZExgl3egqoQ1ZPlanhBbe3XRmIJPOjPJ34gvPqTRmL7day9gfIP2sHoVApqGMx9iSirvKntqmjbvnUtZ3s0nww5UPL_nKvc",
  status: "pending",
  paymentDate: "2020-05-08",
  sourceAccountProductName: "No-Fee All-In Account",
  sourceAccountNumber: "9479",
  sourceAccountCurrency: "CAD",
  targetAccountProductName: "Springboard Savings Account",
  targetAccountNumber: "8379",
  targetAccountCurrency: "CAD",
  amount: { currency: "CAD", value: 1 },
  remainingPayments: "1",
  paymentType: "One Time Future Dated"
};

export const recurringTransferWithNoEndDateData = {
  transferId:
    "G0X2f_mWLaNEtkKiTGd35VQlajSOqHTDtYcRJE7tLDZJ5fmzxd2bYsl6a_HFjwSrw0mdn5qq9dqzuqXgDWeZ-oOSdrzqe0GYokqDgcllnAcJ-Yp25aP2B2O5fJQEuJkLjUsXD2s-Coezs04i0KJ5tw",
  status: "pending",
  paymentDate: "2020-05-17",
  sourceAccountProductName: "Unlimited Account",
  sourceAccountNumber: "6779",
  sourceAccountCurrency: "CAD",
  targetAccountProductName: "Springboard Savings Account",
  targetAccountNumber: "8379",
  targetAccountCurrency: "CAD",
  amount: { currency: "CAD", value: 3.33 },
  transferExecutionCycle: {
    periodFrequency: 1,
    periodUnit: "Week",
    dayWithinPeriod: 7,
    nextExecutionDate: "2020-05-17",
    lastExecutionDate: "2020-06-14",
    suspendFromDate: null,
    suspendToDate: null
  },
  remainingPayments: "2",
  paymentType: "Recurring No End Date"
};

export const recurringTransferWithEndDateData = {
  transferId:
    "G0X2f_mWLaNEtkKiTGd35VQlajSOqHTDtYcRJE7tLDZJ5fmzxd2bYsl6a_HFjwSrw0mdn5qq9dqzuqXgDWeZ-oOSdrzqe0GYokqDgcllnAcJ-Yp25aP2B2O5fJQEuJkLjUsXD2s-Coezs04i0KJ5tw",
  status: "pending",
  paymentDate: "2020-05-17",
  sourceAccountProductName: "Unlimited Account",
  sourceAccountNumber: "6779",
  sourceAccountCurrency: "CAD",
  targetAccountProductName: "Springboard Savings Account",
  targetAccountNumber: "8379",
  targetAccountCurrency: "CAD",
  amount: { currency: "CAD", value: 3.33 },
  transferExecutionCycle: {
    periodFrequency: 1,
    periodUnit: "Week",
    dayWithinPeriod: 7,
    nextExecutionDate: "2020-05-17",
    lastExecutionDate: "2020-06-14",
    suspendFromDate: null,
    suspendToDate: null
  },
  remainingPayments: "2",
  paymentType: "Recurring With End Date"
};
