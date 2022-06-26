import React from "react";
import { act, render, screen } from "@testing-library/react";
import { windowMatchMediaMock } from "utils/TestUtils";
import { MemoryRouter } from "react-router-dom";
import { Grid } from "antd";
import DetailsCard from "./DetailsCard";

const accountDetails = {
  account: {
    type: "Mastercard",
    subType: "Mastercard",
    name: "Gold Cash Rewards Mastercard",
    number: "543997******0452",
    creditCardNumber: "5439971234560452",
    nickname: null,
    currency: "CAD"
  },
  balance: {
    label: "Current balance",
    amount: {
      value: 8439.16,
      currency: "CAD"
    }
  },
  availableBalance: {
    label: "Available credit",
    amount: {
      value: 6560.0,
      currency: "CAD"
    }
  },
  quickActions: {
    contribute: false,
    etransfer: true,
    makeBillPayment: false,
    makePayment: false,
    payBill: true,
    transferFrom: true
  }
};

const defaultProps = {
  accountDetails,
  accountType: "creditcard",
  isLoading: false
};

const renderComponent = (props = {}) =>
  act(async () =>
    render(
      <MemoryRouter>
        <DetailsCard {...defaultProps} {...props} />
      </MemoryRouter>
    )
  );

describe("DetailsCard", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    jest.spyOn(Grid, "useBreakpoint").mockImplementation(() => ({ md: true }));
  });

  it(">> Should render account details when details exist", async () => {
    await renderComponent();
    const { getByText } = screen;

    const accountName = getByText("Gold Cash Rewards Mastercard");
    expect(accountName).toBeVisible();
  });

  it(">> Should render skeleton when loading", async () => {
    await renderComponent({ isLoading: true });
    const { getByTestId } = screen;

    const accountName = getByTestId("details-card-skeleton");
    expect(accountName).toBeVisible();
  });

  it(">> Should render null when not loading and no account details exist", async () => {
    await renderComponent({ isLoading: false, accountDetails: undefined });
    const { queryByTestId } = screen;

    const detailsCard = queryByTestId("details-card-skeleton");
    expect(detailsCard).toBeNull();
  });

  it(">> Should render tables when the are in accountDetails", async () => {
    const leftTable = {
      title: "Table",
      data: [{ label: "Label", value: "value" }]
    };
    await renderComponent({
      accountDetails: { ...accountDetails, leftTable }
    });
    const { getByText } = screen;

    const table = getByText("Table");
    const label = getByText("Label");
    expect(table).toBeVisible();
    expect(label).toBeVisible();
  });

  it(">> Should render quick action button", async () => {
    await renderComponent({
      accountDetails
    });
    const { getByText } = screen;

    expect(getByText("Transfer")).toBeVisible();
  });
});
