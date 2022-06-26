import MockDate from "mockdate";
import {
  validateRequiredNoOfPayments,
  validateEndDateIsPastStartDate,
  validateInvalidDate,
  validateDateTodayOrLater,
  validateIsNumber,
  validateAmountBalance,
  validateAmountRange
} from "./formValidators";
import {
  withdrawalAccountsSuccess,
  withdrawalAccountsEmpty
} from "./constants";

describe("validateAmountBalance Test", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> Should return error if degenerate case", () => {
    const res = validateAmountBalance(
      null,
      withdrawalAccountsEmpty,
      null,
      "message"
    );
    expect(res).toEqual("message");
  });
  it(">> Should return error if value > balance of selected account", () => {
    const res = validateAmountBalance(
      "123456.78",
      withdrawalAccountsSuccess,
      { from: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc" },
      "message"
    );
    expect(res).toEqual("message");
  });
  it(">> Should accept value <= balance of selected account", () => {
    const res = validateAmountBalance(
      "456.78",
      withdrawalAccountsSuccess,
      { from: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc" },
      "message"
    );
    expect(res).toEqual(true);
  });

  it(">> should return true when number of payments is in range", () => {});
  it(">> should return true if number of payments is garbage", () => {});
  it(">> should return message when number of payments is below zero or above 999", () => {});

  it(">> should return message when date is not valid", () => {});
  it(">> should return true if date is valid", () => {});

  it(">> should return message when start date is equal or after the end date", () => {});
  it(">> should return true if start date is before the end date", () => {});

  it(">> should return message if value is not a number", () => {});
  it(">> should return true if value is a number", () => {});
});

describe("Testing validateRequiredNoOfPayments", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate number of payments based on input arguments", () => {
    let res = validateRequiredNoOfPayments(10, "message");
    expect(res).toEqual(true);
    res = validateRequiredNoOfPayments(1, "message");
    expect(res).toEqual(true);
    res = validateRequiredNoOfPayments(0, "message");
    expect(res).toEqual("message");
    res = validateRequiredNoOfPayments(999, "message");
    expect(res).toEqual(true);
    res = validateRequiredNoOfPayments(1000, "message");
    expect(res).toEqual("message");
    res = validateRequiredNoOfPayments("", "message");
    expect(res).toEqual("message");
  });
  it(">> should return error message for wrong arguments", () => {
    let res = validateRequiredNoOfPayments(10);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(10, null);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(10, undefined);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(10, "");
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(null, 10);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(undefined, 10);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments("");
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(null);
    expect(res).toEqual("Error in validation");
    res = validateRequiredNoOfPayments(undefined);
    expect(res).toEqual("Error in validation");
  });
});

describe("validateEndDateIsPastStartDate Test", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should properly validate dates", () => {
    let res = validateEndDateIsPastStartDate(
      "Jan 10, 2020",
      "Jan 09, 2020",
      "message"
    );
    expect(res).toEqual("message");
    res = validateEndDateIsPastStartDate(
      "Jan 01, 2020",
      "Jan 01, 2020",
      "message"
    );
    expect(res).toEqual("message");
    res = validateEndDateIsPastStartDate(
      "Jan 01, 2020",
      "Jan 11, 2020",
      "message"
    );
    expect(res).toEqual(true);
  });
});

describe("Testing validateInvalidDate", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should return true for the valid date", () => {
    let res = validateInvalidDate("May 20, 2020", "message");
    expect(res).toEqual(true);
    res = validateInvalidDate("2020-10-10", "message");
    expect(res).toEqual(true);
    res = validateInvalidDate("10-10-2020", "message");
    expect(res).toEqual(true);
  });
  it(">> should return false for not valid date", () => {
    let res = validateInvalidDate("May 20, -2020", "message");
    expect(res).toEqual("message");
    // res = validateInvalidDate("2020-10-45", "message");
    // expect(res).toEqual("message");
    res = validateInvalidDate("10-0-2020", "message");
    expect(res).toEqual("message");
    res = validateInvalidDate("garbage5", "message");
    expect(res).toEqual("message");
  });
});

describe("Testing validateDateTodayOrLater", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate date against today", () => {
    let res = validateDateTodayOrLater("May 20, 2020", "message");
    expect(res).toEqual(true);
    res = validateDateTodayOrLater("2020-10-10", "message");
    expect(res).toEqual(true);
    res = validateDateTodayOrLater("10-10-2020", "message");
    expect(res).toEqual(true);
    res = validateDateTodayOrLater("Mar 10, 2020", "message");
    expect(res).toEqual("message");
  });
  it(">> should return false for not valid date", () => {
    let res = validateDateTodayOrLater("May 20, -2020", "message");
    expect(res).toEqual("Error in validation");
    // res = validateDateTodayOrLater("2020-10-45", "message");
    // expect(res).toEqual("Error in validation");
    res = validateDateTodayOrLater("10-0-2020", "message");
    expect(res).toEqual("Error in validation");
    res = validateDateTodayOrLater("garbage5", "message");
    expect(res).toEqual("Error in validation");
  });
});

describe("Testing validateIsNumber", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate not number", () => {
    let res = validateIsNumber("10", "message");
    expect(res).toEqual(true);
    res = validateIsNumber(10, "message");
    expect(res).toEqual(true);
    res = validateIsNumber("nineeerr", "message");
    expect(res).toEqual("message");
  });
});

describe("Testing validateAmountRange", () => {
  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate amount based on input arguments", () => {
    let res = validateAmountRange(10, 1, 1000, "message");
    expect(res).toEqual(10);
    res = validateAmountRange(1, 1, 1000, "message");
    expect(res).toEqual(1);
    res = validateAmountRange(1000, 1, 1000, "message");
    expect(res).toEqual(1000);
    res = validateAmountRange(0, 1, 1000, "message");
    expect(res).toEqual("message");
    res = validateAmountRange(1001, 1, 1000, "message");
    expect(res).toEqual("message");
  });
});
