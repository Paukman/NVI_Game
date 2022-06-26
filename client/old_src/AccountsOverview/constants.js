export const testAccounts = [
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
    id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
    quickActions: {
      contribute: false,
      etransfer: true,
      makeBillPayment: false,
      makePayment: false,
      payBill: true,
      transferFrom: true
    }
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
    id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: false,
      makePayment: false,
      payBill: false,
      transferFrom: false
    }
  },
  {
    name: "CIC",
    number: "9200",
    bankAccount: {
      country: "CA",
      routingId: "021908559",
      accountId: "0000039433279200"
    },
    currency: "CAD",
    balance: { currency: "CAD", value: 2000 },
    availableBalance: { currency: "CAD", value: 2000 },
    type: "Investment",
    status: "30",
    subProductCode: "RETFD_CIC",
    customerId: "0002764745",
    id: "QDmDXee-TPqxNtTHu57V1j8tuTn-qfDWT85KzCWdZgA",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: false,
      makePayment: false,
      payBill: false,
      transferFrom: false
    }
  },
  {
    name: "Tax-Free Saver Account",
    number: "4800",
    bankAccount: {
      country: "CA",
      routingId: "021908559",
      accountId: "0000039433374800"
    },
    currency: "CAD",
    balance: { currency: "CAD", value: 10002.95 },
    availableBalance: { currency: "CAD", value: 10002.95 },
    type: "Investment",
    subTypeV1: "TFSA",
    status: "30",
    subProductCode: "RETRP_TFSA_SAVING",
    customerId: "0002764745",
    id: "QDmDXee-TPqxNtTHu57V1s_ENKWMFSEqGMTV8QJrb_M",
    quickActions: {
      contribute: true,
      etransfer: false,
      makeBillPayment: false,
      makePayment: false,
      payBill: false,
      transferFrom: false
    }
  },
  {
    name: "Residential Mortgage Loan",
    number: "9700",
    bankAccount: {
      country: "CA",
      routingId: "021908559",
      accountId: "0000039432959700"
    },
    currency: "CAD",
    balance: { currency: "CAD", value: 489478 },
    availableBalance: { currency: "CAD", value: 0 },
    type: "Loan",
    openCloseIndicator: "Open",
    status: "30",
    subProductCode: "RETLO_MRTG_RML",
    customerId: "0002764745",
    id: "QDmDXee-TPqxNtTHu57V1jIo98AACUYy6kku9iEzRZA",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: false,
      makePayment: true,
      payBill: false,
      transferFrom: false
    }
  },
  {
    name: "TPPL Unsecured and Cash Secured",
    number: "3800",
    bankAccount: {
      country: "CA",
      routingId: "021908559",
      accountId: "0000039432693800"
    },
    currency: "CAD",
    balance: { currency: "CAD", value: 47572.12 },
    availableBalance: { currency: "CAD", value: 0 },
    type: "Loan",
    openCloseIndicator: "Open",
    status: "30",
    subProductCode: "RETLO_TPPL",
    customerId: "0002764745",
    id: "QDmDXee-TPqxNtTHu57V1so7MkUeXH1PllToH_Q-DPs",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: false,
      makePayment: true,
      payBill: false,
      transferFrom: false
    }
  },
  {
    subProductCode: "CARD_MCACC",
    partialCreditCardNumber: "543997******4696",
    creditCardNumber: "5439971004744696",
    name: "Gold My Rewards Mastercard",
    nickname: null,
    number: "4696",
    id: "6x-FZCO-1jyA3N9qiFhiwodcQMLAsDkpMTinJduqti0",
    currency: "CAD",
    balance: { currency: "CAD", value: 0 },
    availableBalance: { currency: "CAD", value: 20000 },
    type: "CreditCard",
    status: "Effective",
    customerId: "0002764745",
    billPayeeKey: "701bdd7e22abe98646fe4a8e2ad983c6",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: true,
      makePayment: false,
      payBill: false,
      transferFrom: false
    }
  },
  {
    subProductCode: "CARD_MCACC",
    partialCreditCardNumber: "524582******6017",
    creditCardNumber: "5245828000146017",
    name: "US Dollar Mastercard",
    nickname: null,
    number: "6017",
    id: "S8IibYWjA0YWxnecNmiN3lm-uHmqnXgMAQtzj8iX2eg",
    currency: "USD",
    balance: { currency: "USD", value: 0 },
    availableBalance: { currency: "USD", value: 20000 },
    type: "CreditCard",
    status: "Effective",
    customerId: "0002764745",
    billPayeeKey: "7cf0da480b06ab84f6b55a0b070aaeb6",
    quickActions: {
      contribute: false,
      etransfer: false,
      makeBillPayment: true,
      makePayment: false,
      payBill: false,
      transferFrom: false
    }
  }
];

export const testTotals = {
  deposit: {
    CAD: 98964.51
  },
  investment: {
    CAD: 12002.95
  },
  loan: {
    CAD: 537050.12
  },
  prepaidCard: {
    CAD: 0
  },
  creditCard: {
    CAD: 40000
  }
};
