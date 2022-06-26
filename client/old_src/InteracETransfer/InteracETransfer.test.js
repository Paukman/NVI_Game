import React from "react";
import { Router } from "react-router-dom";
import { act, fireEvent, screen } from "@testing-library/react";
import {
  mockApiData,
  windowMatchMediaMock,
  renderWithClient
} from "utils/TestUtils";
import { accountsBaseUrl, etransfersBaseUrl } from "api";
import { createMemoryHistory } from "history";
import MockDate from "mockdate";

import ModalProvider from "Common/ModalProvider";
import AntModalProvider from "StyleGuide/Components/Modal/AntModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import InteracETransfer from "./index";
import {
  SEND_MONEY_PATH,
  REQUEST_MONEY_PATH,
  ETRANSFER_HISTORY_PATH
} from "./eTransferConstants";
import {
  eTransferLimitsPassing,
  interacProfilePassing,
  eligibleAccountsFromDataPassing,
  recipientsPassing
} from "./InteracETransfer.testdata";

const renderComponent = () =>
  act(async () =>
    renderWithClient(
      <AntModalProvider>
        <ModalProvider>
          <InteracETransfer />
        </ModalProvider>
      </AntModalProvider>
    )
  );

describe("Interac ETransfer rendering", () => {
  windowMatchMediaMock();
  beforeEach(() => {
    MockDate.set("2020-01-13T10:20:30Z");

    mockApiData([
      {
        url: `${etransfersBaseUrl}/profile`,
        results: interacProfilePassing
      },
      {
        url: `${accountsBaseUrl}/sortedEligibleAccounts?feature=ETransferFrom`,
        results: eligibleAccountsFromDataPassing
      },
      {
        url: `${etransfersBaseUrl}/limits?etransferProduct=eTransfer%20domestic&currency=CAD`,
        results: eTransferLimitsPassing
      },
      {
        url: `${etransfersBaseUrl}/recipients`,
        results: recipientsPassing
      }
    ]);
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> Should render sidebar title and tabs", async () => {
    await renderComponent();
    const { getByText } = screen;

    expect(getByText("Move money by")).toBeVisible();
    expect(
      getByText((_, { textContent }) => textContent === "Interac e-Transfer®")
    ).toBeVisible();
    expect(getByText("Send money")).toBeVisible();
    expect(getByText("Request money")).toBeVisible();
    expect(getByText("Transfer history")).toBeVisible();
  });

  it(">> Should update URL location when sidebar is clicked", async () => {
    const history = createMemoryHistory();
    await act(async () =>
      renderWithClient(
        <Router history={history}>
          <MessageProvider>
            <AntModalProvider>
              <ModalProvider>
                <InteracETransfer />
              </ModalProvider>
            </AntModalProvider>
          </MessageProvider>
        </Router>
      )
    );

    const { getByText } = screen;

    await act(async () => {
      fireEvent.click(getByText("Send money"));
    });
    expect(history.location.pathname).toEqual(SEND_MONEY_PATH);
    expect(history.location.hash).toEqual("#create");

    await act(async () => {
      fireEvent.click(getByText("Request money"));
    });
    expect(history.location.pathname).toEqual(REQUEST_MONEY_PATH);
    expect(history.location.hash).toEqual("#create");

    await act(async () => {
      fireEvent.click(getByText("Transfer history"));
    });
    expect(history.location.pathname).toEqual(ETRANSFER_HISTORY_PATH);
    expect(history.location.hash).toEqual("");
  });

  it(">> Should render the Send money component when URL changes to send money path", async () => {
    await renderComponent();
    const { findByText, getByText } = screen;

    await act(async () => {
      fireEvent.click(getByText("Send money"));
    });

    expect(await findByText("From")).toBeVisible();
    expect(await findByText("To")).toBeVisible();
    expect(await findByText("Message to recipient (optional)")).toBeVisible();
  });

  it(">> Should render the Request money component when URL changes to request money path", async () => {
    await renderComponent();
    const { findByText, getByText } = screen;

    await act(async () => {
      fireEvent.click(getByText("Request money"));
    });

    expect(await findByText("Request from")).toBeVisible();
    expect(await findByText("Deposit account")).toBeVisible();
    expect(await findByText("Message (optional)")).toBeVisible();
  });

  it(">> Should render the ETransfer history component when URL changes to etransfer history path", async () => {
    await renderComponent();
    const { findByText, getByText } = screen;

    await act(async () => {
      fireEvent.click(getByText("Transfer history"));
    });

    expect(await findByText("Pending transfers")).toBeVisible();
    expect(await findByText("Posted transfers")).toBeVisible();
  });
});
