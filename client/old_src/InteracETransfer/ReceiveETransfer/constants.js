export const receiveRequest = {
  eTransferId: "CAg7vFUj",
  eTransferProduct: "eTransfer Domestic",
  eTransferType: "Regular eTransfer",
  eTransferATBPaymentStatus: "Pending",
  eTransferStatus: "Transfer Available",
  senderParticipantId: "CA000219",
  senderName: "Different Random Email",
  amount: {
    currency: "CAD",
    value: 1
  },
  expiryDateTime: "2020-10-22T00:00:00.000Z",
  beneficiaryMessage: "test receive",
  authenticationRequired: true,
  authenticationType: "Contact Level Security",
  eTransferSecurity: {
    question: "what is my name",
    hashType: "SHA2",
    hashSalt: "1603129373685"
  },
  responseCode: 0
};
export const receiveRequestNoAuth = {
  eTransferId: "CAg7vFUj",
  eTransferProduct: "eTransfer Domestic",
  eTransferType: "Regular eTransfer",
  eTransferATBPaymentStatus: "Pending",
  eTransferStatus: "Authentication Successful",
  senderParticipantId: "CA000219",
  senderName: "Different Random Email",
  amount: {
    currency: "CAD",
    value: 1
  },
  expiryDateTime: "2020-10-22T00:00:00.000Z",
  beneficiaryMessage: "test receive",
  authenticationRequired: false,
  authenticationType: "Contact Level Security",
  eTransferSecurity: {
    question: "what is my name",
    hashType: "SHA2",
    hashSalt: "1603129373685"
  },
  responseCode: 0
};

export const receiveRequestNoMSG = {
  eTransferId: "CAg7vFUj",
  eTransferProduct: "eTransfer Domestic",
  eTransferType: "Regular eTransfer",
  eTransferATBPaymentStatus: "Pending",
  eTransferStatus: "Transfer Available",
  senderParticipantId: "CA000219",
  senderName: "Different Random Email",
  amount: {
    currency: "CAD",
    value: 1
  },
  expiryDateTime: "2020-10-22T00:00:00.000Z",
  beneficiaryMessage: "test receive",
  authenticationRequired: true,
  authenticationType: "Contact Level Security",
  eTransferSecurity: {
    question: "what is my name",
    hashType: "SHA2",
    hashSalt: "1603129373685"
  },
  responseCode: 0
};

export const receiveResult = id => {
  return {
    eTransferId: id,
    eTransferProduct: "eTransfer Domestic",
    eTransferType: "Regular eTransfer",
    eTransferATBPaymentStatus: "Pending",
    eTransferStatus: "Transfer Available",
    senderParticipantId: "CA000219",
    senderName: "Different Random Email",
    amount: {
      currency: "CAD",
      value: 1
    },
    expiryDateTime: "2020-10-22T00:00:00.000Z",
    beneficiaryMessage: "test receive",
    authenticationRequired: true,
    authenticationType: "Contact Level Security",
    eTransferSecurity: {
      question: "what is my name",
      hashType: "SHA2",
      hashSalt: "1603129373685"
    },
    responseCode: 0
  };
};

export const receiveGetFail15 = {
  statusCode: 400,
  code: "ETRN0015",
  message: "Cannot perform operation due to current transfer status."
};

export const receivePostFail15 = {
  data: {
    statusCode: 400,
    code: "ETRN0015",
    message: "Cannot perform operation due to current transfer status."
  }
};

export const receivePostFail18 = {
  data: {
    code: "ETRN0018",
    message: "Authentication failed - try again",
    statusCode: 400
  }
};

export const receivePostFail19 = {
  data: {
    code: "ETRN0019",
    message: "Authentication failed - cannot try again",
    statusCode: 400
  }
};

export const receivePostFail20 = {
  data: {
    statusCode: 400,
    code: "ETRN0020",
    message: "Cannot perform operation due to current transfer status."
  }
};

export const receiveFormData = {
  answer: ""
};

export const toAccounts = [
  {
    availableBalance: {
      currency: "CAD",
      value: -10.7
    },
    balance: { currency: "CAD", value: -10.7 },
    currency: "CAD",
    customerId: "0002961384",
    id: "33ZFwIxk3ZebPZZx1bDHjxO7if4ca646TGmVAHM1l9U",
    name: "ATB Advantage Account",
    number: "2379",
    status: "30",
    subProductCode: "RETDP_ADVANTAGE",
    subType: "Chequing",
    subTypeV1: "Chequing",
    type: "Deposit"
  },
  {
    availableBalance: { currency: "CAD", value: -9.2 },
    balance: { currency: "CAD", value: -9.2 },
    currency: "CAD",
    customerId: "0002961384",
    id: "33ZFwIxk3ZebPZZx1bDHjzwzjmA2jht8S_Snvm-8gAI",
    name: "ATB Advantage Account",
    number: "5879",
    status: "30",
    subProductCode: "RETDP_ADVANTAGE",
    subType: "Chequing",
    subTypeV1: "Chequing",
    type: "Deposit"
  }
];
