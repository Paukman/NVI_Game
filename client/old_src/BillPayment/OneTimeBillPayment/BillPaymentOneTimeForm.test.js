import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import MockDate from "mockdate";
import { render, fireEvent, act, screen } from "@testing-library/react";
import { RenderWithProviders } from "utils/TestUtils";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import { oneTimeBillState } from "./constants";
import BillPaymentOneTimeForm from "./BillPaymentOneTimeForm";

const renderWithMockData = async ({
  from = "",
  to = "",
  amount = "",
  when = "",
  note = "",
  loading = false,
  prepareDataForReview = () => null,
  prepareDataForPost = () => null,
  nextTab = () => null,
  checkForDoublePayments = () => null
}) => {
  renderWithMockData.propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    when: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    prepareDataForReview: PropTypes.func.isRequired,
    prepareDataForPost: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired,
    checkForDoublePayments: PropTypes.func.isRequired
  };
  return act(async () => {
    render(
      <RenderWithProviders location="/">
        <BillPaymentContext.Provider
          value={{
            oneTimeBillPay: {
              state: {
                from,
                fromAccounts: oneTimeBillState.fromAccounts,
                fromAccountsFormatted: oneTimeBillState.fromAccountsFormatted,
                billPayeesFormatted: oneTimeBillState.billPayeesFormatted,
                billPayees: oneTimeBillState.billPayees,
                to,
                amount,
                when,
                note,
                loading
              },
              prepareDataForPost,
              prepareDataForReview,
              onChange: () => null,
              creditAccountWarning: () => null,
              checkForDoublePayments
            },
            recurring: {}
          }}
        >
          <BillPaymentOneTimeForm type="create" nextTab={nextTab} />
        </BillPaymentContext.Provider>
      </RenderWithProviders>
    );
  });
};

describe(">> BillPaymentOneTimeForm", () => {
  beforeEach(() => {
    MockDate.set("2020-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should show a skeleton while loading.", async () => {
    await renderWithMockData({
      loading: true
    });
    const { getByTestId } = screen;

    const skeleton = getByTestId("bill-payment-onetime-skeleton");
    expect(skeleton).toBeVisible();
  });

  it(">> should display errors on empty fields", async () => {
    await renderWithMockData({
      from: "",
      to: "",
      amount: "",
      when: "",
      note: "note"
    });
    const { getByText } = screen;

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(getByText("Select an account.")).toBeTruthy();
    expect(getByText("Select a payee.")).toBeTruthy();
    expect(getByText("Enter an amount.")).toBeTruthy();
    expect(getByText("Select a date.")).toBeTruthy();
  });
  it(">> should call checkForDoublePayments when all data is valid  ", async () => {
    const nextTab = jest.fn();
    const checkForDoublePayments = jest.fn();
    await renderWithMockData({
      from: oneTimeBillState.from,
      to: oneTimeBillState.to,
      amount: oneTimeBillState.amount,
      when: dayjs().add(10, "day"),
      note: oneTimeBillState.note,
      nextTab,
      checkForDoublePayments
    });
    const { getByText } = screen;

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(checkForDoublePayments).toBeCalledWith(nextTab);
  });
});
