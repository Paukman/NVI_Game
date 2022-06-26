import React from "react";
import { act, render, screen } from "@testing-library/react";
import { contactSupport } from "globalConstants";
import FailedTransactionDetails from "./FailedTransactionDetails";

const failedTransaction = {
  from: "No-Fee All-In Account (3279)",
  to: "AARONS CANADA (9108)",
  amount: "$3.00",
  failureDate: "Apr 27, 2021",
  failureReason: "Unknown",
  associatedFees: "None",
  accountStatusDesc: null
};

const defaultProps = {
  transaction: failedTransaction
};

const renderComponent = (props = {}) =>
  act(async () =>
    render(<FailedTransactionDetails {...defaultProps} {...props} />)
  );

describe("FailedTransactionDetails - test details screen", () => {
  it(">> Should render selected Failed Transaction labels", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("From")).toBeVisible();
    expect(getByText("To")).toBeVisible();
    expect(getByText("Amount")).toBeVisible();
    expect(getByText("Failure date")).toBeVisible();
    expect(getByText("Failure reason")).toBeVisible();
    expect(getByText("Associated fees")).toBeVisible();
  });
  it(">> Should render selected Failed Transaction Details values", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("No-Fee All-In Account (3279)")).toBeVisible();
    expect(getByText("AARONS CANADA (9108)")).toBeVisible();
    expect(getByText("$3.00")).toBeVisible();
    expect(getByText("Apr 27, 2021")).toBeVisible();
    expect(getByText("Unknown")).toBeVisible();
    expect(getByText("None")).toBeVisible();
  });

  it(">> Should display account status description and support phone number if the accountStatusDesc exists", async () => {
    const accountStatusDesc = "Yo, looks like your account is locked";
    const transaction = { ...failedTransaction, accountStatusDesc };

    await renderComponent({ transaction });
    const { getByText, getByRole } = screen;

    expect(getByText(accountStatusDesc)).toBeVisible();
    expect(
      getByRole("link", { name: contactSupport.PHONE_NUMBER })
    ).toBeVisible();
  });
});
