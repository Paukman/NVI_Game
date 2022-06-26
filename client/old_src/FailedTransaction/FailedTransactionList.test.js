import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { failedTransactionMessages } from "utils/MessageCatalog";
import FailedTransactionList from "./FailedTransactionList";

const mockedTransactions = {
  "2021-02-10": [{ id: "02", isAcknowledged: true, desc: "Failure 2" }],
  "2020-04-30": [{ id: "01", isAcknowledged: false, desc: "Failure 1" }],
  "2021-04-30": [
    { id: "04", isAcknowledged: true, desc: "Failure 4" },
    { id: "05", isAcknowledged: false, desc: "Failure 5" }
  ],
  "2021-04-10": [{ id: "03", isAcknowledged: false, desc: "Failure 3" }]
};

const defaultProps = {
  failedTransactions: mockedTransactions,
  onClick: jest.fn()
};

const renderComponent = (props = {}) =>
  render(<FailedTransactionList {...defaultProps} {...props} />);

describe("FailedTransactionList", () => {
  it(">> Should render a list of failed transactions", () => {
    renderComponent();
    const { getByText, getAllByText } = screen;

    const transactions = getAllByText("Failed Transaction");

    expect(getByText("Apr 30, 2021")).toBeVisible();
    expect(getByText("Failure 1")).toBeVisible();
    expect(transactions.length).toBe(5);
  });

  it(">> Should sort the list of failed transactions from newest to oldest", () => {
    renderComponent();
    const { getAllByTestId } = screen;
    const dateRows = getAllByTestId("failed-transaction-date-row");

    expect(dateRows.length).toBe(4);
    expect(dateRows[0]).toHaveTextContent("Apr 30, 2021");
    expect(dateRows[1]).toHaveTextContent("Apr 10, 2021");
    expect(dateRows[2]).toHaveTextContent("Feb 10, 2021");
    expect(dateRows[3]).toHaveTextContent("Apr 30, 2020");
  });

  it(">> Should show a red dot by each unread transaction", () => {
    renderComponent();
    const { getAllByTestId } = screen;
    const unreadTransactions = getAllByTestId("failed-transaction-unread-dot");

    expect(unreadTransactions.length).toBe(3);
  });

  it(">> Should call `onClick` when a transaction is clicked", () => {
    const transaction = {
      id: "06",
      isAcknowledged: false,
      desc: "New failed transaction"
    };
    const onClick = jest.fn();

    renderComponent({
      onClick,
      failedTransactions: { "2020-04-05": [transaction] }
    });
    const { getByText } = screen;

    const transactionRow = getByText("New failed transaction");
    fireEvent.click(transactionRow);

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(transaction);
  });

  it(">> Should render a `no notifications` message if no failed transactions exist", () => {
    renderComponent({ failedTransactions: undefined });
    const { getByText, getByAltText, queryByText } = screen;

    expect(getByAltText("No transaction icon")).toBeVisible();
    expect(
      getByText(failedTransactionMessages.MSG_RBFTA_006_TITLE)
    ).toBeVisible();
    expect(getByText(failedTransactionMessages.MSG_RBFTA_006)).toBeVisible();
    expect(queryByText("Failed Transaction")).not.toBeInTheDocument();
  });
});
