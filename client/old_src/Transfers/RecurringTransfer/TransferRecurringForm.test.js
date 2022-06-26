import React from "react";
import PropTypes from "prop-types";
import MockDate from "mockdate";
import dayjs from "dayjs";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import { TransferContext } from "../TransferProvider/TransferProvider";
import { transferStateMock, endingOptions } from "../constants";
import TransferRecurringForm from "./TransferRecurringForm";

const renderWithMockData = ({
  from = "",
  to = "",
  amount = "",
  starting = "",
  ending = null,
  frequency = "",
  numberOfTransfers = "",
  endingOption = endingOptions.never,
  endDateNoOfTransfersMessage = "",
  loading = false,
  onChange = () => null,
  prepareDataForReview = () => null,
  prepareDataForPost = () => null,
  nextTab = () => null,
  updateEndDateNoOfTransfersMessage = () => null
}) => {
  renderWithMockData.propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    starting: PropTypes.string.isRequired,
    ending: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    numberOfTransfers: PropTypes.string.isRequired,
    endingOption: PropTypes.string.isRequired,
    endDateNoOfTransfersMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    prepareDataForReview: PropTypes.func.isRequired,
    prepareDataForPost: PropTypes.func.isRequired,
    updateEndDateNoOfTransfersMessage: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired
  };
  return (
    <RenderWithProviders location="/">
      <TransferContext.Provider
        value={{
          recurringTransfer: {
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
              starting,
              ending,
              frequency,
              numberOfTransfers,
              endingOption,
              endDateNoOfTransfersMessage,
              loading
            },
            prepareDataForReview,
            prepareDataForPost,
            onChange,
            updateEndDateNoOfTransfersMessage
          }
        }}
      >
        <TransferRecurringForm nextTab={nextTab} />
      </TransferContext.Provider>
    </RenderWithProviders>
  );
};

describe(">> TransferRecurringForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2020-05-15T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> on submit with goes to the next page when all the data is valid ", async () => {
    const nextTab = jest.fn();
    const { getByText } = render(
      renderWithMockData({
        from: transferStateMock.from,
        to: transferStateMock.to,
        frequency: "weekly",
        amount: "$100.00",
        endingOption: endingOptions.never,
        starting: dayjs("May 20, 2020", "MMM DD, YYYY"),
        nextTab
      })
    );

    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(nextTab).toBeCalled();
  });

  it(">> should show a skeleton while loading.", () => {
    const { getByTestId } = render(
      renderWithMockData({
        loading: true
      })
    );
    const skeleton = getByTestId("transfer-recurring-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> should display basic error messages", async () => {
    const { getByText, getAllByText } = render(
      renderWithMockData({
        from: "",
        to: "",
        amount: "",
        frequency: "",
        starting: "",
        endingOption: endingOptions.endDate,
        ending: ""
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(getAllByText("Select an account.")).toHaveLength(2);
    expect(getByText("Enter an amount.")).toBeTruthy();
    expect(getByText("Select a frequency.")).toBeTruthy();
    expect(getAllByText("Select a transfer date.")).toHaveLength(2);
  });

  it(">> should display ending and starting error valid messages", async () => {
    const { getByText, getAllByText } = render(
      renderWithMockData({
        starting: "",
        ending: null,
        endingOption: endingOptions.endDate
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(getAllByText("Select a transfer date.")).toHaveLength(2);
  });
  it(">> should display number of transfers error messages", async () => {
    const { getByText } = render(
      renderWithMockData({
        endingOption: endingOptions.numberOfTransfers
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(getByText("Enter the number of recurring transfers.")).toBeTruthy();
  });
  it(">> should display amount validation error messages", async () => {
    const {
      getByText,
      queryByText,
      findByPlaceholderText,
      findByTestId,
      getAllByText
    } = render(
      renderWithMockData({
        from: transferStateMock.from,
        amount: "$100,000.00"
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });

    expect(
      getByText("Enter an amount no greater than $99,999.99.")
    ).toBeTruthy();
    const amountInput = await findByPlaceholderText("$");

    await act(async () => {
      fireEvent.change(amountInput, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amountInput, { target: { value: "$100.00" } });
    });

    expect(amountInput.value).toEqual("$100.00");

    expect(
      queryByText("Enter an amount no greater than $99,999.99.")
    ).toBeNull();

    await act(async () => {
      fireEvent.change(amountInput, { target: { value: "50000.00" } });
    });
    await act(async () => {
      fireEvent.blur(amountInput, { target: { value: "$50,000.00" } });
    });

    expect(
      getByText("Non-sufficient funds. Enter a lower amount.")
    ).toBeTruthy();

    // get rid of this message by changing the account
    const dropdownFrom = await findByTestId("dropdown-from");
    await act(async () => {
      fireEvent.click(dropdownFrom);
    });
    await act(async () => {
      fireEvent.click(
        getAllByText("Springboard Savings Account (1479) | $220,387.03")[0]
      );
    });

    expect(
      queryByText("Non-sufficient funds. Enter a lower amount.")
    ).toBeNull();
  });
  it(">> should display future date validation error message for start date", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        starting: dayjs("Mar 18, 2020", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await findByText("Choose a future date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        starting: dayjs("May 18, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a future date.")).toBeNull();
  });
  it(">> should display date within 12 months validation error message", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        starting: dayjs("May 15, 2021", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await findByText(
      "Choose a date within the next 12 months."
    );
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        starting: dayjs("May 14, 2021", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a date within the next 12 months.")).toBeNull();
  });
  it(">> should display date before the end date for starting validation error message", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    let errorMessage = await findByText("Choose a date before the end date.");
    expect(errorMessage).toBeTruthy();
    errorMessage = await findByText("Choose a date after the start date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("May 17, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a date before the end date.")).toBeNull();
    expect(queryByText("Choose a date after the start date.")).toBeNull();
  });
  it(">> should display date after the start date for ending validation error message", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    let errorMessage = await findByText("Choose a date before the end date.");
    expect(errorMessage).toBeTruthy();
    errorMessage = await findByText("Choose a date after the start date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jun 17, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a date before the end date.")).toBeNull();
    expect(queryByText("Choose a date after the start date.")).toBeNull();
  });
  it(">> should display future date validation error message for end date", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("May 16, 2020", "MMM DD, YYYY"),
        ending: dayjs("Mar 18, 2020", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await findByText("Choose a future date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        ending: dayjs("May 18, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a future date.")).toBeNull();
  });
  it(">> should display not beyond 999 transfers error for ending date", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        frequency: "weekly",
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jul 07, 2039", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    const errorMessage = await findByText("Enter a date before Jul 07, 2039");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        frequency: "weekly",
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jul 06, 2039", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Enter a date before Jul 07, 2039.")).toBeNull();
  });
  it(">> should disable/enable validation when switching ending option", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    let errorMessage = await findByText("Choose a date before the end date.");
    expect(errorMessage).toBeTruthy();
    errorMessage = await findByText("Choose a date after the start date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.never,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a date before the end date.")).toBeNull();
    expect(queryByText("Choose a date after the start date.")).toBeNull();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.numberOfTransfers,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Choose a date before the end date.")).toBeNull();
    expect(queryByText("Choose a date after the start date.")).toBeNull();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(nextButton);
    });
    errorMessage = await findByText("Choose a date before the end date.");
    expect(errorMessage).toBeTruthy();
    errorMessage = await findByText("Choose a date after the start date.");
    expect(errorMessage).toBeTruthy();
  });
  it(">> should display number of transfers message", async () => {
    const onChange = jest.fn();
    const updateEndDateNoOfTransfersMessage = jest.fn();

    const {
      getByText,
      findByText,
      rerender,
      queryByText,
      findByTestId
    } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jul 16, 2020", "MMM DD, YYYY"),
        endDateNoOfTransfersMessage: "Number of transfers: 5",
        onChange,
        updateEndDateNoOfTransfersMessage
      })
    );

    const frequencyDrowdown = await findByTestId("dropdown-frequency");
    await act(async () => {
      fireEvent.click(frequencyDrowdown);
    });
    await act(async () => {
      fireEvent.click(getByText("Every two weeks"));
    });
    expect(onChange).toBeCalled();
    expect(updateEndDateNoOfTransfersMessage).toBeCalled();

    const errorMessage = await findByText("Number of transfers: 5");
    expect(errorMessage).toBeTruthy();

    // if there is an error message should not be there
    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jul 20, 2020", "MMM DD, YYYY"), // set the date before the end date
        ending: dayjs("Jul 16, 2020", "MMM DD, YYYY"),
        endDateNoOfTransfersMessage: "Number of transfers: 5",
        onChange,
        updateEndDateNoOfTransfersMessage
      })
    );

    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("Number of transfers: 5")).toBeNull();
  });
  it(">> should display end date message", async () => {
    const onChange = jest.fn();
    const updateEndDateNoOfTransfersMessage = jest.fn();

    const {
      getByText,
      findByText,
      rerender,
      queryByText,
      findByTestId
    } = render(
      renderWithMockData({
        endingOption: endingOptions.numberOfTransfers,
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        numberOfTransfers: 10,
        endDateNoOfTransfersMessage: "End date: Sep 18, 2020",
        onChange,
        updateEndDateNoOfTransfersMessage
      })
    );

    const frequencyDropdown = await findByTestId("dropdown-frequency");
    await act(async () => {
      fireEvent.click(frequencyDropdown);
    });
    await act(async () => {
      fireEvent.click(getByText("Every two weeks"));
    });
    expect(onChange).toBeCalled();
    expect(updateEndDateNoOfTransfersMessage).toBeCalled();

    const errorMessage = await findByText("End date: Sep 18, 2020");
    expect(errorMessage).toBeTruthy();

    // if there is an error, message should not be there
    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Mar 20, 2020", "MMM DD, YYYY"), // set the date before the end date
        numberOfTransfers: 10,
        onChange,
        updateEndDateNoOfTransfersMessage
      })
    );

    const nextButton = getByText("Next");
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(queryByText("End date: Sep 18, 2020")).toBeNull();
  });
  it(">> should switch between never, end date and number of transfers", async () => {
    const onChange = jest.fn();

    const { getByText, rerender, queryByTestId, findByTestId } = render(
      renderWithMockData({
        endingOption: endingOptions.never,
        onChange
      })
    );

    expect(queryByTestId("date-ending")).toBeNull();
    expect(queryByTestId("number-of-transfers")).toBeNull();
    const endDateButton = getByText("End date", { exact: true });
    await act(async () => {
      fireEvent.click(endDateButton);
    });
    expect(onChange).toBeCalled();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        onChange
      })
    );

    const endingInput = await findByTestId("date-ending");
    expect(endingInput).toBeTruthy();
    expect(queryByTestId("number-of-transfers")).toBeNull();

    const noOfPaymentsButton = getByText("No. of transfers", { exact: true });
    await act(async () => {
      fireEvent.click(noOfPaymentsButton);
    });
    expect(onChange).toBeCalled();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.numberOfTransfers,
        onChange
      })
    );

    const numberOfTransfers = await findByTestId("number-of-transfers");
    expect(numberOfTransfers).toBeTruthy();
    expect(queryByTestId("date-ending")).toBeNull();

    const neverButton = getByText("Never", { exact: true });
    await act(async () => {
      fireEvent.click(neverButton);
    });
    expect(onChange).toBeCalled();
  });
});
