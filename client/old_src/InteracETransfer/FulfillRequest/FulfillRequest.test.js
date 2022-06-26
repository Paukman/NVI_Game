import React from "react";
import { Router } from "react-router-dom";
import { render, act, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { mockApiData } from "utils/TestUtils";
import { accountsBaseUrl, etransfersBaseUrl } from "api";
import ModalProvider from "Common/ModalProvider";
import { MessageProvider } from "StyleGuide/Components";
import PromptProvider from "Common/PromptProvider";
import {
  eTransferLimitsPassing,
  interacProfilePassing,
  eligibleAccountsFromDataPassing,
  recipientsPassing
} from "../InteracETransfer.testdata";
import { fulfillRequest, requestFulfilled } from "./constants";
import FulfillRequest from "./FulfillRequest";

describe("Test Fulfill Request", () => {
  beforeAll(() => {
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
      },
      {
        url: `${etransfersBaseUrl}/`,
        method: "POST",
        results: { status: 201, data: { confirmationID: "12345" } }
      },
      {
        url: `${etransfersBaseUrl}/incomingmoneyrequest/fail`,
        error: { message: "Server Error" },
        results: null,
        status: 500,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/incomingmoneyrequest/success`,
        results: fulfillRequest,
        status: 200,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/incomingmoneyrequest/fulfilled`,
        results: requestFulfilled,
        status: 200,
        method: "GET"
      }
    ]);
  });
  it(">> Should display an error if an error occurs retrieving the request", async () => {
    const history = createMemoryHistory();

    await act(async () => {
      render(
        <Router
          initialEntries={["/move-money/fulfill-request/fail"]}
          history={history}
        >
          <MessageProvider>
            <ModalProvider>
              <FulfillRequest id="fail" />
            </ModalProvider>
          </MessageProvider>
        </Router>
      );
    });
    const { findByText, getByRole } = screen;
    const interacErrorContent = "e-Transfer Failed";
    expect(await findByText(interacErrorContent)).toBeVisible();
    const okButton = await getByRole("button", { name: "OK" });
    fireEvent.click(okButton);

    expect(await findByText(interacErrorContent)).not.toBeInTheDocument();
  });

  it(">> Should render confirmation page when the request has already been fulfilled", async () => {
    const history = createMemoryHistory();

    await act(async () => {
      render(
        <Router
          initialEntries={["/move-money/fulfill-request/fulfilled"]}
          history={history}
        >
          <MessageProvider>
            <ModalProvider>
              <FulfillRequest id="fulfilled" />
            </ModalProvider>
          </MessageProvider>
        </Router>
      );
    });

    const { getByText, queryByText } = screen;

    expect(
      getByText("You’ve successfully fulfilled a request for money by", {
        exact: false
      })
    ).toBeVisible();
    expect(getByText(`$${requestFulfilled.amount / 100}`)).toBeVisible();
    // View Account button shouldn't display
    expect(queryByText("View account")).toBeNull();
    expect(getByText("Go to Overview")).toBeVisible();
  });

  it(">> Should render a loading form while waiting for API data", async () => {
    const history = createMemoryHistory();

    await act(async () => {
      render(
        <Router
          initialEntries={["/move-money/fulfill-request/isLoading"]}
          history={history}
        >
          <MessageProvider>
            <ModalProvider>
              <FulfillRequest id="isLoading" />
            </ModalProvider>
          </MessageProvider>
        </Router>
      );
    });

    const { getByTestId } = screen;
    expect(getByTestId("profile-loading")).toBeVisible();
  });

  it(">> Should display confirmation page on successful request fulfillment", async () => {
    const history = createMemoryHistory();
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
        url: `${etransfersBaseUrl}/incomingmoneyrequest/success`,
        results: fulfillRequest,
        status: 200,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}/`,
        method: "POST",
        results: { status: 201, data: { confirmationID: "12345" } }
      }
    ]);

    await act(async () => {
      render(
        <Router
          initialEntries={["/move-money/fulfill-request/success"]}
          history={history}
        >
          <PromptProvider>
            <MessageProvider>
              <ModalProvider>
                <FulfillRequest id="success" />
              </ModalProvider>
            </MessageProvider>
          </PromptProvider>
        </Router>
      );
    });
    const { getByText, findAllByText, findByTestId } = screen;

    const fromAccount = await findByTestId("from-account-dropdown");
    const fromAccountOption = getByText("Basic Account (4779) | $49,984.01");

    await act(async () => {
      fireEvent.click(fromAccountOption);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Basic Account (4779) | $49,984.01"
    );
    const fulfillButton = getByText("Fulfill");
    await act(async () => {
      fireEvent.click(fulfillButton);
    });

    const [successMsg, snackBarMsg] = await findAllByText(
      "You’ve successfully fulfilled a request for money by",
      {
        exact: false
      }
    );
    expect(successMsg).toBeVisible();
    expect(snackBarMsg).toBeVisible();
  });

  it(">> Should display an error if an error occurs fulfilling the request", async () => {
    const history = createMemoryHistory();
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
        url: `${etransfersBaseUrl}/incomingmoneyrequest/failfulfill`,
        results: fulfillRequest,
        status: 200,
        method: "GET"
      },
      {
        url: `${etransfersBaseUrl}`,
        method: "POST",
        status: 500,
        results: null,
        error: { message: "Server Error" }
      }
    ]);

    await act(async () => {
      render(
        <Router
          initialEntries={["/move-money/fulfill-request/failfulfill"]}
          history={history}
        >
          <PromptProvider>
            <MessageProvider>
              <ModalProvider>
                <FulfillRequest id="failfulfill" />
              </ModalProvider>
            </MessageProvider>
          </PromptProvider>
        </Router>
      );
    });
    const { getByText, findByText, findByTestId } = screen;

    const fromAccount = await findByTestId("from-account-dropdown");
    const fromAccountOption = getByText("Basic Account (4779) | $49,984.01");

    await act(async () => {
      fireEvent.click(fromAccountOption);
    });
    expect(fromAccount.children[1].textContent).toBe(
      "Basic Account (4779) | $49,984.01"
    );
    const fulfillButton = getByText("Fulfill");
    fireEvent.click(fulfillButton);

    expect(await findByText("e-Transfer Failed")).toBeVisible();

    const okButton = getByText("OK");
    fireEvent.click(okButton);

    expect(await findByText("e-Transfer Failed")).not.toBeInTheDocument();
  });
});
