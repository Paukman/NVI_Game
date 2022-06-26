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
      maxOutstandingRequests: 10,
      maxRequestOutgoingAmount: 30
    }
  },
  accumulatedAmount: {
    outgoingAmounts: {
      total24HrAmount: 83,
      total7DayAmount: 83,
      total30DayAmount: 102
    },
    totalOutstandingMoneyRequests: 0
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
    }
  },
  accumulatedAmount: {
    outgoingAmounts: {
      total24HrAmount: 5000,
      total7DayAmount: 500,
      total30DayAmount: 500
    }
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
    aliasName:
      "11111111112222222222333333333344444444445555555555666666666677777777778888888888",
    defaultTransferAuthentication: {
      authenticationType: "Contact Level Security",
      question: "question",
      hashType: "SHA2"
    },
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "1+1@1.com",
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
