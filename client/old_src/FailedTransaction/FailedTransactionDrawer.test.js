import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { failedTransactionsUrl } from "api";
import { failedTransactionMessages } from "utils/MessageCatalog";
import { mockApiData, renderWithAtom, resetAtoms } from "utils/TestUtils";
import FailedTransactionDrawer from "./FailedTransactionDrawer";
import {
  drawerVisibleAtom,
  failedTransactionsAtom,
  notificationTriggerAtom
} from "./failedTransactionAtoms";

const unreadFailedTransaction = [
  {
    amount: { currency: "CAD", value: 100 },
    failureDate: "2021-04-15",
    failureReason: null,
    fromAccount: {
      name: "ATB Advantage Account",
      number: "12345678",
      nickname: null
    },
    isAcknowledged: false,
    paymentOrderDate: "2021-04-15",
    paymentOrderNumber: "00001",
    paymentType: "Transfer",
    recurringPaymentInformation: null,
    toAccount: {
      name: "Basic Account",
      nickname: null,
      number: "87654321"
    }
  }
];

const readFailedTransaction = [
  {
    amount: { currency: "CAD", value: 50 },
    failureDate: "2021-01-31",
    failureReason: null,
    fromAccount: {
      name: "ATB Advantage Account",
      number: "12345678",
      nickname: null
    },
    isAcknowledged: true,
    paymentOrderDate: "2021-01-31",
    paymentOrderNumber: "00003",
    paymentType: "Transfer",
    recurringPaymentInformation: null,
    toAccount: {
      name: "Basic Account",
      nickname: null,
      number: "87654321"
    }
  }
];

const failedTransactions = [
  ...unreadFailedTransaction,
  ...readFailedTransaction,
  {
    amount: { currency: "CAD", value: 300 },
    failureDate: "2021-06-06",
    failureReason: null,
    fromAccount: {
      name: "ATB Advantage Account",
      number: "12345678",
      nickname: null
    },
    isAcknowledged: false,
    paymentOrderDate: "2021-06-06",
    paymentOrderNumber: "00002",
    paymentType: "Transfer",
    recurringPaymentInformation: null,
    toAccount: {
      name: "Basic Account",
      nickname: null,
      number: "87654321"
    }
  },
  {
    amount: { currency: "CAD", value: 400 },
    failureDate: "2021-05-06",
    failureReason: null,
    fromAccount: {
      name: "No-Fee All-In Account",
      number: "CA-021908559-0000000720573279",
      nickname: null
    },
    isAcknowledged: false,
    paymentOrderDate: "2021-06-06",
    paymentOrderNumber: "00004",
    paymentType: "BillPayment",
    recurringPaymentInformation: null,
    payee: {
      name: "AARONS CANADA",
      nickname: "AARONS CANADA",
      customerReference: "123456789108"
    }
  }
];

const renderComponent = () =>
  act(async () => render(<FailedTransactionDrawer />));

describe("FailedTransactionDrawer - test drawer", () => {
  afterEach(() => {
    resetAtoms(
      drawerVisibleAtom,
      notificationTriggerAtom,
      failedTransactionsAtom
    );
  });

  it(">> Should not initially render drawer", async () => {
    await renderComponent();
    const { queryByText } = screen;

    const drawerTitle = queryByText("Notifications");
    expect(drawerTitle).not.toBeInTheDocument();
  });

  it(">> Should render drawer when drawerVisibleAtom is true", async () => {
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { getByAltText, getByText } = screen;

    await drawerAtom.set(true);

    const drawerTitle = getByText("Notifications");
    const closeButton = getByAltText("Close icon");

    expect(drawerTitle).toBeVisible();
    expect(closeButton).toBeVisible();
  });

  it(">> Should close drawer when close button is clicked", async () => {
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { getByAltText } = screen;

    await drawerAtom.set(true);

    const closeButton = getByAltText("Close icon");
    fireEvent.click(closeButton);

    // Drawer stays mounted, so no great way to check if its hidden
    expect(drawerAtom.get()).toBe(false);
  });

  it(">> Should display a list of failed transactions", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: failedTransactions
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { getByText } = screen;

    await drawerAtom.set(true);

    expect(getByText("A scheduled transfer of $100.00 failed.")).toBeVisible();
    expect(getByText("A scheduled transfer of $300.00 failed.")).toBeVisible();
    expect(getByText("A scheduled transfer of $50.00 failed.")).toBeVisible();
  });

  it(">> Should display `No transactions` message when no failed transactions are found", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: []
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { getByText, getByAltText } = screen;

    await drawerAtom.set(true);

    expect(getByText(failedTransactionMessages.MSG_RBFTA_006)).toBeVisible();
    expect(getByAltText("No transaction icon")).toBeVisible();
  });

  it(">> Should display `No transactions` message for a 204 No Content response", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        status: 204,
        results: ""
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { getByText, getByAltText } = screen;

    await drawerAtom.set(true);

    expect(getByText(failedTransactionMessages.MSG_RBFTA_006)).toBeVisible();
    expect(getByAltText("No transaction icon")).toBeVisible();
  });

  it(">> Should display `System Error` message when API request fails", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        error: 500
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { findByText } = screen;

    await drawerAtom.set(true);

    expect(await findByText("System Error")).toBeVisible();
  });

  it(">> Should show transaction details when transaction in list is clicked", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: failedTransactions
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { findByText, getByText } = screen;

    await drawerAtom.set(true);

    const transaction = getByText("A scheduled transfer of $100.00 failed.");
    fireEvent.click(transaction);

    expect(await findByText("From")).toBeVisible();
    expect(await findByText("ATB Advantage Account (5678)")).toBeVisible();
    expect(await findByText("To")).toBeVisible();
    expect(await findByText("Basic Account (4321)")).toBeVisible();
    expect(await findByText("Failure reason")).toBeVisible();
    expect(await findByText("Unknown")).toBeVisible();
  });

  it(">> Should hide transaction details when back button in details is clicked", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: failedTransactions
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { findByText, getByText, getByAltText, queryByText } = screen;

    await drawerAtom.set(true);

    const transaction = getByText("A scheduled transfer of $100.00 failed.");
    fireEvent.click(transaction);

    expect(await findByText("From")).toBeVisible();
    expect(await findByText("ATB Advantage Account (5678)")).toBeVisible();

    const backButton = getByAltText("Back icon");
    fireEvent.click(backButton);

    expect(queryByText("From")).not.toBeInTheDocument();
    expect(queryByText("ATB Advantage Account (5678)")).not.toBeInTheDocument();
    expect(queryByText("To")).not.toBeInTheDocument();
    expect(queryByText("Basic Account (4321)")).not.toBeInTheDocument();
    expect(queryByText("Failure reason")).not.toBeInTheDocument();
    expect(queryByText("Unknown")).not.toBeInTheDocument();
  });

  it(">> Should show Failed Payment transaction details when clicked", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: failedTransactions
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);
    const drawerAtom = await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom
    });
    const { findByText, getByText } = screen;

    await drawerAtom.set(true);

    const transaction = getByText(
      "A scheduled payment of $400.00 to AARONS CANADA (9108) failed."
    );
    fireEvent.click(transaction);

    expect(await findByText("From")).toBeVisible();
    expect(await findByText("No-Fee All-In Account (3279)")).toBeVisible();
    expect(await findByText("To")).toBeVisible();
    expect(await findByText("AARONS CANADA (9108)")).toBeVisible();
    expect(await findByText("Failure reason")).toBeVisible();
    expect(await findByText("Unknown")).toBeVisible();
  });
});
