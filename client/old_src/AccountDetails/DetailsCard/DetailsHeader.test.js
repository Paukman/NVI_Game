import React from "react";
import { render, screen } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import DetailsHeader from "./DetailsHeader";

const account = {
  name: "Gold Cash Rewards Mastercard",
  number: "543997******9406",
  nickname: "Credit card Nickname",
  type: "CreditCard",
  subType: "Mastercard"
};
const availableBalance = {
  amount: {
    currency: "CAD",
    value: 9000
  },
  label: "Available credit"
};
const balance = {
  amount: {
    currency: "",
    value: 2000
  },
  label: "Current balance"
};

const defaultProps = {
  account,
  availableBalance,
  balance
};

const renderComponent = (props = {}) =>
  render(<DetailsHeader {...defaultProps} {...props} />);

describe("DetailsHeader", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> Should render account subtype and nickname if they are defined", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Mastercard")).toBeVisible();
    expect(getByText("Credit card Nickname")).toBeVisible();
  });

  it(">> Should show account name with account number if nickname is defined", async () => {
    await renderComponent();
    const { getByText } = screen;
    expect(
      getByText("Gold Cash Rewards Mastercard | 543997******9406")
    ).toBeVisible();
  });

  it(">> Should render account type if no subtype is defined", async () => {
    await renderComponent({ account: { ...account, subType: undefined } });
    const { getByText } = screen;
    expect(getByText("CreditCard")).toBeVisible();
  });

  it(">> Should render account balances", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Current balance")).toBeVisible();
    expect(getByText("$2,000.00")).toBeVisible();
    expect(getByText("Available credit")).toBeVisible();
    expect(getByText("$9,000.00")).toBeVisible();
  });

  it(">> Should render balance currency if it is defined and not CAD", async () => {
    await renderComponent({
      balance: {
        amount: {
          currency: "USD",
          value: 1737.21
        },
        label: "Current non-CAD balance"
      }
    });
    const { getByText } = screen;

    const currencyBalance = getByText(
      (_, { textContent }) => textContent === "$1,737.21 USD"
    );

    expect(getByText("Current non-CAD balance")).toBeVisible();
    expect(currencyBalance).toBeInTheDocument();
  });
});
