import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import { failedTransactionsUrl } from "api";
import { mockApiData, resetAtoms } from "utils/TestUtils";
import FailedTransactionDrawer from "./FailedTransactionDrawer";
import {
  drawerVisibleAtom,
  failedTransactionsAtom,
  notificationTriggerAtom
} from "./failedTransactionAtoms";

const unreadFailedTransaction = {
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
};

const unreadFailedTransaction2 = {
  amount: { currency: "CAD", value: 200 },
  failureDate: "2021-04-14",
  failureReason: null,
  fromAccount: {
    name: "ATB Advantage Account",
    number: "12345678",
    nickname: null
  },
  isAcknowledged: false,
  paymentOrderDate: "2021-04-13",
  paymentOrderNumber: "00002",
  paymentType: "Transfer",
  recurringPaymentInformation: null,
  toAccount: {
    name: "Basic Account",
    nickname: null,
    number: "87654321"
  }
};

const renderComponent = () =>
  act(async () => render(<FailedTransactionDrawer />));

describe("FailedTransactionDrawer - test read acknowledgement", () => {
  afterEach(() => {
    resetAtoms(
      drawerVisibleAtom,
      notificationTriggerAtom,
      failedTransactionsAtom
    );
  });

  it(">> Should decrement the unread failed transfer count - one unread transaction", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: [unreadFailedTransaction]
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);

    await renderComponent();
    const { getByText, findByText, getByTestId } = screen;

    expect(
      await findByText("A scheduled transfer of $100.00 failed.")
    ).toBeVisible();

    const transaction = getByText("Review");
    fireEvent.click(transaction);

    getByTestId("unread-count-0");
  });

  it(">> Should decrement the unread failed transfer count - two unread transaction", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: [unreadFailedTransaction, unreadFailedTransaction2]
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 201
      }
    ]);

    await renderComponent();
    const { getByText, findByText, getByTestId } = screen;

    expect(await findByText("You have 2 failed transactions.")).toBeVisible();

    const review = getByText("Review");
    fireEvent.click(review);

    const transaction = getByText("A scheduled transfer of $100.00 failed.");
    fireEvent.click(transaction);

    getByTestId("unread-count-1");
  });

  it(">> Should decrement the unread failed transfer count even if the acknowledge call fails", async () => {
    mockApiData([
      {
        url: `${failedTransactionsUrl}/failedTransactions`,
        results: [unreadFailedTransaction, unreadFailedTransaction2]
      },
      {
        url: `${failedTransactionsUrl}/acknowledgedTransactions`,
        method: "POST",
        status: 500
      }
    ]);

    await renderComponent();
    const { getByText, findByText, getByTestId } = screen;

    expect(await findByText("You have 2 failed transactions.")).toBeVisible();

    const review = getByText("Review");
    fireEvent.click(review);

    const transaction = getByText("A scheduled transfer of $100.00 failed.");
    fireEvent.click(transaction);

    getByTestId("unread-count-1");
  });
});
