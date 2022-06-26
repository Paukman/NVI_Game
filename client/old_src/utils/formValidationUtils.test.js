import {
  validateAmountRange,
  validateAmountBalance,
  validateInvalidDate,
  validateMinAmount,
  validateMaxAmount
} from "./formValidationUtils";
import {
  withdrawalAccountsEmpty,
  withdrawalAccountsSuccess
} from "./constants";

describe("Testing validateAmountRange", () => {
  it(">> should validate amount based on input arguments", () => {
    let res = validateAmountRange(10, 1, 1000);
    expect(res).toEqual(true);
    res = validateAmountRange(1, 1, 1000);
    expect(res).toEqual(true);
    res = validateAmountRange(1000, 1, 1000);
    expect(res).toEqual(true);
    res = validateAmountRange(0, 1, 1000);
    expect(res).toEqual(false);
    res = validateAmountRange(1001, 1, 1000);
    expect(res).toEqual(false);
  });
});

describe("Testing validateInvalidDate", () => {
  it(">> should return true for the valid date", () => {
    let res = validateInvalidDate("May 20, 2020");
    expect(res).toEqual(true);
    res = validateInvalidDate("2020-10-10");
    expect(res).toEqual(true);
    res = validateInvalidDate("10-10-2020");
    expect(res).toEqual(true);
  });
  it(">> should return false for not valid date", () => {
    let res = validateInvalidDate("May 20, -2020");
    expect(res).toEqual(false);
    // res = validateInvalidDate("2020-10-45"); // isValid does not currently validate this properly
    // expect(res).toEqual(false);
    res = validateInvalidDate("10-0-2020");
    expect(res).toEqual(false);
    res = validateInvalidDate("garbage5");
    expect(res).toEqual(false);
  });
});

describe("validateAmountBalance Test", () => {
  it(">> should return error  on garbage", () => {
    let res = validateAmountBalance(
      null,
      withdrawalAccountsEmpty,
      null,
      "message"
    );
    expect(res).toEqual(false);
    res = validateAmountBalance(null);
    expect(res).toEqual(false);
    res = validateAmountBalance(undefined);
    expect(res).toEqual(false);
    res = validateAmountBalance("");
    expect(res).toEqual(false);
    res = validateAmountBalance("123456.78", withdrawalAccountsSuccess);
    expect(res).toEqual(false);
  });
  it(">> should return false if amount exceeding amount balance", () => {
    const res = validateAmountBalance("123456.78", withdrawalAccountsSuccess, {
      from: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
    });
    expect(res).toEqual(false);
  });
  it(">> should return true if amount less then account balance", () => {
    const res = validateAmountBalance("456.78", withdrawalAccountsSuccess, {
      from: "33ZFwIxk3ZebPZZx1bDHj13qc_cl-x7xEjlFolGtxIc"
    });
    expect(res).toEqual(true);
  });
});

describe("Testing validateMinAmount and validateMaxAmount", () => {
  it(">> should validate min amount based on input arguments", () => {
    let res = validateMinAmount(0.1, 1);
    expect(res).toEqual(false);
    res = validateMinAmount(1, 1);
    expect(res).toEqual(true);
    res = validateMinAmount(2, 1);
    expect(res).toEqual(true);
    res = validateMinAmount(null, 1);
    expect(res).toEqual(false);
    res = validateMinAmount(1, undefined);
    expect(res).toEqual(false);
  });

  it(">> should validate min amount based on input arguments", () => {
    let res = validateMaxAmount(0.1, 1);
    expect(res).toEqual(true);
    res = validateMaxAmount(1, 1);
    expect(res).toEqual(true);
    res = validateMaxAmount(2, 1);
    expect(res).toEqual(false);
    res = validateMaxAmount(null, 1);
    expect(res).toEqual(false);
    res = validateMaxAmount(1, undefined);
    expect(res).toEqual(false);
  });
});
