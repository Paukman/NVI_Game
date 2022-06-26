import React from "react";
import PropTypes from "prop-types";
import { render, fireEvent, act } from "@testing-library/react";
import { RenderWithProviders, windowMatchMediaMock } from "utils/TestUtils";
import dayjs from "dayjs";
import MockDate from "mockdate";

import BillPaymentRecurringForm from "./BillPaymentRecurringForm";
import { BillPaymentContext } from "../BillPaymentProvider/BillPaymentProvider";
import {
  recurringBillState,
  recurringBillStateWitCreditCard
} from "./constants";
import { endingOptions } from "../constants";

const renderWithMockData = ({
  from = "",
  to = "",
  amount = "",
  starting = "",
  ending = null,
  frequency = "",
  numberOfPayments = "",
  endingOption = endingOptions.never,
  note = "",
  endDateNoOfPaymentsMessage = "",
  loading = false,
  onChange = () => null,
  prepareDataForReview = () => null,
  prepareDataForPost = () => null,
  nextTab = () => null,
  updateEndDateNoOfPaymentsMessage = () => null,
  creditAccountWarning = () => null
}) => {
  renderWithMockData.propTypes = {
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    starting: PropTypes.string.isRequired,
    note: PropTypes.string.isRequired,
    ending: PropTypes.string.isRequired,
    frequency: PropTypes.string.isRequired,
    numberOfPayments: PropTypes.string.isRequired,
    endingOption: PropTypes.string.isRequired,
    endDateNoOfPaymentsMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    prepareDataForReview: PropTypes.func.isRequired,
    prepareDataForPost: PropTypes.func.isRequired,
    updateEndDateNoOfPaymentsMessage: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    nextTab: PropTypes.func.isRequired,
    creditAccountWarning: PropTypes.func.isRequired
  };
  return (
    <RenderWithProviders location="/">
      <BillPaymentContext.Provider
        value={{
          recurringBillPay: {
            state: {
              from,
              fromAccounts: recurringBillState.fromAccounts,
              fromAccountsFormatted: recurringBillState.fromAccountsFormatted,
              billPayeesFormatted: recurringBillState.billPayeesFormatted,
              billPayees: recurringBillState.billPayees,
              to,
              amount,
              starting,
              note,
              ending,
              frequency,
              numberOfPayments,
              endingOption,
              endDateNoOfPaymentsMessage,
              loading
            },
            prepareDataForReview,
            prepareDataForPost,
            onChange,
            updateEndDateNoOfPaymentsMessage,
            creditAccountWarning
          }
        }}
      >
        <BillPaymentRecurringForm nextTab={nextTab} />
      </BillPaymentContext.Provider>
    </RenderWithProviders>
  );
};

describe("Testing BillPaymentRecurringForm", () => {
  beforeEach(() => {
    windowMatchMediaMock();
    MockDate.set("2020-05-15T10:20:30Z");
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
    const skeleton = getByTestId("bill-payment-recurring-skeleton");
    expect(skeleton).toBeInTheDocument();
  });

  it(">> should display basic error messages", async () => {
    const { getByText } = render(
      renderWithMockData({
        from: "",
        to: "",
        amount: "",
        frequency: "",
        starting: ""
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(getByText("Select an account.")).toBeTruthy();
    expect(getByText("Select a payee.")).toBeTruthy();
    expect(getByText("Enter an amount.")).toBeTruthy();
    expect(getByText("Select a date.")).toBeTruthy();
    expect(getByText("Select a frequency.")).toBeTruthy();
  });
  it(">> should display ending and starting error valid messages", async () => {
    const { getByText, getAllByText } = render(
      renderWithMockData({
        starting: "",
        ending: null,
        endingOption: endingOptions.endDate
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(getAllByText("Select a date.", { exact: true })).toHaveLength(2);
  });
  it(">> should display number of payments error messages", async () => {
    const { getByText } = render(
      renderWithMockData({
        endingOption: endingOptions.numberOfPayments
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(getByText("Enter a number of payments from 1-999.")).toBeTruthy();
  });
  it(">> should display amount validation error messages", async () => {
    const {
      getByText,
      queryByText,
      findByPlaceholderText,
      findByTestId
    } = render(
      renderWithMockData({
        from: recurringBillState.from,
        amount: "$100,000.00"
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(getByText("No-Fee All-In Account (7679) - $89,499.46"));
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
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    const errorMessage = await findByText("Choose a future date.");
    expect(errorMessage).toBeTruthy();

    rerender(
      renderWithMockData({
        starting: dayjs("May 18, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(queryByText("Choose a future date.")).toBeNull();
  });
  it(">> should display date within 12 months validation error message", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        starting: dayjs("May 15, 2021", "MMM DD, YYYY")
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
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
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
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
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
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
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
    });
    expect(queryByText("Choose a future date.")).toBeNull();
  });
  it(">> should display not beyond 999 payments error for ending date", async () => {
    const { getByText, findByText, rerender, queryByText } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        frequency: "weekly",
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jul 07, 2039", "MMM DD, YYYY")
      })
    );
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
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
    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
    });
    expect(queryByText("Choose a date before the end date.")).toBeNull();
    expect(queryByText("Choose a date after the start date.")).toBeNull();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.numberOfPayments,
        starting: dayjs("Jun 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("May 30, 2020", "MMM DD, YYYY")
      })
    );
    await act(async () => {
      fireEvent.click(submitButton);
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
      fireEvent.click(submitButton);
    });
    errorMessage = await findByText("Choose a date before the end date.");
    expect(errorMessage).toBeTruthy();
    errorMessage = await findByText("Choose a date after the start date.");
    expect(errorMessage).toBeTruthy();
  });
  it(">> should display number of payments message", async () => {
    const onChange = jest.fn();
    const updateEndDateNoOfPaymentsMessage = jest.fn();

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
        endDateNoOfPaymentsMessage: "Number of payments: 5",
        onChange,
        updateEndDateNoOfPaymentsMessage
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
    expect(updateEndDateNoOfPaymentsMessage).toBeCalled();

    const errorMessage = await findByText("Number of payments: 5");
    expect(errorMessage).toBeTruthy();

    // if there is an error message should not be there
    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Jul 20, 2020", "MMM DD, YYYY"), // set the date before the end date
        ending: dayjs("Jul 16, 2020", "MMM DD, YYYY"),
        endDateNoOfPaymentsMessage: "Number of payments: 5",
        onChange,
        updateEndDateNoOfPaymentsMessage
      })
    );

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(queryByText("Number of payments: 5")).toBeNull();
  });
  it(">> should display end date message", async () => {
    const onChange = jest.fn();
    const updateEndDateNoOfPaymentsMessage = jest.fn();

    const {
      getByText,
      findByText,
      rerender,
      queryByText,
      findByTestId
    } = render(
      renderWithMockData({
        endingOption: endingOptions.numberOfPayments,
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        numberOfPayments: 10,
        endDateNoOfPaymentsMessage: "End date: Sep 18, 2020",
        onChange,
        updateEndDateNoOfPaymentsMessage
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
    expect(updateEndDateNoOfPaymentsMessage).toBeCalled();

    const errorMessage = await findByText("End date: Sep 18, 2020");
    expect(errorMessage).toBeTruthy();

    // if there is an error, message should not be there
    rerender(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("Mar 20, 2020", "MMM DD, YYYY"), // set the date before the end date
        numberOfPayments: 10,
        onChange,
        updateEndDateNoOfPaymentsMessage
      })
    );

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(queryByText("End date: Sep 18, 2020")).toBeNull();
  });
  it(">> should switch between never, end date and number of payments", async () => {
    const onChange = jest.fn();

    const { getByText, rerender, queryByTestId, findByTestId } = render(
      renderWithMockData({
        endingOption: endingOptions.never,
        onChange
      })
    );

    expect(queryByTestId("date-ending")).toBeNull();
    expect(queryByTestId("number-of-payments")).toBeNull();
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
    expect(queryByTestId("number-of-payments")).toBeNull();

    const noOfPaymentsButton = getByText("No. of payments", { exact: true });
    await act(async () => {
      fireEvent.click(noOfPaymentsButton);
    });
    expect(onChange).toBeCalled();

    rerender(
      renderWithMockData({
        endingOption: endingOptions.numberOfPayments,
        onChange
      })
    );

    const numberOfPayments = await findByTestId("number-of-payments");
    expect(numberOfPayments).toBeTruthy();
    expect(queryByTestId("date-ending")).toBeNull();

    const neverButton = getByText("Never", { exact: true });
    await act(async () => {
      fireEvent.click(neverButton);
    });
    expect(onChange).toBeCalled();
  });
  it(">> should call onChange", async () => {
    // list from, to, frequency, starting, ending, ending options, note, no of payments
    const onChange = jest.fn();

    const {
      getByText,
      rerender,
      findByTestId,
      getAllByText,
      findByPlaceholderText
    } = render(
      renderWithMockData({
        endingOption: endingOptions.endDate,
        starting: dayjs("May 15, 2020", "MMM DD, YYYY"),
        ending: dayjs("Jul 16, 2020", "MMM DD, YYYY"),
        onChange
      })
    );
    const dropdownFrom = await findByTestId("dropdown-from");
    await act(async () => {
      fireEvent.click(dropdownFrom);
    });
    await act(async () => {
      fireEvent.click(
        getAllByText("No-Fee All-In Account (7679) - $89,499.46")[1]
      );
    });
    expect(onChange).toBeCalledTimes(1);

    const dropdownTo = await findByTestId("dropdown-to");
    await act(async () => {
      fireEvent.click(dropdownTo);
    });
    await act(async () => {
      fireEvent.click(getByText("WESTBURNE WEST (0056)"));
    });
    expect(onChange).toBeCalledTimes(2);

    const frequencyDrowdown = await findByTestId("dropdown-frequency");
    await act(async () => {
      fireEvent.click(frequencyDrowdown);
    });
    await act(async () => {
      fireEvent.click(getByText("Every two weeks"));
    });
    expect(onChange).toBeCalledTimes(3);

    const amountInput = await findByPlaceholderText("$");

    await act(async () => {
      fireEvent.change(amountInput, { target: { value: "$100.00" } });
    });
    await act(async () => {
      fireEvent.blur(amountInput, { target: { value: "$100.00" } });
    });
    expect(onChange).toBeCalledTimes(5);

    let endingOptionButton = getByText("End date", { exact: true });
    await act(async () => {
      fireEvent.click(endingOptionButton);
    });
    expect(onChange).toBeCalledTimes(6);

    endingOptionButton = getByText("No. of payments", { exact: true });
    await act(async () => {
      fireEvent.click(endingOptionButton);
    });
    expect(onChange).toBeCalledTimes(7);

    endingOptionButton = getByText("Never", { exact: true });
    await act(async () => {
      fireEvent.click(endingOptionButton);
    });
    expect(onChange).toBeCalledTimes(8);

    rerender(
      renderWithMockData({
        endingOption: endingOptions.numberOfPayments,
        onChange
      })
    );
    const numberOfPayments = await findByTestId("number-of-payments");
    await act(async () => {
      fireEvent.change(numberOfPayments, { target: { value: "10" } });
    });
    expect(onChange).toBeCalledTimes(9);

    const dateStarting = await findByTestId("date-starting");
    await act(async () => {
      fireEvent.mouseDown(dateStarting);
      fireEvent.change(dateStarting, {
        target: { value: "May 30, 2020" }
      });
    });
    await act(async () => {
      fireEvent.click(
        document.querySelectorAll(".ant-picker-cell-selected")[0]
      );
    });
    expect(onChange).toBeCalledTimes(10);
    await act(async () => {
      rerender(
        renderWithMockData({
          endingOption: endingOptions.endDate,
          onChange
        })
      );
    });
    const dateEnding = await findByTestId("date-ending");
    await act(async () => {
      fireEvent.mouseDown(dateEnding);
      fireEvent.change(dateEnding, {
        target: { value: "Feb 10, 2019" }
      });
    });
    await act(async () => {
      fireEvent.click(
        document.querySelectorAll(".ant-picker-cell-selected")[0]
      );
    });
    expect(onChange).toBeCalledTimes(11);
  });

  it(">> should go to the next page when validation returns no errors", async () => {
    const nextTab = jest.fn();

    const { getByText } = render(
      renderWithMockData({
        from: recurringBillState.fromAccountsFormatted[0].key,
        to: recurringBillState.to,
        frequency: "weekly",
        amount: "$100.00",
        endingOption: endingOptions.never,
        starting: dayjs("May 16, 2020", "MMM DD, YYYY"),
        note: "note",
        nextTab
      })
    );

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(nextTab).toBeCalled();
  });

  it(">> should show credit card warning if from selected as credit card account", async () => {
    const creditAccountWarning = jest.fn();

    const { getByText } = render(
      renderWithMockData({
        from: recurringBillStateWitCreditCard.fromAccountsFormatted[2].key,
        to: recurringBillStateWitCreditCard.to,
        frequency: "weekly",
        amount: "$100.00",
        endingOption: endingOptions.never,
        starting: dayjs("May 16, 2020", "MMM DD, YYYY"),
        note: "note",
        creditAccountWarning
      })
    );

    const submitButton = getByText("Submit");
    await act(async () => {
      fireEvent.click(submitButton);
    });
    expect(creditAccountWarning).toBeCalled();
  });
});
