import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuickActions from "./QuickActions";

const quickActions = {
  transferFrom: true,
  payBill: false,
  etransfer: false,
  makePayment: false,
  contribute: false,
  makeBillPayment: false
};

const falseQuickActions = {
  transferFrom: false,
  payBill: false,
  etransfer: false,
  makePayment: false,
  contribute: false,
  makeBillPayment: false
};

const account = {
  type: "deposit",
  name: "Savings",
  number: "007",
  bankAccount: {
    accountId: "000123",
    routingId: "01234",
    country: "CAD"
  }
};

const defaultProps = {
  account,
  quickActions
};

const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <QuickActions {...defaultProps} {...props} />
    </MemoryRouter>
  );

describe("QuickActions", () => {
  it(">> Should render Quick actions if any valid actions are true", () => {
    renderComponent();
    const { getByText } = screen;

    expect(getByText("Transfer")).toBeVisible();
  });

  it(">> Should not render Quick actions if no actions are true", () => {
    renderComponent({ quickActions: falseQuickActions });
    const { queryByTestId } = screen;

    expect(queryByTestId("quick-actions-007")).not.toBeInTheDocument();
  });

  it(">> Should not render Quick actions if quickActions prop is undefined", () => {
    renderComponent({ quickActions: undefined });
    const { queryByTestId } = screen;

    expect(queryByTestId("quick-actions-007")).not.toBeInTheDocument();
  });
});
