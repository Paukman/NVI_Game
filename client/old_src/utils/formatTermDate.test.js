import MockDate from "mockdate";
import { formatTermDate, convertTermToDate } from "./formatTermDate";

describe("formatTermDate", () => {
  beforeEach(() => {
    MockDate.set("2021-04-03T12:00:00");
  });
  afterEach(() => {
    MockDate.reset();
  });
  it(">> Should format periods less than 30 days into `X days`", () => {
    expect(formatTermDate("0 Day")).toEqual("None");
    expect(formatTermDate("1 Day")).toEqual("1 day");
    expect(formatTermDate("2 Days")).toEqual("2 days");
    expect(formatTermDate("7 Days")).toEqual("7 days");
    expect(formatTermDate("1 Week")).toEqual("7 days");
    expect(formatTermDate("2 Weeks")).toEqual("14 days");
  });

  it(">> Should format periods between 30 days and 1 year in `X months`", () => {
    expect(formatTermDate("30 Days")).toEqual("1 month");
    expect(formatTermDate("5 Weeks")).toEqual("1 month");
    expect(formatTermDate("1 Month")).toEqual("1 month");
    expect(formatTermDate("6 Months")).toEqual("6 months");
    expect(formatTermDate("360 Days")).toEqual("11 months");
  });

  it(">> Should format Year periods with 0 months into `X years`", () => {
    expect(formatTermDate("365 Days")).toEqual("1 year");
    expect(formatTermDate("12 Months")).toEqual("1 year");
    expect(formatTermDate("1 Year")).toEqual("1 year");
    expect(formatTermDate("24 Months")).toEqual("2 years");
    expect(formatTermDate("2 Year")).toEqual("2 years");
  });

  it(">> Should format periods with both years and months in `Xyr Ymo`", () => {
    expect(formatTermDate("66 Weeks")).toEqual("1yr 3mo");
    expect(formatTermDate("500 Days")).toEqual("1yr 4mo");
    expect(formatTermDate("18 Months")).toEqual("1yr 6mo");
    expect(formatTermDate("26 Months")).toEqual("2yr 2mo");
  });

  it(">> Should return `None` for terms of `0 units`", () => {
    expect(formatTermDate("0 Days")).toEqual("None");
    expect(formatTermDate("0 Weeks")).toEqual("None");
    expect(formatTermDate("0 Months")).toEqual("None");
    expect(formatTermDate("0 Years")).toEqual("None");
  });

  it(">> Should return `None` for invalid inputs", () => {
    expect(formatTermDate("invalid string")).toEqual("None");
    expect(formatTermDate("2022-06-06")).toEqual("None");
    expect(formatTermDate()).toEqual("None");
    expect(formatTermDate(null)).toEqual("None");
    expect(formatTermDate(888)).toEqual("None");
    expect(formatTermDate({})).toEqual("None");
  });
});

describe("convertTermToDate", () => {
  beforeEach(() => {
    MockDate.set("2021-06-01T12:00:00");
  });
  afterEach(() => {
    MockDate.reset();
  });

  it(">> Should convert term string into a date by adding term value to current date", () => {
    expect(convertTermToDate("0 Days")).toEqual("2021-06-01");
    expect(convertTermToDate("1 Day")).toEqual("2021-06-02");
    expect(convertTermToDate("5 Days")).toEqual("2021-06-06");

    expect(convertTermToDate("1 Week")).toEqual("2021-06-08");
    expect(convertTermToDate("2 Weeks")).toEqual("2021-06-15");

    expect(convertTermToDate("1 Month")).toEqual("2021-07-01");
    expect(convertTermToDate("6 Months")).toEqual("2021-12-01");
    expect(convertTermToDate("12 Months")).toEqual("2022-06-01");

    expect(convertTermToDate("1 Year")).toEqual("2022-06-01");
    expect(convertTermToDate("5 Years")).toEqual("2026-06-01");
  });

  it(">> Should return today's date when term argument is not valid", () => {
    expect(convertTermToDate("2020-01-03")).toEqual("2021-06-01");
    expect(convertTermToDate("string")).toEqual("2021-06-01");
    expect(convertTermToDate("")).toEqual("2021-06-01");

    expect(convertTermToDate()).toEqual("2021-06-01");
    expect(convertTermToDate(null)).toEqual("2021-06-01");
    expect(convertTermToDate(25)).toEqual("2021-06-01");
    expect(convertTermToDate({})).toEqual("2021-06-01");
  });
});
