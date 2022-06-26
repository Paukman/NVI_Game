import React from "react";
import { act, screen } from "@testing-library/react";

import { mockApiData, renderWithClient } from "utils/TestUtils";
import ETransfer from "InteracETransfer/SendETransfer";
import { etransfersBaseUrl, accountsBaseUrl } from "api";
import {
  interacProfilePassing,
  interacProfileFailing,
  recipientsPassing,
  recipientsFailing,
  eligibleAccountsFromDataPassing,
  eTransferLimitsPassing
} from "InteracETransfer/InteracETransfer.testdata";
import ETransferProvider from "../ETransferProvider";

const renderComponent = (props = {}) =>
  act(async () =>
    renderWithClient(
      <ETransferProvider>
        <ETransfer {...props} />
      </ETransferProvider>
    )
  );

describe("Testing SendEtransfer", () => {
  it(">> should successfully render Send E-transfer form", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing,
        status: 200,
        method: "get"
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing,
        status: 200,
        method: "get"
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      }
    ]);

    await renderComponent();
    const { findByRole } = screen;
    const nextButton = await findByRole("button", { name: "Next" });

    expect(nextButton).toBeVisible();
  });

  it(">> should display No Interac Profile modal", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfileFailing,
        status: 200,
        method: "get"
      }
    ]);
    await renderComponent();
    const { findByRole } = screen;
    const createProfileButton = await findByRole("button", {
      name: "Create profile"
    });

    expect(createProfileButton).toBeVisible();
  });

  it(">> should display no recipients modal alert", async () => {
    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing,
        status: 200,
        method: "get"
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsFailing,
        status: 200,
        method: "get"
      }
    ]);

    await renderComponent();
    const { findByText, findByRole } = screen;
    const noRecipientsTitle = await findByText("No recipients");
    const addRecipientButton = await findByRole("button", {
      name: "Add recipient"
    });

    expect(noRecipientsTitle).toBeVisible();
    expect(addRecipientButton).toBeVisible();
  });

  it(">> should display System Error modal", async () => {
    await renderComponent();
    const { findByText } = screen;
    const systemErrorTitle = await findByText("System Error");

    expect(systemErrorTitle).toBeVisible();
  });
});
