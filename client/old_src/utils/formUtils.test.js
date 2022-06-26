import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { recurringFrequency } from "globalConstants";
import {
  truncate,
  withdrawalAccounts,
  depositAccounts,
  locateDepositSecurity,
  numberFilter,
  unFormatCurrency,
  floatValue,
  setEndDateForTransfer,
  getFormattedAccounts,
  getFormattedAccountsForCurrency,
  getFormattedPayees,
  renderNumOf,
  hasInvalidCharacters,
  restrictNoOfPaymentsRange,
  capitalize,
  getDayWithinPeriod,
  setPeriodFrequency,
  getFrequencyText,
  isValidEmail,
  sanitizeEmail
} from "./formUtils";

dayjs.extend(customParseFormat);

describe("Truncate Util Test", () => {
  it(">> Should render String untouched", () => {
    const unchangedString = truncate("Test User");
    expect(unchangedString).toEqual("Test User");
  });

  it(">> Should truncate string", () => {
    const truncString = truncate("TestingAlongUserNameThatsTooLong");
    expect(truncString).toEqual("TestingAlongUserName...");
  });
});

describe("withdrawalAccounts Util Test", () => {
  const data = {
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
          value: 44993.64
        },
        type: "Deposit",
        subType: "Chequing",
        status: "30",
        subProductCode: "RETDP_BASIC",
        customerId: "0002471837",
        id: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
      }
    ],
    loading: false
  };

  it(">> Should create new From object", () => {
    const newFromObject = withdrawalAccounts(data, 769);
    expect(newFromObject).toEqual([
      {
        text: "Basic Account (4779) | $44,993.64",
        value: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
      }
    ]);
  });
});

describe("withdrawalAccounts Util Test degenerate case", () => {
  const data = { withdrawalAccounts: [] };

  it(">> Should create new From object", () => {
    const newFromObject = withdrawalAccounts(data);
    expect(newFromObject).toEqual([]);
  });
});

describe("withdrawalAccounts Loading state test", () => {
  const data = { withdrawalAccounts: [], loading: true };

  it(">> Should return Loading... text", () => {
    const newFromObject = withdrawalAccounts(data);
    expect(newFromObject).toEqual([
      {
        text: "Loading...",
        value: "Loading",
        disabled: true,
        "data-testid": "loadingto"
      }
    ]);
  });
});

describe("depositAccounts Util Test", () => {
  const toData = {
    depositAccounts: [
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
      }
    ]
  };

  it(">> Should create a new To Object", () => {
    const newToObject = depositAccounts(toData);
    expect(newToObject).toEqual([
      {
        key: "add-recipient",
        text: (
          <div className="dropdown-link" data-testid="add-recipient">
            Add recipient
          </div>
        ),
        value: "add-recipient"
      },
      {
        key: "CAuTRu9eXMwp",
        text: "Aaaron A (Ash) (faketesting@atb.com)",
        value: "CAuTRu9eXMwp"
      }
    ]);
  });
});

describe("depositAccounts Loading state test", () => {
  const data = { depositAccounts: [], loading: true };

  it(">> Should return Loading.. text", () => {
    const newFromObject = depositAccounts(data);
    expect(newFromObject).toEqual([
      {
        key: "add-recipient",
        text: (
          <div className="dropdown-link" data-testid="add-recipient">
            Add recipient
          </div>
        ),
        value: "add-recipient"
      },
      {
        text: "Loading...",
        value: "Loading",
        disabled: true,
        "data-testid": "loadingfrom"
      }
    ]);
  });
});

describe("locatedepositSecurity Util Test", () => {
  let showSecurity = false;
  const setShowSecurity = val => {
    showSecurity = val;
  };

  let securityQuestion = "";
  const setSecurityQuestion = val => {
    securityQuestion = val;
  };

  let showQuestions = false;
  const setShowQuestions = val => {
    showQuestions = val;
  };

  let toRecipient = null;
  const setToRecipient = val => {
    toRecipient = val;
  };

  const data = {
    depositAccounts: [
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
      }
    ]
  };

  const dataToTriggerQuestions = {
    depositAccounts: [
      {
        recipientId: "CAuTRu9eXMwp",
        aliasName: "Aaaron A (Ash)",
        defaultTransferAuthentication: {
          authenticationType: "Contact Level Security",
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
      }
    ]
  };

  it(">> No Value passed", () => {
    const noVal = locateDepositSecurity(
      "",
      setShowSecurity,
      setSecurityQuestion,
      setShowQuestions,
      data,
      setToRecipient
    );
    expect(showSecurity).toEqual(false);
    expect(showQuestions).toEqual(false);
    expect(securityQuestion).toEqual("");
    expect(toRecipient).toEqual(undefined);
    expect(noVal).toEqual(undefined);
  });

  it(">> Val Passed, Show AutoDeposit", () => {
    const valWithQuestions = locateDepositSecurity(
      "CAuTRu9eXMwp",
      setShowSecurity,
      setSecurityQuestion,
      setShowQuestions,
      data,
      setToRecipient
    );
    expect(showSecurity).toEqual(true);
    expect(showQuestions).toEqual(false);
    expect(securityQuestion).toEqual("");
    expect(toRecipient).toBeTruthy();
    expect(valWithQuestions).toEqual(undefined);
  });

  it(">> Val Passed, Show Security Question", () => {
    const valWithQuestions = locateDepositSecurity(
      "CAuTRu9eXMwp",
      setShowSecurity,
      setSecurityQuestion,
      setShowQuestions,
      dataToTriggerQuestions,
      setToRecipient
    );
    expect(showSecurity).toEqual(true);
    expect(showQuestions).toEqual(true);
    expect(securityQuestion).toEqual("Question");
    expect(valWithQuestions).toEqual(undefined);
  });
});

describe("unFormatCurrency Util Test", () => {
  it(">> Should render string, no decimals", () => {
    const noDecimal = unFormatCurrency("$100.00");
    expect(noDecimal).toEqual("100");
  });

  it(">> Should render string, with decimals", () => {
    const withDecimal = unFormatCurrency("$1,000.95");
    expect(withDecimal).toEqual("1000.95");
  });

  it(">> Should render empty string", () => {
    const emptyString = unFormatCurrency("");
    expect(emptyString).toEqual("");
  });

  it(">> Should render empty string if $0.00 entered", () => {
    const str = unFormatCurrency("$0.00");
    expect(str).toEqual("");
  });
});

describe("floatValue Util Test", () => {
  it(">> Should render float, no decimals if zero", () => {
    const noDecimal = floatValue("$100.00");
    expect(noDecimal).toEqual(100);
  });

  it(">> Should render with decimals", () => {
    const withDecimal = floatValue("$1,000.95");
    expect(withDecimal).toEqual(1000.95);
  });

  it(">> Should render NaN", () => {
    const emptyString = floatValue("");
    expect(emptyString).toEqual(NaN);
  });
});

describe("numberFilter Util Test", () => {
  it(">> should allow only 0-9 and $ as start character", () => {
    let result = numberFilter("-100.00");
    expect(result).toEqual("");
    result = numberFilter("q100.00");
    expect(result).toEqual("");

    result = numberFilter(".45");
    expect(result).toEqual("");

    result = numberFilter("45");
    expect(result).toEqual("45");

    result = numberFilter("$45");
    expect(result).toEqual("$45");
  });

  it(">> should allow only numbers, $ and dot as value", () => {
    let result = numberFilter("$100.00");
    expect(result).toEqual("$100.00");

    result = numberFilter("11ee.34");
    expect(result).toEqual("11.34");

    result = numberFilter("11ee,34");
    result = numberFilter("1134");
  });

  it(">> should allow only one dot", () => {
    let result = numberFilter("100.");
    expect(result).toEqual("100.");

    result = numberFilter("11..34");
    expect(result).toEqual("11.34");

    result = numberFilter("11.3.4");
    expect(result).toEqual("11.34");
  });

  it(">> should allow only 2 decimal places", () => {
    let result = numberFilter("100.");
    expect(result).toEqual("100.");

    result = numberFilter("100.1");
    expect(result).toEqual("100.1");

    result = numberFilter("100.11");
    expect(result).toEqual("100.11");

    result = numberFilter("100.115");
    expect(result).toEqual("100.11");
  });
});

describe("setEndDateForTransfer Util Test", () => {
  const startingDate = "Jan 05, 2020";
  const value = 2;
  const setEndDateVal = jest.fn;

  it(">> Should return End Date based on Weekly", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "weekly",
      value,
      setEndDateVal
    );
    expect(endDate).toEqual("Jan 12, 2020");
  });

  it(">> Should return End Date based on BiWeekly", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "biweekly",
      value,
      setEndDateVal
    );
    expect(endDate).toEqual("Jan 19, 2020");
  });

  it(">> Should return End Date based on monthly", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "monthly",
      value,
      setEndDateVal
    );
    expect(endDate).toEqual("Feb 05, 2020");
  });

  it(">> Should return End Date based on yearly", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "yearly",
      value,
      setEndDateVal
    );
    expect(endDate).toEqual("Jan 05, 2021");
  });

  it(">> Should return null if frequency is null", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      null,
      value,
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });

  it(">> Should return null if Starting Date is null", () => {
    const endDate = setEndDateForTransfer(null, "weekly", value, setEndDateVal);
    expect(endDate).toBeNull();
  });

  it(">> Should return null if Value is less than 0", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "weekly",
      "-1",
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });

  it(">> Should return null if Value is greater than 999", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "weekly",
      "1000",
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });

  it(">> Should return null if Value is 0", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "weekly",
      "1000",
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });

  it(">> Should return null if Value is null", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "weekly",
      null,
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });

  it(">> Should return null if frequency doesn't match", () => {
    const endDate = setEndDateForTransfer(
      startingDate,
      "aaa",
      "2",
      setEndDateVal
    );
    expect(endDate).toBeNull();
  });
});

describe("getFormattedAccounts", () => {
  const fromAccount = [
    {
      name: "Basic Savings",
      number: 1234,
      availableBalance: {
        value: 45678
      },
      id: 123456,
      currency: "CAD"
    }
  ];

  it(">> should format account with given data", () => {
    const newArray = getFormattedAccounts(fromAccount);
    expect(newArray).toEqual([
      {
        text: "Basic Savings (1234) | $45,678.00",
        key: 123456,
        value: 123456
      }
    ]);
  });
});

describe("getFormattedAccountsForCurrency", () => {
  const fromAccount = [
    {
      name: "Basic Savings",
      number: 1234,
      availableBalance: {
        value: 45678
      },
      id: 123456,
      currency: "CAD"
    },
    {
      name: "Basic Savings 2",
      number: 1235,
      availableBalance: {
        value: 45675
      },
      id: 123457,
      currency: "USD"
    }
  ];

  it(">> should return only CAD account", () => {
    const newArray = getFormattedAccountsForCurrency(fromAccount, "CAD");
    expect(newArray).toEqual([
      {
        text: "Basic Savings (1234) | $45,678.00",
        key: 123456,
        value: 123456
      }
    ]);
  });

  it(">> should return empty array when currency is not available", () => {
    const newArray = getFormattedAccountsForCurrency(fromAccount, "EUR");
    expect(newArray).toEqual([]);
  });
});

describe("tests for getFormattedPayees", () => {
  const payeesData = [
    {
      billPayeeId: "0003",
      payeeNickname: "D-payee",
      payeeCustomerReference: "0003"
    },
    {
      billPayeeId: "0001",
      payeeNickname: "B-payee",
      payeeCustomerReference: "0001"
    },
    {
      billPayeeId: "0002",
      payeeNickname: "C-payee",
      payeeCustomerReference: "0002"
    }
  ];

  it(">> should format payee data in alphabetic ascending order", () => {
    const newArray = getFormattedPayees(payeesData);
    expect(newArray).toEqual([
      {
        text: "B-payee (0001)",
        key: "0001",
        value: "0001"
      },
      {
        text: "C-payee (0002)",
        key: "0002",
        value: "0002"
      },
      {
        text: "D-payee (0003)",
        key: "0003",
        value: "0003"
      }
    ]);
  });

  it(">> should handle payees with null nicknames", () => {
    const newArray = getFormattedPayees([
      {
        billPayeeId: "0008",
        payeeName: "NO NICKNAME PAYEE",
        payeeNickname: null,
        payeeCustomerReference: "0008"
      }
    ]);
    expect(newArray).toContainEqual({
      text: "NO NICKNAME PAYEE (0008)",
      key: "0008",
      value: "0008"
    });
  });

  it(">> should return empty array for non-array values", () => {
    let newArray = getFormattedPayees(null);
    expect(newArray).toEqual([]);

    newArray = getFormattedPayees(undefined);
    expect(newArray).toEqual([]);

    newArray = getFormattedPayees("truthy string");
    expect(newArray).toEqual([]);

    newArray = getFormattedPayees({});
    expect(newArray).toEqual([]);
  });
});
describe("testing restrictNoOfPaymentsRange", () => {
  it(">> should return empty string if number is not between 1 and 999", () => {
    let ret = restrictNoOfPaymentsRange("0");
    expect(ret).toMatch("");
    ret = restrictNoOfPaymentsRange("1000");
    expect(ret).toMatch("");
  });

  it(">> should return the same string if number is between 1 and 999", () => {
    let ret = restrictNoOfPaymentsRange("1");
    expect(ret).toMatch("1");
    ret = restrictNoOfPaymentsRange("999");
    expect(ret).toMatch("999");
  });
});

describe("Testing renderNumOf()", () => {
  const startingDate = dayjs("01-07-2020", "MM-DD-YYYY");

  it("Should render 1 Week", () => {
    const weeklyVal = renderNumOf(
      dayjs("01-14-2020", "MM-DD-YYYY"),
      startingDate,
      "weekly"
    );

    expect(weeklyVal).toEqual(2);
  });

  it("Should render 2 Weeks 1 payment", () => {
    const biWeeklyVal = renderNumOf(
      dayjs("01-21-2020", "MM-DD-YYYY"),
      startingDate,
      "biweekly"
    );
    expect(biWeeklyVal).toEqual(2);
  });

  it("Should render 1 Month 1 payment", () => {
    const monthlyVal = renderNumOf(
      dayjs("02-08-2020", "MM-DD-YYYY"),
      startingDate,
      "monthly"
    );

    expect(monthlyVal).toEqual(2);
  });

  it("Should render 1 Year 1 Payment", () => {
    const weeklyVal = renderNumOf(
      dayjs("01-07-2021", "MM-DD-YYYY"),
      startingDate,
      "yearly"
    );
    expect(weeklyVal).toEqual(2);
  });

  it("Should render empty string", () => {
    const weeklyVal = renderNumOf(
      dayjs("02-15-2020", "MM-DD-YYYY"),
      startingDate,
      "not a value"
    );

    expect(weeklyVal).toEqual("");
  });
});

describe("Testing capitalize utility", () => {
  it(">> should return string with capital first letter", () => {
    const ret = capitalize("frank");
    expect(ret).toMatch("Frank");
  });

  it(">> should return same string when starting with capital first letter", () => {
    const ret = capitalize("Frank");
    expect(ret).toMatch("Frank");
  });

  it(">> should return empty string when value is not string", () => {
    let ret = capitalize(0);
    expect(ret).toMatch("");
    ret = capitalize({});
    expect(ret).toMatch("");
  });
});

describe("Testing hasInvalidCharacters utility", () => {
  it(">> should fail if detecting invalid character", () => {
    const ret = hasInvalidCharacters("!@78k*(0");
    expect(ret).toEqual(true);
  });

  it(">> should accept valid alphanumeric", () => {
    const ret = hasInvalidCharacters("012aoerSD");
    expect(ret).toEqual(false);
  });
});
describe("Testing hasInvalidCharacters utility", () => {
  it(">> should fail if detecting invalid character", () => {
    const ret = hasInvalidCharacters("!@78k*(0");
    expect(ret).toEqual(true);
  });

  it(">> should accept valid alphanumeric", () => {
    const ret = hasInvalidCharacters("012aoerSD");
    expect(ret).toEqual(false);
  });
});

describe("Testing getDayWithinPeriod", () => {
  it(">> should return proper day within different periods", () => {
    let result = getDayWithinPeriod("05-11-2020", recurringFrequency.weekly);
    expect(result).toEqual(1);
    result = getDayWithinPeriod("05-11-2020", recurringFrequency.biweekly);
    expect(result).toEqual(1);
    result = getDayWithinPeriod("May 11, 2020", recurringFrequency.biweekly);
    expect(result).toEqual(1);
    result = getDayWithinPeriod("05-11-2020", recurringFrequency.monthly);
    expect(result).toEqual(11);

    result = getDayWithinPeriod("05-12-2020", recurringFrequency.weekly);
    expect(result).toEqual(2);
    result = getDayWithinPeriod("05-12-2020", recurringFrequency.biweekly);
    expect(result).toEqual(2);
    result = getDayWithinPeriod("05-12-2020", recurringFrequency.monthly);
    expect(result).toEqual(12);

    result = getDayWithinPeriod("05-13-2020", recurringFrequency.weekly);
    expect(result).toEqual(3);
    result = getDayWithinPeriod("05-13-2020", recurringFrequency.biweekly);
    expect(result).toEqual(3);
    result = getDayWithinPeriod("05-13-2020", recurringFrequency.monthly);
    expect(result).toEqual(13);

    result = getDayWithinPeriod("05-14-2020", recurringFrequency.weekly);
    expect(result).toEqual(4);
    result = getDayWithinPeriod("05-14-2020", recurringFrequency.biweekly);
    expect(result).toEqual(4);
    result = getDayWithinPeriod("05-14-2020", recurringFrequency.monthly);
    expect(result).toEqual(14);

    result = getDayWithinPeriod("05-15-2020", recurringFrequency.weekly);
    expect(result).toEqual(5);
    result = getDayWithinPeriod("05-15-2020", recurringFrequency.biweekly);
    expect(result).toEqual(5);
    result = getDayWithinPeriod("05-15-2020", recurringFrequency.monthly);
    expect(result).toEqual(15);

    result = getDayWithinPeriod("05-16-2020", recurringFrequency.weekly);
    expect(result).toEqual(6);
    result = getDayWithinPeriod("05-16-2020", recurringFrequency.biweekly);
    expect(result).toEqual(6);
    result = getDayWithinPeriod("05-16-2020", recurringFrequency.monthly);
    expect(result).toEqual(16);

    result = getDayWithinPeriod("05-17-2020", recurringFrequency.weekly);
    expect(result).toEqual(7);
    result = getDayWithinPeriod("05-17-2020", recurringFrequency.biweekly);
    expect(result).toEqual(7);
    result = getDayWithinPeriod("05-17-2020", recurringFrequency.monthly);
    expect(result).toEqual(17);

    result = getDayWithinPeriod("01-31-2020", recurringFrequency.monthly);
    expect(result).toEqual(31);

    result = getDayWithinPeriod("02-29-2020", recurringFrequency.monthly);
    expect(result).toEqual(29);
    result = getDayWithinPeriod("Feb 29, 2020", recurringFrequency.monthly);
    expect(result).toEqual(29);
  });
});

describe("Set Period Freq Test", () => {
  it(">> Should return correct values", () => {
    const weekly = setPeriodFrequency({
      frequency: recurringFrequency.weekly
    });
    const biWeekly = setPeriodFrequency({
      frequency: recurringFrequency.biweekly
    });
    const monthly = setPeriodFrequency({
      frequency: recurringFrequency.monthly
    });
    const yearly = setPeriodFrequency({
      frequency: recurringFrequency.yearly
    });

    expect(weekly).toEqual(1);
    expect(biWeekly).toEqual(2);
    expect(monthly).toEqual(1);
    expect(yearly).toEqual(12);
  });
});

describe("Get Period Frequency Text Test", () => {
  it(">> Should return correct values", () => {
    const weekly = getFrequencyText(1, "Week");
    const biWeekly = getFrequencyText(2, "Week");
    const monthly = getFrequencyText(1, "Month");
    const yearly = getFrequencyText(12, "Month");
    const emptyValue = getFrequencyText(5, "Test");

    expect(weekly).toEqual("Weekly");
    expect(biWeekly).toEqual("Biweekly");
    expect(monthly).toEqual("Monthly");
    expect(yearly).toEqual("Yearly");
    expect(emptyValue).toBe(null);
  });

  it(">> Should return null for valid periods with invalid frequencies", () => {
    const fourWeeks = getFrequencyText(4, "Week");
    const sixMonths = getFrequencyText(6, "Month");

    expect(fourWeeks).toBe(null);
    expect(sixMonths).toBe(null);
  });
});

describe("isValidEmail Test", () => {
  it(">> Should validate proper email username", () => {
    let email = "test_123@atb.com";
    expect(isValidEmail(email)).toEqual(true);
    email = "TE.ST_%+-4567@atb.com";
    expect(isValidEmail(email)).toEqual(true);
    email = "te..st@atb.com";
    expect(isValidEmail(email)).toEqual(false);
    email = "te&st@atb.com";
    expect(isValidEmail(email)).toEqual(false);
    email = "te!st@atb.com";
    expect(isValidEmail(email)).toEqual(false);
    email = "te$st@atb.com";
    expect(isValidEmail(email)).toEqual(false);
  });

  it(">> Should validate proper email domain", () => {
    let email = "valid_user@atb.com";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@ATB.com";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@atb-2.com";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@atb-.com";
    expect(isValidEmail(email)).toEqual(false);
    email = "valid_user@a_t_b.com";
    expect(isValidEmail(email)).toEqual(false);
    email = "valid_user@atb";
    expect(isValidEmail(email)).toEqual(false);
  });
  it(">> Should validate proper email top level domains", () => {
    let email = "valid_user@atb.ca";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@atb.co.uk";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@atb.a.b.c.d.e.f.g.ca";
    expect(isValidEmail(email)).toEqual(true);
    email = "valid_user@atb.c";
    expect(isValidEmail(email)).toEqual(false);
    email = "valid_user@atb.c0m";
    expect(isValidEmail(email)).toEqual(false);
    email = "valid_user@atb.c_m";
    expect(isValidEmail(email)).toEqual(false);
  });
});

describe("Email sanitize + isValidEmail Test", () => {
  const MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1 = ".";
  const MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2 = "  .    ";
  const MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3 = "      . ";

  it(">> Should sanitize and validate proper email username", () => {
    let email = "test_123@atb.com";
    let sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "TE.ST_%+-4567@atb.com";
    sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "te..st@atb.com";
    let emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "te&st@atb.com";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "te!st@atb.com";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "te$st@atb.com";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
  });

  it(">> Should sanitize and validate proper email domain", () => {
    let email = "valid_user@atb.com";
    let sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@ATB.com";
    sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@atb-2.com";
    sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@atb-.com";
    let emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "valid_user@a_t_b.com";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "valid_user@atb";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
  });

  it(">> Should sanitize and validate proper email top level domains", () => {
    let email = "valid_user@atb.ca";
    let sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@atb.co.uk";
    sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@atb.a.b.c.d.e.f.g.ca";
    sanitizedEmail = sanitizeEmail(
      `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`
    );
    expect(isValidEmail(sanitizedEmail)).toEqual(true);
    expect(sanitizedEmail).toEqual(email);
    email = "valid_user@atb.c";
    let emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_1}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "valid_user@atb.c0m";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_2}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
    email = "valid_user@atb.c_m";
    emailToBeSanitized = `${email}${MAC_ADD_PERIOD_WITH_DOUBLE_SPACE_SIMULATION_3}`;
    sanitizedEmail = sanitizeEmail(emailToBeSanitized);
    expect(isValidEmail(sanitizedEmail)).toEqual(false);
    expect(sanitizedEmail).toEqual(emailToBeSanitized);
  });
});
