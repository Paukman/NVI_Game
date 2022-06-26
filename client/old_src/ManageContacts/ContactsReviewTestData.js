const data = {
  recipients: [
    {
      recipientId: "CAzvX8UAKu9X",
      aliasName: "Aaaron Brick",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        question: "215",
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
  ],
  payees: [
    {
      billPayeeId: "005612",
      payeeName: "WESTBURNE WEST",
      payeeNickname: "Nick Name",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "3636510056"
    }
  ],
  profile: {
    enabled: true,
    customerEnabledForMoneyRequests: true,
    productRegistration: [
      {
        productCode: "eTransfer domestic",
        currencyCode: "CAD",
        customerLimitsGroupId: "CA000219_DEFAULT"
      }
    ],
    customerType: "retail",
    customerName: {
      registrationName: "Reese Stewart",
      legalName: {
        retailName: {
          firstName: "Reese",
          middleName: "Haven",
          lastName: "Stewart"
        }
      }
    },
    language: "en",
    notificationPreference: [
      {
        notificationHandleType: "Email",
        notificationHandle: "test@atb.com",
        isActive: true
      }
    ],
    lastUpdatedDate: "2021-04-09T14:46:25.000Z"
  }
};

const approvedCreditors = [
  {
    id: "2771284",
    name: "12 MILE STORAGE"
  },
  {
    id: "1233",
    name: "123 Tree Planting"
  },
  {
    id: "2132",
    name: "abc Branch testing services Ltd."
  },
  {
    id: "43665",
    name: "Forester Municipality division 212 "
  }
];

const noRecipients = {
  recipients: [],
  payees: [
    {
      billPayeeId: "005612",
      payeeName: "WESTBURNE WEST",
      payeeNickname: "WESTBURNE WEST",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "3636510056"
    }
  ]
};

const noPayees = {
  recipients: [
    {
      recipientId: "CAzvX8UAKu9X",
      aliasName: "Aaaron Brick",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        question: "215",
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
  ],
  payees: []
};

const authNone = {
  recipients: [
    {
      recipientId: "CAuTRu9eXMwp",
      aliasName: "rebank auto deposit",
      defaultTransferAuthentication: {
        authenticationType: "None"
      },
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "faketesting@atb.com",
          isActive: true
        }
      ]
    }
  ],
  payees: []
};

const nonSHA2 = {
  recipients: [
    {
      recipientId: "CAzvX8UAKu9X",
      aliasName: "Aaaron Brick",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        question: "215",
        hashType: "ABC"
      },
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "faketesting@atb.com",
          isActive: true
        }
      ]
    }
  ],
  payees: []
};

const noNickNamePayee = {
  recipients: [],
  payees: [
    {
      billPayeeId: "005612",
      payeeName: "WESTBURNE WEST",
      ATBMastercardCurrency: null,
      ATBMastercardIndicator: false,
      payeeCustomerReference: "3636510056"
    }
  ]
};

const recipientToHandle = {
  recipientId: "CAuTRu9eXMwp",
  aliasName: "Aaaron A (Ash)",
  defaultTransferAuthentication: {
    authenticationType: "Contact Level Security",
    question: "question",
    hashType: "SHA2"
  },
  notificationPreference: [
    {
      notificationHandleType: "Email",
      notificationHandle: "faketesting@atb.com",
      isActive: true
    }
  ]
};

const payeeToHandle = {
  billPayeeId: "005612",
  payeeName: "WESTBURNE WEST",
  payeeNickname: "WESTBURNE WEST",
  ATBMastercardCurrency: null,
  ATBMastercardIndicator: false,
  payeeCustomerReference: "3636510056"
};

module.exports = {
  data,
  approvedCreditors,
  noRecipients,
  noPayees,
  authNone,
  nonSHA2,
  noNickNamePayee,
  recipientToHandle,
  payeeToHandle
};
