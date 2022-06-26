import { formatPercentage } from "./formatPercentage";

describe("formatPercentage", () => {
  it(">> Should format a number as a percentage to 2 decimal places", () => {
    expect(formatPercentage(66)).toEqual("66.00%");
    expect(formatPercentage(66.22)).toEqual("66.22%");
    expect(formatPercentage(66.5555555)).toEqual("66.56%");
    expect(formatPercentage(125.123)).toEqual("125.12%");
    expect(formatPercentage(-125.128)).toEqual("-125.13%");
    expect(formatPercentage(0)).toEqual("0.00%");
    expect(formatPercentage(-0)).toEqual("0.00%");
  });

  it(">> Should return an empty string if type of value is not number", () => {
    expect(formatPercentage()).toEqual("");
    expect(formatPercentage(null)).toEqual("");
    expect(formatPercentage("Hi")).toEqual("");
    expect(formatPercentage(true)).toEqual("");
    expect(formatPercentage({})).toEqual("");
  });

  it(">> Should return an empty string if value is not a finite number", () => {
    expect(formatPercentage(NaN)).toEqual("");
    expect(formatPercentage(Infinity)).toEqual("");
    expect(formatPercentage(1 / 0)).toEqual("");
  });

  it(">> Should adjust decimal points displayed when secondary argument is given", () => {
    const value = 12.54321;
    expect(formatPercentage(value, 8)).toEqual("12.54321000%");
    expect(formatPercentage(value, 4)).toEqual("12.5432%");
    expect(formatPercentage(value, 1)).toEqual("12.5%");
    expect(formatPercentage(value, 0)).toEqual("13%");
  });
});
