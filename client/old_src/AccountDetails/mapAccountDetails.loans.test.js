import { mapAccountDetails } from "./mapAccountDetails";

const getLoanAccountDetails = (loanType = "Term Loan") => ({
  additionalValues: {
    disabilityInsuranceIndicator: "No",
    lifeInsuranceIndicator: "No",
    loanType,
    openCloseIndicator: "Open",
    pastDueIndicator: "No",
    remainingAmortization: "291 Months",
    renewalDate: "2030-03-19"
  },
  bankAccount: {
    country: "CA",
    routingId: "021908859",
    accountId: "0000034849879200"
  },
  name: "TPPL Unsecured and Cash Secured",
  number: "34849879200",
  routingId: "021908859",
  currency: "CAD",
  balance: { currency: "CAD", value: 0 },
  availableBalance: { currency: "CAD", value: 500000 },
  type: "Loan",
  id: "33ZFwIxk3ZebPZZx1bDHjzqmHZ7TMHptovQuocwXD94",
  quickActions: {
    transferFrom: true,
    payBill: false,
    etransfer: false,
    makePayment: true,
    contribute: false,
    makeBillPayment: false
  }
});

const expectedLoan = {
  account: {
    name: "TPPL Unsecured and Cash Secured",
    nickname: undefined,
    number: "34849879200",
    type: "Loan",
    subType: "Loan",
    currency: "CAD",
    bankAccount: {
      country: "CA",
      routingId: "021908859",
      accountId: "0000034849879200"
    }
  },
  availableBalance: {
    amount: {
      currency: "CAD",
      value: 500000
    },
    label: "Available balance"
  },
  balance: {
    amount: {
      currency: "CAD",
      value: 0
    },
    label: "Principal balance"
  },
  quickActions: {
    transferFrom: true,
    payBill: false,
    etransfer: false,
    makePayment: true,
    contribute: false,
    makeBillPayment: false
  }
};

const expectedMortgageTables = {
  leftTable: {
    title: "Payment details",
    data: [{ label: "Past due", value: "No" }]
  },
  rightTable: {
    title: "Account details",
    data: [
      {
        label: "Remaining amortization",
        value: "24yr 3mo"
      },
      {
        label: "Loan type",
        value: "Open"
      },
      {
        label: "Life insurance",
        value: "No"
      },
      {
        label: "Disability insurance",
        value: "No"
      }
    ]
  }
};

describe("mapAccountDetails loan accounts", () => {
  it(">> Should set loan subType when subType is Mortgage or Line of credit", () => {
    const loanDetails = getLoanAccountDetails();
    const undefinedSubType = mapAccountDetails(loanDetails);
    expect(undefinedSubType.account.subType).toBe("Loan");

    loanDetails.additionalValues.loanType = "RLOC";
    const lineOfCredit = mapAccountDetails(loanDetails);
    expect(lineOfCredit.account.subType).toBe("Line of credit");

    loanDetails.additionalValues.loanType = "Mortgage";
    const mortgage = mapAccountDetails(loanDetails);
    expect(mortgage.account.subType).toBe("Mortgage");

    loanDetails.additionalValues.loanType = "Other valid loan type";
    const otherSubType = mapAccountDetails(loanDetails);
    expect(otherSubType.account.subType).toBe("Loan");
  });

  it(">> Should show a left table if leftTable contains data", () => {
    const loanDetails = getLoanAccountDetails();
    loanDetails.additionalValues.nextPaymentAmount = {
      currency: "CAD",
      value: 1998.56
    };
    loanDetails.additionalValues.nextPaymentDate = "2020-01-01";

    const { leftTable } = mapAccountDetails(loanDetails);
    expect(leftTable.title).toEqual("Payment details");
    expect(leftTable.data.length).toBe(2);
  });

  it(">> Should show a right table if rightTable contains data", () => {
    const loanDetails = getLoanAccountDetails();
    loanDetails.additionalValues.term = "300 Months";

    const { rightTable } = mapAccountDetails(loanDetails);
    expect(rightTable.title).toEqual("Account details");
    expect(rightTable.data.length).toBe(1);
  });

  describe("Map default loan accounts", () => {
    it(">> Should map default loan details", () => {
      const loanDetails = mapAccountDetails(getLoanAccountDetails());
      expect(loanDetails).toEqual(expectedLoan);
      expect(loanDetails.leftTable).toBeUndefined();
      expect(loanDetails.rightTable).toBeUndefined();
    });

    it(">> Should show loan payment amount if it is defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.nextPaymentAmount = {
        currency: "CAD",
        value: 1998.56
      };

      const paymentAmount = {
        label: "Payment amount",
        value: "$1,998.56"
      };
      const { leftTable } = mapAccountDetails(loanDetails);
      expect(leftTable.data).toContainEqual(paymentAmount);
    });

    it(">> Should show loan payment date if it is defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.nextPaymentDate = "2020-01-01";

      const paymentDate = {
        label: "Next payment date",
        value: "Jan 01, 2020"
      };
      const { leftTable } = mapAccountDetails(loanDetails);
      expect(leftTable.data).toContainEqual(paymentDate);
    });

    it(">> Should show loan interest rate if it is a number", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.interestPercentageRate = 3.74;

      const interestRate = {
        label: "Interest rate",
        value: "3.740%"
      };
      const { rightTable } = mapAccountDetails(loanDetails);
      expect(rightTable.data).toContainEqual(interestRate);
    });

    it(">> Should show loan interest rate type if it is a defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.interestPercentageRate = 3.74;
      loanDetails.additionalValues.rateType = "Fixed rate";

      const interestRate = {
        label: "Interest rate",
        value: "3.740% fixed"
      };
      const { rightTable } = mapAccountDetails(loanDetails);
      expect(rightTable.data).toContainEqual(interestRate);
    });

    it(">> Should show loan interest accured if it is a defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.accruedInterest = { value: 389.22 };

      const interestAccured = {
        label: "Interest accrued",
        value: "$389.22"
      };
      const { rightTable } = mapAccountDetails(loanDetails);
      expect(rightTable.data).toContainEqual(interestAccured);
    });

    it(">> Should show loan term if it is defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.term = "11 Years";

      const term = {
        label: "Term",
        value: "11 years"
      };
      const { rightTable } = mapAccountDetails(loanDetails);
      expect(rightTable.data).toContainEqual(term);
    });

    it(">> Should show loan maturity date if it is defined", () => {
      const loanDetails = getLoanAccountDetails();
      loanDetails.additionalValues.maturityDate = "2024-03-19T10:00:00.000";

      const maturityDate = { label: "Term expiry date", value: "Mar 19, 2024" };
      const { rightTable } = mapAccountDetails(loanDetails);
      expect(rightTable.data).toContainEqual(maturityDate);
    });
  });

  describe("Map line of credit loan accounts", () => {
    it(">> Should map LOC details", () => {
      const lineOfCreditDetails = getLoanAccountDetails("RLOC");
      const { leftTable, rightTable } = mapAccountDetails(lineOfCreditDetails);
      expect(leftTable).toBeUndefined();
      expect(rightTable).toBeUndefined();
    });

    it(">> Should show LOC interest due if it is defined", () => {
      const loanDetails = getLoanAccountDetails("RLOC");
      loanDetails.additionalValues.nextPaymentAmount = {
        currency: "CAD",
        value: 1998.56
      };

      const interestAmount = {
        label: "Interest due",
        value: "$1,998.56"
      };
      const { leftTable } = mapAccountDetails(loanDetails);
      expect(leftTable.data).toContainEqual(interestAmount);
    });

    it(">> Should show LOC interest due date if it is defined", () => {
      const loanDetails = getLoanAccountDetails("RLOC");
      loanDetails.additionalValues.nextPaymentDate = "2020-01-01";

      const interestDate = {
        label: "Interest due date",
        value: "Jan 01, 2020"
      };
      const { leftTable } = mapAccountDetails(loanDetails);
      expect(leftTable.data).toContainEqual(interestDate);
    });

    it(">> Should show authorized balance if it is defined", () => {
      const lineOfCreditDetails = getLoanAccountDetails("RLOC");
      lineOfCreditDetails.additionalValues.authorizedBalance = {
        value: 50000
      };

      const authorizedBalance = {
        label: "Authorized balance",
        value: "$50,000.00"
      };
      const { rightTable } = mapAccountDetails(lineOfCreditDetails);
      expect(rightTable.data).toContainEqual(authorizedBalance);
    });

    it(">> Should show interest rate if it is defined", () => {
      const lineOfCreditDetails = getLoanAccountDetails("RLOC");
      lineOfCreditDetails.additionalValues.interestPercentageRate = 4.725;

      const interestRate = {
        label: "Interest rate",
        value: "4.725%"
      };
      const { rightTable } = mapAccountDetails(lineOfCreditDetails);
      expect(rightTable.data).toContainEqual(interestRate);
    });
  });
  describe("Map mortgage loan accounts", () => {
    it(">> Should map default mortgage details", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");

      const { leftTable, rightTable } = mapAccountDetails(mortgageDetails);
      expect(leftTable).toEqual(expectedMortgageTables.leftTable);
      expect(rightTable).toEqual(expectedMortgageTables.rightTable);
    });

    it(">> Should show Payment frequency when it is defined", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.paymentPeriod = "Monthly";

      const paymentPeriod = {
        label: "Payment frequency",
        value: "Monthly"
      };

      const { leftTable } = mapAccountDetails(mortgageDetails);
      expect(leftTable.data).toContainEqual(paymentPeriod);
    });

    it(">> Should use Renewal date instead of maturityDate if amortization is greater than term", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.term = "99 Months";
      mortgageDetails.additionalValues.remainingAmortization = "100 Months";
      mortgageDetails.additionalValues.maturityDate = "2050-03-19";

      const renewalDate = {
        label: "Renewal date",
        value: "Mar 19, 2030"
      };
      const { rightTable } = mapAccountDetails(mortgageDetails);
      expect(rightTable.data).toContainEqual(renewalDate);
    });

    it(">> Should use Renewal date instead of maturityDate if term is undefined", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.remainingAmortization = "100 Months";
      mortgageDetails.additionalValues.maturityDate = "2050-03-19";

      const renewalDate = {
        label: "Renewal date",
        value: "Mar 19, 2030"
      };
      const { rightTable } = mapAccountDetails(mortgageDetails);
      expect(rightTable.data).toContainEqual(renewalDate);
    });

    it(">> Should use Term expiry date for maturityDate label if amortization is not greater than term", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.term = "100 Months";
      mortgageDetails.additionalValues.remainingAmortization = "100 Months";
      mortgageDetails.additionalValues.maturityDate = "2025-03-19";

      const maturityDate = {
        label: "Term expiry date",
        value: "Mar 19, 2025"
      };

      const { rightTable } = mapAccountDetails(mortgageDetails);
      expect(rightTable.data).toContainEqual(maturityDate);
    });

    it(">> Should show loan protection when it is defined", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.loanProtectionAmount = { value: 10000 };

      const protectionAmount = {
        label: "Loan protection amount",
        value: "$10,000.00"
      };

      const { rightTable } = mapAccountDetails(mortgageDetails);
      expect(rightTable.data).toContainEqual(protectionAmount);
    });

    it(">> Should show 'Closed' as loan type when openCloseIndicator = 'Close'", () => {
      const mortgageDetails = getLoanAccountDetails("Mortgage");
      mortgageDetails.additionalValues.openCloseIndicator = "Close";

      const loanType = {
        label: "Loan type",
        value: "Closed"
      };

      const { rightTable } = mapAccountDetails(mortgageDetails);
      expect(rightTable.data).toContainEqual(loanType);
    });
  });
});
