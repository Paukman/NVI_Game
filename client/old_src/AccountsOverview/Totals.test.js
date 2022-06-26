import React from "react";
import { render } from "@testing-library/react";
import Totals from "./Totals";

describe("AccountsOverview", () => {
  it("should render 5 total cards in total", () => {
    const mockTotalData = {
      depositTotals: {
        CAD: 4324965.3,
        USD: 4000530.2
      },
      investmentTotals: {
        CAD: 12002.95
      },
      loanTotals: {
        CAD: 537050.12
      },
      creditCardTotals: {
        CAD: -200007.03,
        USD: -14.4
      },
      prepaidCardTotals: {
        CAD: 100.0,
        USD: 50.0
      }
    };

    const { getByTestId } = render(<Totals totals={mockTotalData} />);

    expect(getByTestId("deposit-card-total")).toBeVisible();
    expect(getByTestId("loan-card-total")).toBeVisible();
    expect(getByTestId("investment-card-total")).toBeVisible();
    expect(getByTestId("creditcard-card-total")).toBeVisible();
    expect(getByTestId("prepaidcard-card-total")).toBeVisible();
  });

  it("should only render total cards that are provided", () => {
    const mockTotalData = {
      depositTotals: {
        CAD: 4324965.3,
        USD: 4000530.2
      },
      investmentTotals: {},
      loanTotals: {},
      creditCardTotals: {
        CAD: -200007.03,
        USD: -14.4
      },
      prepaidCardTotals: {}
    };

    const { getByTestId, queryByTestId } = render(
      <Totals totals={mockTotalData} />
    );

    expect(getByTestId("deposit-card-total")).toBeVisible();
    expect(getByTestId("creditcard-card-total")).toBeVisible();
    expect(queryByTestId("investment-card-total")).not.toBeInTheDocument();
    expect(queryByTestId("loan-card-total")).not.toBeInTheDocument();
    expect(queryByTestId("prepaidcard-card-total")).not.toBeInTheDocument();
  });

  it("should display currency when there is more than CAD in the total", () => {
    const mockTotalData = {
      depositTotals: {
        CAD: 4324965.3,
        USD: 4000530.2
      },
      investmentTotals: {
        CAD: 281923.9
      },
      loanTotals: {},
      creditCardTotals: {},
      prepaidCardTotals: {}
    };

    const { getByText, getAllByText } = render(
      <Totals totals={mockTotalData} />
    );

    expect(getAllByText("CAD")).toHaveLength(2);
    expect(getByText("USD")).toBeVisible();
  });

  it("should not display CAD when there isn't other currency in the total", () => {
    const mockTotalData = {
      depositTotals: {
        CAD: 4324965.3
      },
      investmentTotals: {},
      loanTotals: {},
      creditCardTotals: {},
      prepaidCardTotals: {}
    };

    const { queryByText } = render(<Totals totals={mockTotalData} />);

    expect(queryByText("CAD")).not.toBeInTheDocument();
    expect(queryByText("USD")).not.toBeInTheDocument();
  });
});
