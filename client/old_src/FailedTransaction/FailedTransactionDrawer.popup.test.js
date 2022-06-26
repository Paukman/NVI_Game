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
  }
];

const renderComponent = () =>
  act(async () => render(<FailedTransactionDrawer />));

describe("FailedTransactionDrawer - test notification popup", () => {
  afterEach(() => {
    resetAtoms(
      drawerVisibleAtom,
      notificationTriggerAtom,
      failedTransactionsAtom
    );
  });

  it(">> Should not display a notification popup for no unread failed transactions", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: readFailedTransaction
      }
    ]);
    await renderComponent();
    const { queryByRole, queryByText } = screen;

    const notificationTitle = queryByText("Failed Transaction");
    const notificationButton = queryByRole("button", { name: "Review" });

    expect(notificationTitle).not.toBeInTheDocument();
    expect(notificationButton).not.toBeInTheDocument();
  });

  it(">> Should not display a notification popup if drawer is open", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: unreadFailedTransaction
      }
    ]);
    await renderWithAtom(<FailedTransactionDrawer />, {
      atom: drawerVisibleAtom,
      initialState: true
    });
    const { queryByRole } = screen;

    const notificationButton = queryByRole("button", { name: "Review" });

    expect(notificationButton).not.toBeInTheDocument();
  });

  it(">> Should display a notification popup for a single unread failed transaction", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: unreadFailedTransaction
      }
    ]);
    await renderComponent();
    const { findByText } = screen;

    const notification = await findByText(
      "A scheduled transfer of $100.00 failed."
    );
    expect(notification).toBeVisible();
  });

  it(">> Should display a notification popup for multiple unread failed transactions", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: failedTransactions
      }
    ]);
    await renderComponent();
    const { findByText } = screen;

    const notification = await findByText(
      failedTransactionMessages.MSG_RBFTA_000(2)
    );
    expect(notification).toBeVisible();
  });

  it(">> Should open drawer when notification review button is clicked", async () => {
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
    await renderComponent();
    const { findByText, findByRole, queryByText } = screen;

    let drawerTitle = queryByText("Notifications");
    expect(drawerTitle).not.toBeInTheDocument();

    const notificationButton = await findByRole("button", { name: "Review" });
    fireEvent.click(notificationButton);

    drawerTitle = await findByText("Notifications");
    expect(drawerTitle).toBeVisible();
  });

  it(">> Should open drawer to transaction detail when notification review button is clicked for single transaction", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: unreadFailedTransaction
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);
    await renderComponent();
    const { findByText, findByRole, getByText, queryByText } = screen;

    let drawerTitle = queryByText("Notifications");
    expect(drawerTitle).not.toBeInTheDocument();

    const notificationButton = await findByRole("button", { name: "Review" });
    fireEvent.click(notificationButton);

    drawerTitle = await findByText("Notifications");
    expect(drawerTitle).toBeVisible();

    expect(getByText("From")).toBeVisible();
    expect(getByText("ATB Advantage Account (5678)")).toBeVisible();
    expect(getByText("Amount")).toBeVisible();
    expect(getByText("$100.00")).toBeVisible();
  });

  it(">> Should close notification when close button is clicked", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: unreadFailedTransaction
      }
    ]);
    await renderComponent();
    const { findByAltText, findByText, queryByText } = screen;

    let notificationTitle = await findByText("Failed Transaction");
    expect(notificationTitle).toBeVisible();

    const closeButton = await findByAltText("Close icon");
    fireEvent.click(closeButton);

    notificationTitle = queryByText("Failed Transaction");
    expect(notificationTitle).not.toBeInTheDocument();
  });
});
