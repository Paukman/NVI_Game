import React from "react";
import { act, render, screen } from "@testing-library/react";
import CrossCurrencyDetails from "./CrossCurrencyDetails";

const defaultProps = {
  transactionDetails: {
    exRateNet: "1.25",
    transactionAmount: { value: 2.5, currency: "CAD" },
    netAmount: { value: 2, currency: "USD" }
  }
};

const renderComponent = (props = {}) =>
  act(async () =>
    render(<CrossCurrencyDetails {...defaultProps} {...props} />)
  );

describe("CrossCurrencyDetails", () => {
  it(">> Should render converted amount details", async () => {
    await renderComponent();
    const { getByText } = screen;

    const convertedLabel = getByText("Converted amount");
    const convertedValue = getByText("$2.50 CAD");
    expect(convertedLabel).toBeVisible();
    expect(convertedValue).toBeVisible();
  });

  it(">> Should render foreign exchange rate details", async () => {
    await renderComponent();
    const { getByText } = screen;

    const exchangeLabel = getByText("Foreign exchange rate");
    const exchangeValue = getByText("$1 USD = $1.25 CAD");
    expect(exchangeLabel).toBeVisible();
    expect(exchangeValue).toBeVisible();
  });

  it(">> Should round exchange to max of 4 decimals", async () => {
    const transactionDetails = {
      ...defaultProps.transactionDetails,
      exRateNet: "1.123456789"
    };
    await renderComponent({ transactionDetails });
    const { getByText } = screen;

    const exchangeRate = getByText("$1 USD = $1.1235 CAD");
    expect(exchangeRate).toBeVisible();
  });
});
