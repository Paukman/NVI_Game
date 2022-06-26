import React from "react";
import PropTypes from "prop-types";
import MockDate from "mockdate";
import dayjs from "dayjs";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { transferStateMock } from "../constants";
import TransferOneTimeForm from "./TransferOneTimeForm";

const renderWithMockData = ({
  from = "",
  to = "",
  amount = "",
  when = "",
  loading = false,
  prepareDataForReview = () => null,
  prepareDataForPost = () => null,
  onChange = () => null,
  nextTab = () => null
}) => {
  renderWithMockData.propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    when: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    prepareDataForReview: PropTypes.func.isRequired,
    prepareDataForPost: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };
  return (
    <RenderWithProviders location="/">
      <TransferContext.Provider
        value={{
          oneTimeTransfer: {
            state: {
              from,
              fromAccounts: transferStateMock.fromAccounts,
              fromAccountsFormatted: transferStateMock.fromAccountsFormatted,
              toAccounts: transferStateMock.toAccounts,
              toAccountsFormatted: transferStateMock.toAccountsFormatted,
              immediateTransferAccounts: transferStateMock.toAccountsFormatted,
              futureDatedTransferAccounts:
                transferStateMock.futureDatedTransferAccounts,
              recurringAccounts: transferStateMock.recurringAccounts,
              primary: transferStateMock.primary,
              to,
              amount,
              when,
              loading,
              exchangeRateFormatted: true
            },
            prepareDataForPost,
            prepareDataForReview,
            onChange
          },
          recurringTransfer: {}
        }}
      >
        <TransferOneTimeForm nextTab={nextTab} />
      </TransferContext.Provider>
    </RenderWithProviders>
  );
};

describe(">> TransferOneTimeForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2020-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should show a skeleton while loading.", () => {
    const { getByTestId } = render(
      renderWithMockData({
        loading: true
      })
    );
    const skeleton = getByTestId("transfer-onetime-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> on submit with goes to the next page when all the data is valid ", async () => {
    const nextTab = jest.fn();
    const { getByText } = render(
      renderWithMockData({
        from: transferStateMock.from,
        to: transferStateMock.to,
        amount: "$100.00",
        when: dayjs("May 15, 2020", "MMM DD, YYYY"),
        nextTab
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(nextTab).toBeCalled();
  });
  it(">> should display basic error messages", async () => {
    const { getByText, getAllByText } = render(
      renderWithMockData({
        from: "",
        to: "",
        amount: "",
        when: ""
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(getAllByText("Select an account.")).toHaveLength(2);
    expect(getByText("Enter an amount.")).toBeTruthy();
    expect(getByText("Select a transfer date.")).toBeTruthy();
  });

  it(">> should render exchange rate", async () => {
    const { findByText } = render(
      renderWithMockData({
        from: transferStateMock.from,
        to: transferStateMock.to,
        amount: "$100.00",
        when: dayjs("May 15, 2020", "MMM DD, YYYY")
      })
    );
    const exchangeRate = await findByText("Foreign exchange rate");
    expect(exchangeRate).toBeTruthy();
  });
});
