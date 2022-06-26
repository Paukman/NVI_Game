import dayjs from "dayjs";
import { isNil, isNumber, pickBy } from "lodash";
import {
  formatCurrency,
  formatPercentage,
  formatTermDate,
  insertDecimal,
  convertTermToDate
} from "utils";

const filterEmptyTables = tables => pickBy(tables, ({ data }) => data.length);

const mapDepositTables = additionalValues => {
  if (isNumber(additionalValues?.interestPercentageRate)) {
    return {
      leftTable: {
        title: "Account details",
        data: [
          {
            label: "Interest rate",
            value: formatPercentage(additionalValues.interestPercentageRate)
          }
        ]
      }
    };
  }
  return {};
};

const formatCreditCardRewards = ({ rewardsBalance, rewardsType }) => {
  let value = insertDecimal(rewardsBalance);
  if (rewardsType === "Cash") {
    return `$${value}`;
  }
  value = value.substring(0, value.indexOf("."));
  return `${value} point${value === "1" ? "" : "s"}`;
};

const mapCreditCardTables = ({
  lastStatementDate,
  nextStatementDate,
  lastStatementBalance,
  paymentDueDate,
  minimumPaymentAmount,
  lastPaymentAmount,
  creditLimit,
  rewardsBalance,
  rewardsType
}) => {
  const leftData = [
    {
      label: "Period",
      value:
        lastStatementDate && nextStatementDate
          ? `${dayjs(lastStatementDate).format("MMM DD")} to ${dayjs(
              nextStatementDate
            ).format("MMM DD")}`
          : "None"
    },
    {
      label: "Statement balance",
      value: formatCurrency(lastStatementBalance.value)
    },
    {
      label: "Payment due date",
      value: isNil(paymentDueDate)
        ? "None"
        : dayjs(paymentDueDate).format("MMM DD, YYYY")
    },
    {
      label: "Minimum payment required",
      value: formatCurrency(minimumPaymentAmount.value)
    },
    {
      label: "Last payment amount",
      value: formatCurrency(lastPaymentAmount.value)
    }
  ];

  const rightData = [];

  if (creditLimit) {
    rightData.push({
      label: "Credit limit",
      value: formatCurrency(creditLimit.value)
    });
  }
  if (!isNil(rewardsBalance)) {
    rightData.push({
      label: "Rewards balance",
      value: formatCreditCardRewards({ rewardsBalance, rewardsType })
    });
  }

  const tables = {
    leftTable: { title: "Statement details", data: leftData },
    rightTable: { title: "Account details", data: rightData }
  };
  return filterEmptyTables(tables);
};

const mapInvestmentTables = ({
  accruedInterest,
  interestPercentageRate,
  nextInterestPayDate,
  maturityDate
}) => {
  const leftData = [
    {
      label: "Interest accrued",
      value: formatCurrency(accruedInterest.value)
    }
  ];
  if (isNumber(interestPercentageRate)) {
    leftData.unshift({
      label: "Interest rate",
      value: formatPercentage(interestPercentageRate)
    });
  }

  const rightData = [
    {
      label: "Next interest paid",
      value: dayjs(nextInterestPayDate).format("MMM DD, YYYY")
    }
  ];
  if (maturityDate) {
    rightData.push({
      label: "Maturity date",
      value: dayjs(maturityDate).format("MMM DD, YYYY")
    });
  }

  const tables = {
    leftTable: { title: "Statement details", data: leftData },
    rightTable: { data: rightData }
  };
  return filterEmptyTables(tables);
};

const loanFormatters = {
  interestRate: ({ interestPercentageRate, rateType }) => {
    const formattedRateType = rateType
      ? ` ${rateType.split(" ")[0].toLowerCase()}`
      : "";
    return {
      label: "Interest rate",
      value: `${formatPercentage(
        interestPercentageRate,
        3
      )}${formattedRateType}`
    };
  },
  maturityDate: ({
    loanType,
    maturityDate,
    renewalDate,
    term,
    remainingAmortization
  }) => {
    const isAmortizationDateAfterTermDate = () => {
      const amortizationDate = dayjs(convertTermToDate(remainingAmortization));
      const termDate = dayjs(convertTermToDate(term));
      return amortizationDate.isAfter(termDate);
    };

    const getMortgageLabel = () => {
      return isAmortizationDateAfterTermDate()
        ? "Renewal date"
        : "Term expiry date";
    };

    const getRenwalOrExpiryDate = () => {
      return isAmortizationDateAfterTermDate() ? renewalDate : maturityDate;
    };

    const label =
      loanType === "Mortgage" ? getMortgageLabel() : "Term expiry date";

    const value =
      loanType === "Mortgage"
        ? dayjs(getRenwalOrExpiryDate()).format("MMM DD, YYYY")
        : dayjs(maturityDate).format("MMM DD, YYYY");

    return {
      label,
      value
    };
  }
};

const mapDefaultLoanData = additionalValues => {
  const {
    accruedInterest,
    interestPercentageRate,
    maturityDate,
    nextPaymentAmount,
    nextPaymentDate,
    term
  } = additionalValues;

  const leftData = [];
  if (nextPaymentAmount) {
    leftData.push({
      label: "Payment amount",
      value: formatCurrency(nextPaymentAmount.value)
    });
  }
  if (nextPaymentDate) {
    leftData.push({
      label: "Next payment date",
      value: dayjs(nextPaymentDate).format("MMM DD, YYYY")
    });
  }

  const rightData = [];
  if (isNumber(interestPercentageRate)) {
    rightData.push(loanFormatters.interestRate(additionalValues));
  }
  if (accruedInterest) {
    rightData.push({
      label: "Interest accrued",
      value: formatCurrency(accruedInterest.value)
    });
  }
  if (term) {
    rightData.push({
      label: "Term",
      value: formatTermDate(term)
    });
  }
  if (maturityDate) {
    rightData.push(loanFormatters.maturityDate(additionalValues));
  }
  return { leftData, rightData };
};

const mapLineOfCreditData = ({
  nextPaymentAmount,
  nextPaymentDate,
  authorizedBalance,
  interestPercentageRate
}) => {
  const leftData = [];
  if (nextPaymentAmount) {
    leftData.push({
      label: "Interest due",
      value: formatCurrency(nextPaymentAmount.value)
    });
  }
  if (nextPaymentDate) {
    leftData.push({
      label: "Interest due date",
      value: dayjs(nextPaymentDate).format("MMM DD, YYYY")
    });
  }

  const rightData = [];
  if (authorizedBalance) {
    rightData.push({
      label: "Authorized balance",
      value: formatCurrency(authorizedBalance.value)
    });
  }
  if (interestPercentageRate) {
    rightData.push({
      label: "Interest rate",
      value: formatPercentage(interestPercentageRate, 3)
    });
  }

  return { leftData, rightData };
};

const mapMortgageData = additionalValues => {
  const {
    disabilityInsuranceIndicator,
    lifeInsuranceIndicator,
    loanProtectionAmount,
    openCloseIndicator,
    pastDueIndicator,
    paymentPeriod,
    remainingAmortization
  } = additionalValues;

  const { leftData, rightData } = mapDefaultLoanData(additionalValues);

  if (paymentPeriod) {
    leftData.push({
      label: "Payment frequency",
      value: paymentPeriod
    });
  }
  leftData.push({
    label: "Past due",
    value: pastDueIndicator
  });

  rightData.push({
    label: "Remaining amortization",
    value: formatTermDate(remainingAmortization)
  });
  rightData.push({
    label: "Loan type",
    value: openCloseIndicator === "Open" ? "Open" : "Closed"
  });
  rightData.push({
    label: "Life insurance",
    value: lifeInsuranceIndicator
  });
  if (loanProtectionAmount) {
    rightData.push({
      label: "Loan protection amount",
      value: formatCurrency(loanProtectionAmount.value)
    });
  }
  rightData.push({
    label: "Disability insurance",
    value: disabilityInsuranceIndicator
  });

  return { leftData, rightData };
};

const getLoanTableData = additionalValues => {
  switch (additionalValues.loanType) {
    case "RLOC":
      return mapLineOfCreditData(additionalValues);
    case "Mortgage":
      return mapMortgageData(additionalValues);
    default:
      return mapDefaultLoanData(additionalValues);
  }
};

const mapLoanTables = additionalValues => {
  const { leftData, rightData } = getLoanTableData(additionalValues);

  const tables = {
    leftTable: { title: "Payment details", data: leftData },
    rightTable: { title: "Account details", data: rightData }
  };
  return filterEmptyTables(tables);
};

const getLoanSubType = ({ loanType }) => {
  const loanSubTypeMap = {
    RLOC: "Line of credit",
    Mortgage: "Mortgage"
  };

  return loanSubTypeMap[loanType] || "Loan";
};

const getBalance = (balance, label = "Current balance") => ({
  label,
  amount: {
    currency: balance?.currency || "",
    value: balance?.value || 0
  }
});

export const mapAccountDetails = ({
  type,
  subType,
  subTypeV1,
  name,
  nickname,
  number,
  balance,
  availableBalance,
  additionalValues,
  quickActions,
  bankAccount,
  creditCardNumber,
  currency
}) => {
  const mappedDetails = {
    account: {
      type,
      subType,
      name,
      nickname,
      number,
      currency,
      bankAccount,
      creditCardNumber
    },
    balance: getBalance(balance, "Current balance"),
    availableBalance: getBalance(availableBalance, "Available balance"),
    quickActions
  };

  switch (type) {
    case "Deposit": {
      return {
        ...mappedDetails,
        ...mapDepositTables(additionalValues)
      };
    }
    case "CreditCard": {
      if (subTypeV1 === "PrepaidMastercard") {
        mappedDetails.account.subType = "Mastercard";
        mappedDetails.availableBalance.label = "Available balance";
        return {
          ...mappedDetails
        };
      }
      mappedDetails.account.subType = "Mastercard";
      mappedDetails.availableBalance.label = "Available credit";
      return {
        ...mappedDetails,
        ...mapCreditCardTables(additionalValues)
      };
    }
    case "Investment": {
      mappedDetails.balance.label = "Value";
      mappedDetails.availableBalance = undefined;
      return {
        ...mappedDetails,
        ...mapInvestmentTables(additionalValues)
      };
    }
    case "Loan": {
      mappedDetails.account.subType = getLoanSubType(additionalValues);
      mappedDetails.balance.label = "Principal balance";
      return {
        ...mappedDetails,
        ...mapLoanTables(additionalValues)
      };
    }
    default: {
      return mappedDetails;
    }
  }
};
