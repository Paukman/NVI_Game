import React from "react";
import { act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DataStore from "utils/store";
import { mockApiData, renderWithClient } from "utils/TestUtils";
import { eTransferErrors } from "utils/MessageCatalog";
import AccountDetails from "./AccountDetails";

const getDetailsUrl =
  "/api/atb-rebank-api-accounts-ts/deposits/xyz?quickActions=true";

const defaultProps = {
  match: { params: { id: "xyz", type: "deposit" } }
};

const renderComponent = (props = {}) =>
  act(async () =>
    renderWithClient(
      <MemoryRouter initialEntries={["/details/deposit/xyz"]}>
        <AccountDetails {...defaultProps} {...props} />
      </MemoryRouter>
    )
  );

describe("AccountDetails", () => {
  beforeEach(() => {
    DataStore.flush();
  });

  it(">> Should rendered Posted transactions", async () => {
    await renderComponent();
    const { findByText } = screen;

    const pageText = await findByText("Posted transactions");
    expect(pageText).toBeVisible();
  });

  it(">> Should rendered Details card when API returns data", async () => {
    mockApiData([
      {
        url: getDetailsUrl,
        results: {
          currency: "CAD",
          id: "33ZFwIxk3ZebPZZx1bDHjxF_vvZE5ey5s5NdoRqnJMQ",
          name: "ATB Advantage Account",
          number: "00427163779",
          routingId: "021908859",
          subType: "Chequing",
          type: "Deposit",
          additionalValues: {},
          bankAccount: {
            country: "CA",
            routingId: "021908559",
            accountId: "0000000719596679"
          },
          balance: { currency: "CAD", value: 1099597.12 },
          availableBalance: { currency: "CAD", value: 1099597.12 },
          quickActions: {
            transferFrom: true,
            payBill: true,
            etransfer: true,
            makePayment: false,
            contribute: false,
            makeBillPayment: false
          }
        },
        status: 200,
        method: "get"
      }
    ]);

    await renderComponent();
    const { findByText, findByTestId } = screen;

    const accountName = await findByText("ATB Advantage Account");
    const detailsCard = await findByTestId("account-details-card");
    expect(detailsCard).toBeVisible();
    expect(accountName).toBeVisible();
  });

  it(">> Should not show error if no match params values available", async () => {
    await renderComponent({ match: { params: {} } });
    const { findByText } = screen;

    const pageText = await findByText("Posted transactions");
    expect(pageText).toBeDefined();
  });

  it(">> Should show an error modal if the account details api throws an error", async () => {
    mockApiData([
      {
        url: getDetailsUrl,
        error: 500
      }
    ]);

    await renderComponent();
    const { findByText } = screen;

    const errorModal = await findByText(eTransferErrors.MSG_REBAS_000_CONTENT);
    expect(errorModal).toBeVisible();
  });
});
