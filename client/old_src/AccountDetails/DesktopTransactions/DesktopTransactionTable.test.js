import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { render as domRender, unmountComponentAtNode } from "react-dom";
import DesktopTransactionTable from "./DesktopTransactionTable";

let component = null;
const props = {
  id: "details-creditcard-transactions-container",
  tableId: "0",
  transactionsType: "loan",
  title: "Pending transactions",
  transactionsData: [
    {
      transactionId: "37152c6be3e616310fd8cd9ac47ad817",
      transactionDate: "2019-10-22T06:00:00.000",
      netAmount: {
        currency: null,
        value: 1.8
      },
      runningBalance: {
        currency: null,
        value: 0.0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "37152c6be3e616310fd8cd9ac47ad817"
    },
    {
      transactionId: "12345c6be3e616323fd8232ac47ad817",
      transactionDate: "2019-10-21T06:00:00.000",
      netAmount: {
        currency: "CAD",
        value: 1234.58
      },
      runningBalance: {
        currency: null,
        value: 0
      },
      transactionStatus: "Pending",
      accountingEffectType: "Credit",
      description: "Transaction type info",
      key: "12345c6be3e616323fd8232ac47ad817"
    }
  ],
  isLoading: false
};
describe("DesktopTransactions", () => {
  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    domRender(<DesktopTransactionTable {...props} />, component);
  });
  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });

  /* TITLE section */
  it(">> Verify presence of title, and value", () => {
    const title = component.querySelector(
      "#details-creditcard-transactions-container-title-0"
    );
    expect(title.textContent).toEqual("Pending transactions");
  });

  /* COLUMN Value Tests */
  it(">> Verify presence of date, and value, multi-row", () => {
    const date2 = component.querySelector(
      "p#details-creditcard-transactions-container-date-0-1"
    );
    expect(date2.textContent).toEqual("Oct 21, 2019");
  });

  it(">> Verify presence of date, and value", () => {
    const date = component.querySelector(
      "p#details-creditcard-transactions-container-date-0-0"
    );
    expect(date.textContent).toEqual("Oct 22, 2019");
  });

  it(">> Verify presence of description, and value", () => {
    const description = component.querySelector(
      "#details-creditcard-transactions-container-description-0-0"
    );
    expect(description.textContent).toEqual("Transaction type info");
  });
  it(">> Verify presence of amount, and value", () => {
    const amount = component.querySelector(
      "span#details-creditcard-transactions-container-value-amount-0-0"
    );
    expect(amount.textContent).toEqual("+ $1.80");
  });

  it(">> Verify presence of balance, and value", () => {
    const description = component.querySelector(
      "span#details-creditcard-transactions-container-value-balance-0-0"
    );
    // TODO: balance is currently hard coded needs API change
    expect(description.textContent).toEqual("$0.00");
  });
});

describe("> Skeleton State", () => {
  const skeletonProps = {
    id: "details-creditcard-transactions-container",
    tableId: "0",
    transactionsType: "loan",
    title: "Pending transactions",
    transactionsData: [],
    isLoading: true
  };

  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    domRender(<DesktopTransactionTable {...skeletonProps} />, component);
  });

  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });

  it(">> Skeleton presence", () => {
    const skeleton = component.querySelector(".transaction-skeleton-row");

    expect(skeleton).toBeTruthy();
  });
});

describe("Show cross currency transaction details", () => {
  const fxProps = {
    id: "details-creditcard-transactions-container",
    tableId: "table-id",
    title: "Posted transactions",
    isLoading: false,
    transactionsData: [
      {
        transactionId: null,
        transactionDate: "2019-10-22T06:00:00.000Z",
        exRateNet: "1.25",
        transactionAmount: { value: 2.5, currency: "CAD" },
        netAmount: { value: 2, currency: "USD" },
        transactionStatus: "Posted",
        accountingEffectType: "Credit",
        description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
        key: "ef6898c9014d10de8b1880d98ed028b7"
      }
    ]
  };

  it(">> Should display FX transfer dropdown on row click", async () => {
    await act(async () => render(<DesktopTransactionTable {...fxProps} />));
    const { findByText, getByText } = screen;

    const transactionRow = getByText("CAT RIGHT TIME PAYMENTS CALGARY AB");
    await act(async () => {
      fireEvent.click(transactionRow);
    });

    expect(await findByText("FX Transfer")).toBeVisible();
    expect(await findByText("Converted amount")).toBeVisible();
    expect(await findByText("Foreign exchange rate")).toBeVisible();
  });

  it(">> Should hide FX transfer dropdown when its row is clicked twice", async () => {
    await act(async () => render(<DesktopTransactionTable {...fxProps} />));
    const { findByText, getByText, queryByText } = screen;

    const transactionRow = getByText("CAT RIGHT TIME PAYMENTS CALGARY AB");
    await act(async () => {
      fireEvent.click(transactionRow);
    });

    expect(await findByText("Converted amount")).toBeVisible();

    await act(async () => {
      fireEvent.click(transactionRow);
    });

    expect(queryByText("Converted amount")).not.toBeVisible();
  });
});
