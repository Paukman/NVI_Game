import React from "react";
import { MemoryRouter } from "react-router-dom";
import {
  renderWithRouter,
  mockApiData,
  renderWithClient
} from "utils/TestUtils";
import DataStore from "utils/store";
import { featureToggleBaseUrl } from "api";

import MoveMoney, { SubView } from "./MoveMoney";

const BASE_PATH = "/move-money";

describe("MoveMoney tests", () => {
  beforeEach(() => {
    DataStore.flush();
  });

  it(">> return null when there is no match", () => {
    const { container } = renderWithRouter(<MoveMoney />, {
      route: `${BASE_PATH}/blah-blah`
    });
    expect(container.hasChildNodes()).toBe(false);
  });
  it(">> Should test BillPay", () => {
    const data = {
      sectionName: "bill-payment"
    };
    const results = SubView(data);
    expect(results.type.name).toEqual("BillPaymentProvider");
  });
  it(">> Should test Transfer Between", () => {
    const data = {
      sectionName: "transfer-between-accounts"
    };
    const results = SubView(data);
    expect(results.type.name).toEqual("TransferProvider");
  });
  it(">> Should test eTransfer request", () => {
    const data = {
      sectionName: "request-money"
    };
    const results = SubView(data);
    expect(results.type.name).toEqual("InteracETransfer");
  });

  it(">> Should test eTransfer send", () => {
    const data = {
      sectionName: "send-money"
    };
    const results = SubView(data);
    expect(results.type.name).toEqual("InteracETransfer");
  });

  it(">> Should test default", () => {
    const data = {
      sectionName: ""
    };
    const results = SubView(data);
    expect(results).toEqual(null);
  });

  it("should not render the GlobalTransfers screen if the feature flag is disabled", () => {
    mockApiData([
      {
        url: `${featureToggleBaseUrl}/rebank-global-transfers-enabled`,
        results: {
          status: false
        }
      }
    ]);

    const component = renderWithRouter(<MoveMoney />, {
      route: `${BASE_PATH}/global-transfers`
    });

    const { queryByText } = component;

    const globalTransfers = queryByText("Global Transfers");
    expect(globalTransfers).not.toBeInTheDocument();
  });

  it("should render the GlobalTransfers screen if the feature flag is enabled", async () => {
    mockApiData([
      {
        url: `${featureToggleBaseUrl}/rebank-global-transfers-enabled`,
        results: {
          status: true
        }
      }
    ]);

    const component = renderWithClient(
      <MemoryRouter initialEntries={[`${BASE_PATH}/global-transfers`]}>
        <MoveMoney />
      </MemoryRouter>
    );

    const { findByText } = component;

    const globalTransfers = await findByText("Global Transfers");
    expect(globalTransfers).toBeVisible();
  });
});
