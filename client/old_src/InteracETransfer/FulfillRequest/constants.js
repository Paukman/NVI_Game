export const MoneyRequestStatus = Object.freeze({
  AVAILABLE: "Available",
  COMPLETED: "Deposit Complete"
});

export const fulfillRequest = {
  amount: 1111,
  amountCurrency: "CAD",
  beneficiaryMessage: "Test message",
  expiryDateTime: "2020-05-28T16:33:26.909Z",
  fraudCheckResult: {
    action: "ALLOW_TRANSFER",
    reason: null,
    score: null
  },
  invoiceDetail: null,
  isAmountEditable: false,
  moneyRequestStatus: MoneyRequestStatus.AVAILABLE,
  moneyRequestType: "Regular Money Request without a return URL",
  notificationPreference: [
    {
      notificationHandle: "testing123456@atb.com",
      notificationHandleType: "Email"
    }
  ],
  participantId: "CA000219",
  registrantName: {
    aliasName: "Test User",
    businessName: null,
    retailName: {
      firstName: "Ariel",
      lastName: "Wheeler",
      middleName: "Ellis"
    }
  },
  registrantType: "Retail",
  responseCode: 0,
  returnURL: null
};

export const fulfillRequestBusiness = {
  amount: 1111,
  amountCurrency: "CAD",
  beneficiaryMessage: "Test message",
  expiryDateTime: "2020-05-28T16:33:26.909Z",
  fraudCheckResult: {
    action: "ALLOW_TRANSFER",
    reason: null,
    score: null
  },
  invoiceDetail: {
    invoiceNumber: "123456",
    dueDate: "2020-05-28T16:33:26.909Z"
  },
  isAmountEditable: false,
  moneyRequestStatus: "Available",
  moneyRequestType: "Regular Money Request without a return URL",
  notificationPreference: [
    {
      notificationHandle: "testing123456@atb.com",
      notificationHandleType: "Email"
    }
  ],
  participantId: "CA000219",
  registrantName: {
    aliasName: "Company User",
    businessName: {
      companyName: "Company User",
      tradeName: "Trade Name"
    },
    retailName: null
  },
  registrantType: "Corporation",
  responseCode: 0,
  returnURL: null
};

export const postData = {
  message: "Test",
  from: {
    availableBalance: {
      currency: "CAD",
      value: 43230.91
    },
    balance: {
      currency: "CAD",
      value: 43230.91
    },
    currency: "CAD",
    customerId: "0002492677",
    id: "33ZFwIxk3ZebPZZx1bDHjxuAp4QScry4-bo2ZAk0m_s",
    name: "Basic Account",
    number: "3779",
    status: "30",
    subProductCode: "RETDP_BASIC",
    subType: "Chequing",
    subTypeV1: "Chequing",
    type: "Deposit"
  }
};

export const postDataNoMessage = {
  message: "",
  from: {
    availableBalance: {
      currency: "CAD",
      value: 43230.91
    },
    balance: {
      currency: "CAD",
      value: 43230.91
    },
    currency: "CAD",
    customerId: "0002492677",
    id: "33ZFwIxk3ZebPZZx1bDHjxuAp4QScry4-bo2ZAk0m_s",
    name: "Basic Account",
    number: "3779",
    status: "30",
    subProductCode: "RETDP_BASIC",
    subType: "Chequing",
    subTypeV1: "Chequing",
    type: "Deposit"
  }
};

export const requestFulfilled = {
  amount: 1411,
  amountCurrency: "CAD",
  beneficiaryMessage: "Test message",
  expiryDateTime: "2020-05-28T16:33:26.909Z",
  fraudCheckResult: {
    action: "ALLOW_TRANSFER",
    reason: null,
    score: null
  },
  invoiceDetail: null,
  isAmountEditable: false,
  moneyRequestStatus: MoneyRequestStatus.COMPLETED,
  moneyRequestType: "Regular Money Request without a return URL",
  notificationPreference: [
    {
      notificationHandle: "testing123456@atb.com",
      notificationHandleType: "Email"
    }
  ],
  participantId: "CA000219",
  registrantName: {
    aliasName: "Test User",
    businessName: null,
    retailName: {
      firstName: "Ariel",
      lastName: "Wheeler",
      middleName: "Ellis"
    }
  },
  registrantType: "Retail",
  responseCode: 0,
  returnURL: null
};
