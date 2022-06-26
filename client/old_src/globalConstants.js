const disallowedWords = [
  "http:",
  "https:",
  "javascript",
  "www.",
  "function",
  "return",
  "www",
  "http",
  "https"
];

const modeName = {
  EDIT_MODE: "Edit",
  CREATE_MODE: "Create"
};

const menageContacts = {
  PAYEES: "PAYEES",
  RECIPIENTS: "RECIPIENTS",
  ADD_RECIPIENT_SECURITY: "ADD_RECIPIENT_SECURITY",
  EDIT_RECIPIENT: "EDIT_RECIPIENT_PAGE",
  RECIPIENT_DETAILS: "RECIPIENT_DETAILS",
  PAYEE_DETAILS: "PAYEE_DETAILS",
  EDIT_PAYEE: "EDIT_PAYEE"
};

const recurringFrequency = {
  weekly: "weekly",
  biweekly: "biweekly",
  monthly: "monthly",
  yearly: "yearly"
};

const qualtricsIDs = {
  getStarted: "qualtrics-contactus",
  successfulLogin: "qualtrics-login",
  eTransferSend: "qualtrics-etransfer",
  // eTransferRequest is for the SENDING of a request, not fulfilling of a request
  eTransferRequest: "qualtrics-moneyrequest",
  oneTimePayment: "qualtrics-payment-onetime",
  recurringPayment: "qualtrics-payment-recurring",
  oneTimeTransfer: "qualtrics-transfer-onetime",
  recurringTransfer: "qualtrics-transfer-recurring"
};

const fees = {
  ETRANSFER_REQUEST: "$1.50"
};

const contactSupport = {
  PHONE_NUMBER:
    window.envConfig?.REBANK_SUPPORT_PHONE_NUMBER || "1-800-332-8383",
  EMAIL: window.envConfig?.REBANK_SUPPORT_EMAIL || "personal.beta@atb.com"
};

export {
  contactSupport,
  disallowedWords,
  fees,
  menageContacts,
  modeName,
  qualtricsIDs,
  recurringFrequency
};
