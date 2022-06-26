import { mapAccountDetails } from "./mapAccountDetails";

const getDepositAccountDetails = () => ({
  additionalValues: {},
  bankAccount: {
    country: "CA",
    routingId: "021908859",
    accountId: "0000000360587679"
  },
  name: "No-Fee All-In Account",
  nickname: "My Account Nickname",
  number: "00360587679",
  routingId: "021908859",
  currency: "CAD",
  balance: { currency: "CAD", value: 48749.15 },
  availableBalance: { currency: "CAD", value: 98749.15 },
  type: "Deposit",
  subType: "Chequing",
  id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
  quickActions: {
    contribute: false,
    etransfer: true,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
});

const expectedDeposit = {
  account: {
    name: "No-Fee All-In Account",
    nickname: "My Account Nickname",
    type: "Deposit",
    subType: "Chequing",
    number: "00360587679",
    currency: "CAD",
    bankAccount: {
      country: "CA",
      routingId: "021908859",
      accountId: "0000000360587679"
    }
  },
  balance: {
    amount: {
      currency: "CAD",
      value: 48749.15
    },
    label: "Current balance"
  },
  availableBalance: {
    amount: {
      currency: "CAD",
      value: 98749.15
    },
    label: "Available balance"
  },
  quickActions: {
    contribute: false,
    etransfer: true,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
};

const getCCAccountDetails = () => ({
  id: "6x-FZCO-1jyA3N9qiFhiwjrIndJDyIHi8W5xSiHQuMM",
  nickname: null,
  number: "543997******9406",
  creditCardNumber: "5439971234569406",
  name: "Gold Cash Rewards Mastercard",
  currency: "CAD",
  balance: { currency: "CAD", value: 0 },
  availableBalance: { currency: "CAD", value: 9000 },
  type: "CreditCard",
  startDate: "2019-03-19",
  additionalValues: {
    lastStatementBalance: { currency: "CAD", value: 0 },
    minimumPaymentAmount: { currency: "CAD", value: 0 },
    paymentDueDate: "2020-08-09",
    lastPaymentAmount: { currency: "CAD", value: 0 },
    lastPaymentDate: null
  },
  quickActions: {
    contribute: false,
    etransfer: false,
    makeBillPayment: true,
    makePayment: false,
    payBill: false,
    transferFrom: false
  }
});

const expectedCreditCard = {
  account: {
    name: "Gold Cash Rewards Mastercard",
    number: "543997******9406",
    nickname: null,
    type: "CreditCard",
    subType: "Mastercard",
    currency: "CAD",
    creditCardNumber: "5439971234569406"
  },
  availableBalance: {
    amount: {
      currency: "CAD",
      value: 9000
    },
    label: "Available credit"
  },
  balance: {
    amount: {
      currency: "CAD",
      value: 0
    },
    label: "Current balance"
  },
  leftTable: {
    title: "Statement details",
    data: [
      {
        label: "Period",
        value: "None"
      },
      {
        label: "Statement balance",
        value: "$0.00"
      },
      {
        label: "Payment due date",
        value: "Aug 09, 2020"
      },
      {
        label: "Minimum payment required",
        value: "$0.00"
      },
      {
        label: "Last payment amount",
        value: "$0.00"
      }
    ]
  },
  quickActions: {
    contribute: false,
    etransfer: false,
    makeBillPayment: true,
    makePayment: false,
    payBill: false,
    transferFrom: false
  }
};

const getPrepaidCardAccountDetails = () => ({
  id: "udFnGHQ1Exmg7NZjZv-ydraKPfGB8gxYNRV4P83iofc",
  nickname: null,
  number: "522002******9492",
  creditCardNumber: "5220029042089492",
  name: "ATB Load & Go Mastercard",
  currency: "CAD",
  balance: { currency: "CAD", value: 2088.39 },
  availableBalance: { currency: "CAD", value: 2088 },
  type: "CreditCard",
  subTypeV1: "PrepaidMastercard",
  startDate: "2021-03-12",
  additionalValues: {
    lastStatementBalance: { currency: "CAD", value: -2088.39 },
    minimumPaymentAmount: { currency: "CAD", value: 0 },
    paymentDueDate: "2021-05-31",
    lastPaymentAmount: { currency: "CAD", value: 1500 },
    lastPaymentDate: "2021-04-16"
  },
  quickActions: {
    contribute: false,
    etransfer: false,
    makeBillPayment: true,
    makePayment: false,
    payBill: false,
    transferFrom: false
  }
});

const expectedPrepaidCard = {
  account: {
    name: "ATB Load & Go Mastercard",
    number: "522002******9492",
    nickname: null,
    type: "CreditCard",
    subType: "Mastercard",
    currency: "CAD",
    creditCardNumber: "5220029042089492"
  },
  availableBalance: {
    amount: {
      currency: "CAD",
      value: 2088
    },
    label: "Available balance"
  },
  balance: {
    amount: {
      currency: "CAD",
      value: 2088.39
    },
    label: "Current balance"
  },
  quickActions: {
    contribute: false,
    etransfer: false,
    makeBillPayment: true,
    makePayment: false,
    payBill: false,
    transferFrom: false
  }
};

const getInvestmentAccountDetails = () => ({
  additionalValues: {
    nextInterestPayDate: "2020-03-20T06:00:00.000",
    accruedInterest: { currency: "USD", value: 0.94 }
  },
  bankAccount: {
    country: "CA",
    routingId: "021908859",
    accountId: "0000034868695500"
  },
  name: "US Dollar GIC",
  number: "34868695500",
  routingId: "021908859",
  currency: "USD",
  balance: { currency: "USD", value: 1500 },
  type: "Investment",
  id: "33ZFwIxk3ZebPZZx1bDHj0ROmns5hmKP3ujclo4W2oU",
  quickActions: {
    contribute: true,
    etransfer: false,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
});

const expectedInvestment = {
  account: {
    name: "US Dollar GIC",
    nickname: undefined,
    number: "34868695500",
    type: "Investment",
    subType: undefined,
    currency: "USD",
    bankAccount: {
      country: "CA",
      routingId: "021908859",
      accountId: "0000034868695500"
    }
  },
  balance: {
    amount: {
      currency: "USD",
      value: 1500
    },
    label: "Value"
  },
  leftTable: {
    title: "Statement details",
    data: [
      {
        label: "Interest accrued",
        value: "$0.94"
      }
    ]
  },
  rightTable: {
    data: [
      {
        label: "Next interest paid",
        value: "Mar 20, 2020"
      }
    ]
  },
  quickActions: {
    contribute: true,
    etransfer: false,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
};

const getUnknownDetails = () => ({
  id: "not-known-010203",
  name: "Not Known Account",
  nickname: "My Unknown Nickname",
  number: "1122334455",
  balance: { currency: "CAD", value: 222.22 },
  availableBalance: { currency: "CAD", value: 111.11 },
  type: "Unknown",
  subType: "Unknown Subtype",
  quickActions: {
    contribute: false,
    etransfer: true,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
});

const expectedUnknown = {
  account: {
    name: "Not Known Account",
    nickname: "My Unknown Nickname",
    number: "1122334455",
    type: "Unknown",
    subType: "Unknown Subtype"
  },
  availableBalance: {
    amount: {
      currency: "CAD",
      value: 111.11
    },
    label: "Available balance"
  },
  balance: {
    amount: {
      currency: "CAD",
      value: 222.22
    },
    label: "Current balance"
  },
  quickActions: {
    contribute: false,
    etransfer: true,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
};

describe("mapAccountDetails", () => {
  it(">> Should return quickAction", () => {
    const detailsWithQuickActions = {
      quickActions: {
        contribute: false,
        etransfer: true,
        makeBillPayment: false,
        makePayment: false,
        payBill: true,
        transferFrom: true
      }
    };

    let mappedDetails = mapAccountDetails({
      ...getCCAccountDetails(),
      ...detailsWithQuickActions
    });
    expect(mappedDetails).toEqual(
      expect.objectContaining(detailsWithQuickActions)
    );

    mappedDetails = mapAccountDetails({
      ...getDepositAccountDetails(),
      ...detailsWithQuickActions
    });
    expect(mappedDetails).toEqual(
      expect.objectContaining(detailsWithQuickActions)
    );

    mappedDetails = mapAccountDetails({
      ...getInvestmentAccountDetails(),
      ...detailsWithQuickActions
    });
    expect(mappedDetails).toEqual(
      expect.objectContaining(detailsWithQuickActions)
    );

    mappedDetails = mapAccountDetails({
      ...getUnknownDetails(),
      ...detailsWithQuickActions
    });
    expect(mappedDetails).toEqual(
      expect.objectContaining(detailsWithQuickActions)
    );
  });

  describe("Map deposit accounts", () => {
    it(">> Should map deposit details", () => {
      const depositDetails = mapAccountDetails(getDepositAccountDetails());
      expect(depositDetails).toEqual(expectedDeposit);
    });

    it(">> Should map a deposit interest rate when is defined", () => {
      const depositDetails = getDepositAccountDetails();
      depositDetails.additionalValues.interestPercentageRate = 12.92;

      const { leftTable, rightTable } = mapAccountDetails(depositDetails);
      expect(leftTable).toEqual({
        title: "Account details",
        data: [
          {
            label: "Interest rate",
            value: "12.92%"
          }
        ]
      });
      expect(rightTable).toBeUndefined();
    });
  });

  describe("Map credit card accounts", () => {
    it(">> Should map credit card details", () => {
      const ccAccountDetails = mapAccountDetails(getCCAccountDetails());
      expect(ccAccountDetails).toEqual(expectedCreditCard);
      expect(ccAccountDetails.rightTable).toBeUndefined();
    });

    it(">> Should map prepaid card details", () => {
      const prepaidAccountDetails = mapAccountDetails(
        getPrepaidCardAccountDetails()
      );
      expect(prepaidAccountDetails).toEqual(expectedPrepaidCard);
      expect(prepaidAccountDetails.leftTable).toBeUndefined();
      expect(prepaidAccountDetails.rightTable).toBeUndefined();
    });

    it(">> Should show a right table if rightTable contains data", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.creditLimit = {
        currency: "CAD",
        value: 1000
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.title).toEqual("Account details");
      expect(rightTable.data.length).toBe(1);
    });

    it(">> Should show None for no payment due date", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.paymentDueDate = null;

      const dueDate = {
        label: "Payment due date",
        value: "None"
      };
      const { leftTable } = mapAccountDetails(ccAccountDetails);
      expect(leftTable.data).toContainEqual(dueDate);
    });

    it(">> Should show period as date range when both next and last statement dates are defined", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.lastStatementDate = "06-29-2022";
      ccAccountDetails.additionalValues.nextStatementDate = "07-28-2022";

      const period = {
        label: "Period",
        value: "Jun 29 to Jul 28"
      };
      const { leftTable } = mapAccountDetails(ccAccountDetails);
      expect(leftTable.data).toContainEqual(period);
    });

    it(">> Should show period as None when next or last statement dates are not both defined", () => {
      const ccAccountDetails = getCCAccountDetails();

      const nonePeriod = {
        label: "Period",
        value: "None"
      };

      ccAccountDetails.additionalValues.nextStatementDate = "07-28-2022";
      const { leftTable: onlyNextDate } = mapAccountDetails(ccAccountDetails);
      expect(onlyNextDate.data).toContainEqual(nonePeriod);

      ccAccountDetails.additionalValues.nextStatementDate = undefined;
      ccAccountDetails.additionalValues.lastStatementDate = "06-29-2022";
      const { leftTable: onlyLastDate } = mapAccountDetails(ccAccountDetails);
      expect(onlyLastDate.data).toContainEqual(nonePeriod);
    });

    it(">> Should map Credit Cards credit limit when defined", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.creditLimit = {
        currency: "CAD",
        value: 1000
      };

      const creditLimit = {
        label: "Credit limit",
        value: "$1,000.00"
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.data).toContainEqual(creditLimit);
    });

    it(">> Should map Credit Cards cash rewards", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.rewardsType = "Cash";
      ccAccountDetails.additionalValues.rewardsBalance = 1000;

      const cashRewards = {
        label: "Rewards balance",
        value: "$10.00"
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.data).toContainEqual(cashRewards);
    });

    it(">> Should map Credit Cards point rewards", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.rewardsType = "Points";
      ccAccountDetails.additionalValues.rewardsBalance = 1000;

      const pointRewards = {
        label: "Rewards balance",
        value: "10 points"
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.data).toContainEqual(pointRewards);
    });

    it(">> Should not pluralize points when there is 1 reward point", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.rewardsType = "Points";
      ccAccountDetails.additionalValues.rewardsBalance = 100;

      const pointRewards = {
        label: "Rewards balance",
        value: "1 point"
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.data).toContainEqual(pointRewards);
    });

    it(">> Should map Credit Cards rewards when balance is 0", () => {
      const ccAccountDetails = getCCAccountDetails();
      ccAccountDetails.additionalValues.rewardsType = "Points";
      ccAccountDetails.additionalValues.rewardsBalance = 0;

      const pointRewards = {
        label: "Rewards balance",
        value: "0 points"
      };
      const { rightTable } = mapAccountDetails(ccAccountDetails);
      expect(rightTable.data).toContainEqual(pointRewards);
    });

    it(">> Should map creditCardNumber and currency into account", () => {
      const ccAccountDetails = getCCAccountDetails();

      const { account } = mapAccountDetails(ccAccountDetails);
      expect(account.creditCardNumber).toBe(ccAccountDetails.creditCardNumber);
      expect(account.currency).toBe(ccAccountDetails.currency);
    });
  });

  describe("Map investment accounts", () => {
    it(">> Should map investment details", () => {
      const investmentDetails = mapAccountDetails(
        getInvestmentAccountDetails()
      );
      expect(investmentDetails).toEqual(expectedInvestment);
    });

    it(">> Should show a right table if rightTable contains data", () => {
      const { rightTable } = mapAccountDetails(getInvestmentAccountDetails());
      expect(rightTable.title).toBeUndefined();
    });

    it(">> Should show Maturity date if it is defined", () => {
      const investmentDetails = getInvestmentAccountDetails();
      investmentDetails.additionalValues.maturityDate = "01-23-2025";

      const maturityDate = {
        label: "Maturity date",
        value: "Jan 23, 2025"
      };
      const { rightTable } = mapAccountDetails(investmentDetails);
      expect(rightTable.data).toContainEqual(maturityDate);
    });

    it(">> Should show investment interest rate if it is defined", () => {
      const investmentDetails = getInvestmentAccountDetails();
      investmentDetails.additionalValues.interestPercentageRate = 3.74;

      const interestRate = {
        label: "Interest rate",
        value: "3.74%"
      };
      const { leftTable } = mapAccountDetails(investmentDetails);
      expect(leftTable.data).toContainEqual(interestRate);
    });
  });
  describe("Map unknown accounts", () => {
    it(">> Should map an unknown account type", () => {
      const unknownAccountDetails = mapAccountDetails(getUnknownDetails());
      expect(unknownAccountDetails).toEqual(expectedUnknown);
    });

    it(">> Should default undefined balance to $0.00", () => {
      const accountDetails = getUnknownDetails();
      accountDetails.balance = undefined;

      const expectedBalance = {
        amount: {
          currency: "",
          value: 0
        },
        label: "Current balance"
      };

      const { balance } = mapAccountDetails(accountDetails);
      expect(balance).toEqual(expectedBalance);
    });
  });
});
