import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { render as domRender, unmountComponentAtNode } from "react-dom";
import MobileTransactions from "./MobileTransactions";

let component = null;

describe("MobileTransactions", () => {
  const props = {
    id: "details-creditcard-transactions-container",
    title: "Pending transactions",
    transactionsData: [
      {
        transactionId: null,
        transactionDate: "2019-10-22T06:00:00.000Z",
        netAmount: {
          currency: null,
          value: 0.5
        },
        transactionStatus: "Pending",
        accountingEffectType: "Debit",
        description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
        key: "ef6898c9014d10de8b1880d98ed028b7"
      }
    ]
  };

  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    domRender(<MobileTransactions {...props} />, component);
  });
  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });
  it(">> Verify presence of title, and value", () => {
    const title = component.querySelector(
      "#details-creditcard-transactions-container-title-pending"
    );
    expect(title.textContent).toEqual("Pending transactions");
  });

  it(">> Verify presence of date, and value", () => {
    const date = component.querySelector(
      "#details-creditcard-transactions-container-date-0"
    );
    expect(date.textContent).toEqual("Oct 22, 2019");
  });

  it(">> Verify presence of description, and value", () => {
    const description = component.querySelector(
      "#details-creditcard-transactions-container-description-0-0"
    );
    expect(description.textContent).toEqual(
      "CAT RIGHT TIME PAYMENTS CALGARY AB"
    );
  });

  it(">> Verify presence of value, and value", () => {
    const value = component.querySelector(
      "span#details-creditcard-transactions-container-value-0-0"
    );
    expect(value.textContent).toEqual("$0.50");
  });
});

describe("Verify Posted Credit Transactions", () => {
  const postedProps = {
    id: "details-creditcard-transactions-container",
    title: "Posted transactions",
    transactionsData: [
      {
        transactionId: null,
        transactionDate: "2019-10-22T06:00:00.000Z",
        netAmount: {
          currency: null,
          value: 0.5
        },
        transactionStatus: "Posted",
        accountingEffectType: "Credit",
        description: "CAT RIGHT TIME PAYMENTS CALGARY AB",
        key: "ef6898c9014d10de8b1880d98ed028b7"
      }
    ]
  };

  beforeEach(() => {
    component = document.createElement("div");
    document.body.appendChild(component);

    domRender(<MobileTransactions {...postedProps} />, component);
  });
  afterEach(() => {
    unmountComponentAtNode(component);
    component.remove();
    component = null;
  });

  it(">> Verify title is Posted", () => {
    const postedTitle = component.querySelector(
      "#details-creditcard-transactions-container-title-posted"
    );
    expect(postedTitle.textContent).toEqual("Posted transactions");
  });

  it(">> Verify classname = green credit", () => {
    const postedValue = component.querySelector("span.green.credit");

    expect(postedValue.toExist);
  });
});

describe("Show cross currency transaction details", () => {
  const fxProps = {
    id: "details-creditcard-transactions-container",
    title: "Posted transactions",
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
    await act(async () => render(<MobileTransactions {...fxProps} />));
    const { findByText, getByText } = screen;

    const transactionRow = getByText("CAT RIGHT TIME PAYMENTS CALGARY AB");
    await act(async () => {
      fireEvent.click(transactionRow);
    });

    expect(await findByText("Converted amount")).toBeVisible();
    expect(await findByText("Foreign exchange rate")).toBeVisible();
  });

  it(">> Should hide FX transfer dropdown when its row is clicked twice", async () => {
    await act(async () => render(<MobileTransactions {...fxProps} />));
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
