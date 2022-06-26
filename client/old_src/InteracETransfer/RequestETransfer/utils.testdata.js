const eTransferLimitsPassing = {
  limits: {
    limitsGroupId: "CA000219_DEFAULT",
    limitsGroup: "Retail",
    outgoingLimits: {
      limitsType: "general",
      minAmount: 0.01,
      maxAmount: 5000,
      max24HrAmount: 5000,
      max7DayAmount: 10000,
      max30DayAmount: 15000
    },
    requestMoneyLimits: {
      maxRequestOutgoingAmount: 3000,
      maxOutstandingRequests: 5
    }
  },
  accumulatedAmount: {
    outgoingAmounts: {
      total24HrAmount: 0,
      total7DayAmount: 0,
      total30DayAmount: 0
    },
    totalOutstandingMoneyRequests: 4
  }
};

const eTransferLimitsFailing = {
  limits: {
    limitsGroupId: "CA000219_DEFAULT",
    limitsGroup: "Retail",
    outgoingLimits: {
      limitsType: "general",
      minAmount: 0.01,
      maxAmount: 5000,
      max24HrAmount: 5000,
      max7DayAmount: 10000,
      max30DayAmount: 15000
    },
    requestMoneyLimits: {
      maxRequestOutgoingAmount: 2000,
      maxOutstandingRequests: 5
    }
  },
  accumulatedAmount: {
    outgoingAmounts: {
      total24HrAmount: 5000,
      total7DayAmount: 500,
      total30DayAmount: 500
    },
    totalOutstandingMoneyRequests: 5
  }
};

const interacProfilePassing = {
  enabled: true,
  customerEnabledForMoneyRequests: true
};

const interacProfileFailing = {};

const eligibleAccountsFromDataPassing = [
  {
    name: "Basic Account",
    number: "4779",
    id: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc",
    currency: "CAD",
    balance: {
      currency: "CAD",
      value: "49984.01"
    },
    availableBalance: {
      currency: "CAD",
      value: "49984.01"
    },
    type: "Deposit",
    subType: "Chequing",
    status: "30",
    subProductCode: "RETDP_BASIC",
    customerId: "0002471837"
  }
];

const eligibleAccountsFromDataFailing = [];

const recipientsPassing = [
  {
    recipientId: "CAhGbyStTbMv",
    aliasName: "abc",
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "1+1@1.com",
        isActive: true
      }
    ]
  },
  {
    recipientId: "CAtTFF3C99FA",
    aliasName: "Bob-Jackson",
    defaultTransferAuthentication: {
      authenticationType: "Contact Level Security",
      question: "ABC",
      hashType: "SHA2"
    },
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "faketesting@atb.com",
        isActive: true
      }
    ]
  }
];

const recipientsFailing = [];

module.exports = {
  eTransferLimitsPassing,
  eTransferLimitsFailing,
  interacProfilePassing,
  interacProfileFailing,
  eligibleAccountsFromDataPassing,
  eligibleAccountsFromDataFailing,
  recipientsPassing,
  recipientsFailing
};
