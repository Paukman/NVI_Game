import { apiConfig, etransfersBaseUrl, accountsBaseUrl } from "api";

export const loggedinUserURL = `${accountsBaseUrl}/accountHolderName`;

const autoDepositconfig = {
  data: apiConfig,
  url: `${etransfersBaseUrl}/autodeposits/`
};

const accounts = [
  {
    value: "123456",
    key: "XEFWERTEGHsdjkhfjskfhlsk",
    text: "Basic Account"
  },
  {
    value: "4534656456",
    key: "dskfhkdfhsdlkfhjldsf",
    text: "No-Fee Account"
  }
];

const autoDeposits = [
  {
    accountName: "No-Fee All-In Account",
    directDepositReferenceNumber: "CA1DDthQTMvX33Ng",
    directDepositHandle: "faketesting@atb.com",
    accountHolderName: "George Morgan Vegas",
    account: "6879",
    bankAccount: {
      country: "CA",
      routingId: "00001",
      accountId: "0000000734458979"
    },
    registrationStatus: 0
  },
  {
    accountName: "Basic Account",
    directDepositReferenceNumber: "CA1DDtnpG8pFTxr7",
    directDepositHandle: "test@atb.cozncm",
    accountHolderName: "George Morgan Vegas",
    account: "6679",
    bankAccount: {
      country: "CA",
      routingId: "00002",
      accountId: "0000000734458889"
    },
    registrationStatus: 1
  }
];

export const dataWithProfile = {
  enabled: true,
  customerName: {
    registrationName: "James Bond"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "james_bond@saveworld.com"
    }
  ]
};
export const dataWithNoProfile = {
  enabled: false
};

export { autoDepositconfig, accounts, autoDeposits };
