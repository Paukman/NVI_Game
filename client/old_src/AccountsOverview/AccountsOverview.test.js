import React from "react";
import { act, render, screen } from "@testing-library/react";
import { mockApiData, windowMatchMediaMock } from "utils/TestUtils";
import { accountsBaseUrl } from "api";
import { eTransferErrors } from "utils/MessageCatalog";
import { MemoryRouter } from "react-router-dom";
import DataStore from "utils/store";

import AccountsOverview from "./AccountsOverview";
import * as useLoadAccounts from "./useLoadAccounts";
import { testAccounts, testTotals } from "./constants";

const accountsWithQuickActionsURL = `${accountsBaseUrl}/accounts?quickActions=true&totals=true`;

const createMockData = (accounts, totals) => {
  // generate totals based on passed in accounts (or test accounts)

  mockApiData([
    {
      url: accountsWithQuickActionsURL,
      results: {
        errors: {},
        accounts: accounts || testAccounts,
        totals: totals || testTotals
      }
    }
  ]);
};

describe("AccountsOverview", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    DataStore.flush();
  });

  it("should render loading screen", async () => {
    jest.spyOn(useLoadAccounts, "default").mockReturnValueOnce({
      accounts: { loading: true, fetchAccountErrors: {} }
    });
    await act(async () => {
      render(
        <MemoryRouter>
          <AccountsOverview />
        </MemoryRouter>
      );
    });
    const { getByTestId } = screen;
    expect(getByTestId("skeleton")).toBeVisible();
  });

  it("should show total cards based on user account data", async () => {
    const accounts = [testAccounts[0]];
    createMockData(accounts, { deposit: { CAD: 49313.12 } });
    await act(async () => {
      render(
        <MemoryRouter>
          <AccountsOverview />
        </MemoryRouter>
      );
    });
    const { getByTestId, queryByTestId } = screen;

    // Refer to Totals.js for card test IDs
    expect(getByTestId("deposit-card-total")).toBeVisible();
    expect(queryByTestId("loan-card-total")).not.toBeInTheDocument();
    expect(queryByTestId("investment-card-total")).not.toBeInTheDocument();
    expect(queryByTestId("creditcard-card-total")).not.toBeInTheDocument();
    expect(queryByTestId("prepaidcard-card-total")).not.toBeInTheDocument();
  });

  it("should show summary cards", async () => {
    createMockData();
    await act(async () => {
      render(
        <MemoryRouter>
          <AccountsOverview />
        </MemoryRouter>
      );
    });

    const { getByText } = screen;

    // deposit accounts
    expect(getByText("No-Fee All-In Account (7679)")).toBeVisible();
    expect(getByText("Springboard Savings Account (1479)")).toBeVisible();
    // creditcard
    expect(getByText("Gold My Rewards Mastercard (4696)")).toBeVisible();
    // investment
    expect(getByText("CIC (9200)")).toBeVisible();
    // loan
    expect(getByText("TPPL Unsecured and Cash Secured (3800)")).toBeVisible();
  });

  it("should display error message if overview data fetching fails", async () => {
    jest.spyOn(useLoadAccounts, "default").mockReturnValueOnce({
      accounts: {
        loading: true,
        fetchAccountErrors: {},
        generalError: "some error"
      }
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <AccountsOverview />
        </MemoryRouter>
      );
    });
    const { getByText } = screen;

    expect(getByText(eTransferErrors.MSG_REBAS_000_CONTENT)).toBeVisible();
  });
});
