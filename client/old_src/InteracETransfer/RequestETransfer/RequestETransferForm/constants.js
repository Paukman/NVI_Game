const eTransferDataMock = {
  withdrawalAccounts: [
    {
      name: "Basic Account",
      number: "4779",
      currency: "CAD",
      balance: {
        currency: "CAD",
        value: 44993.64
      },
      availableBalance: {
        currency: "CAD",
        value: 44993.65
      },
      type: "Deposit",
      subType: "Chequing",
      status: "30",
      subProductCode: "RETDP_BASIC",
      customerId: "0002471837",
      id: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
    }
  ],
  depositAccounts: [
    {
      recipientId: "CAhGbyStTbMv",
      aliasName:
        "11111111112222222222333333333344444444445555555555666666666677777777778888888888",
      defaultTransferAuthentication: {
        authenticationType: "None",
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
    },
    {
      recipientId: "CAuTRu9eXMwp",
      aliasName: "Aaaron A (Ash)",
      defaultTransferAuthentication: {
        authenticationType: "None",
        question: "Question",
        hashType: "SHA2"
      },
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "faketesting@atb.com",
          isActive: true
        }
      ]
    },
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
    },
    {
      recipientId: "CAe2Pmv4tz3B",
      aliasName: "abc",
      defaultTransferAuthentication: {
        authenticationType: "Contact Level Security",
        question: "test",
        hashType: "SHA0"
      },
      notificationPreference: [
        {
          notificationHandleType: "Email",
          notificationHandle: "def@atb.com",
          isActive: true
        }
      ]
    }
  ],
  interacLimits: {
    limits: {
      limitsGroupId: "",
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
        total24HrAmount: 4900,
        total7DayAmount: 9950,
        total30DayAmount: 14975
      }
    }
  }
};

module.exports = {
  eTransferDataMock
};
