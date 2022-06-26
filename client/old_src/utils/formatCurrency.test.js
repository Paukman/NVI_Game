import { formatCurrency, formatCurrencyInText } from "./formatCurrency";

describe("formatCurrency", () => {
  it(">> should return string with CAD currency format", () => {
    const testFloat = "100000000.00";
    const currency = formatCurrency(testFloat, "CAD");

    expect(currency).toEqual("$100,000,000.00");
  });
  it(">> should return string with USD currency format", () => {
    const testFloat = "100000000.00";
    const currency = formatCurrency(testFloat, "USD");

    expect(currency).toEqual("$100,000,000.00 USD");
  });
  it(">> Should return empty string if value is empty", () => {
    const result = formatCurrency("");
    expect(result).toEqual("");
  });
});

describe("formatCurrencyInText", () => {
  it(">> Should return formatted", () => {
    const result = formatCurrencyInText("$100");
    expect(result).toEqual("$100.00");
  });
});
