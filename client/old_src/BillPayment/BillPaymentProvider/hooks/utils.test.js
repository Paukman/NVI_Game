import React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { billPaymentErrors } from "utils/MessageCatalog";
import MockDate from "mockdate";
import {
  getEndDateNoOfPaymentsMessage,
  getNumberOfPaymentsForDates,
  getEndDateForNumberOfPayments,
  getDateDifference,
  preparePaymentSuccessMessage,
  preparePaymentErrorMessage,
  prepareRecurringDataToPost,
  persistDataBetweenForms,
  prepareOneTimeDataForReview,
  prepareRecurringDataForReview,
  prepareOneTimePaymentDataToPost,
  handleOnPayAnotherBillOneTime,
  handleOnPayAnotherBillRecurring,
  prepareCancelReviewMessage,
  getFutureDateCrossCurrencyError,
  getEligiblePayees,
  getEligibleFromAccounts,
  getInitialBillPaymentAccounts,
  getInitialPayeeValues,
  updateAccountsForEligibility,
  getPaymentMessage,
  prepareDuplicatePaymentMessage
} from "./utils";
import { endingOptions, primaryOptions } from "../../constants";
import {
  payBillDataMock,
  crossCurrencyBillPayeeData,
  ADD_PAYEE
} from "./constants";

import { getFormattedAccounts } from "../../../Transfers/TransferProvider/hooks/utils";

import {
  EXCHANGE_RATE_TITLE,
  EXCHANGE_RATE_TEXT
} from "../../../Transfers/constants";

dayjs.extend(customParseFormat);

describe("Testing getDateDifference", () => {
  it(">> should return empty string on garbage input", () => {
    let result = getDateDifference({
      startingDate: " ",
      endingDate: "2020-01-07",
      duration: "week"
    });
    expect(result).toEqual("");
    result = getDateDifference({
      startingDate: " ",
      endingDate: "",
      duration: "weeks time"
    });
    expect(result).toEqual("");
    result = getDateDifference({
      startingDate: null,
      endingDate: "",
      duration: "weeks time"
    });
    expect(result).toEqual("");
    result = getDateDifference(null);
    expect(result).toEqual("");
    result = getDateDifference(undefined);
    expect(result).toEqual("");
    result = getDateDifference("");
    expect(result).toEqual("");
    result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-07",
      duration: "weeks time"
    });
    expect(result).toEqual("");
  });
  it("should return proper data for not biweekly duration", () => {
    let result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-07",
      duration: "week"
    });
    expect(result).toEqual(1);
    result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-08",
      duration: "week"
    });
    expect(result).toEqual(2);
    result = getDateDifference({
      startingDate: "2020-01-05",
      endingDate: "2020-02-04",
      duration: "month"
    });
    expect(result).toEqual(1);
    result = getDateDifference({
      startingDate: "2020-01-05",
      endingDate: "2020-02-05",
      duration: "month"
    });
    expect(result).toEqual(2);
    result = getDateDifference({
      startingDate: "2020-02-01",
      endingDate: "2021-01-31",
      duration: "year"
    });
    expect(result).toEqual(1);
    result = getDateDifference({
      startingDate: "2020-02-01",
      endingDate: "2021-02-01",
      duration: "year"
    });
    expect(result).toEqual(2);
  });
  it("should return proper data for biweekly duration", () => {
    let result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-07",
      duration: "week",
      isBiweekly: true
    });
    expect(result).toEqual(1);
    result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-14",
      duration: "week",
      isBiweekly: true
    });
    expect(result).toEqual(1);
    result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-15",
      duration: "week",
      isBiweekly: true
    });
    expect(result).toEqual(2);
    result = getDateDifference({
      startingDate: "2020-01-01",
      endingDate: "2020-01-29",
      duration: "week",
      isBiweekly: true
    });
    expect(result).toEqual(3);
  });
});

describe("Testing getNumberOfPaymentsForDates", () => {
  it(">> should return default message", () => {
    let result = getNumberOfPaymentsForDates("1", "2");
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates(
      "2020-01-20",
      "2020-01-15",
      "some garbage"
    );
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates("2020-01-20", "2020-01-15", "weekly");
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates(
      "2020-01-20",
      "2020-01-25",
      "some wrong frequency"
    );
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates(null);
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates(undefined);
    expect(result).toEqual("");
    result = getNumberOfPaymentsForDates("");
    expect(result).toEqual("");
  });
  it(">> should return default message on correct arguments", () => {
    let result = getNumberOfPaymentsForDates(
      "2020-01-01",
      "2020-01-15",
      "weekly"
    );
    expect(result).toEqual(3);
    result = getNumberOfPaymentsForDates(
      "2020-01-01",
      "2020-01-15",
      "biweekly"
    );
    expect(result).toEqual(2);
    result = getNumberOfPaymentsForDates("2020-01-01", "2020-02-01", "monthly");
    expect(result).toEqual(2);
    result = getNumberOfPaymentsForDates("2020-01-01", "2022-02-01", "yearly");
    expect(result).toEqual(3);
  });
});

describe("Testing getEndDateForNumberOfPayments", () => {
  it(">> should return default message on garbage arguments", () => {
    let result = getEndDateForNumberOfPayments("1", "2");
    expect(result).toEqual("");
    result = getEndDateForNumberOfPayments(undefined);
    expect(result).toEqual("");
    result = getEndDateForNumberOfPayments(null);
    expect(result).toEqual("");
  });
  it(">> should return default message on invalid startingDate", () => {
    const result = getEndDateForNumberOfPayments("Not valid date", "weekly", 3);
    expect(result).toEqual("");
  });
  it(">> should return default message on negative number of payments", () => {
    const result = getEndDateForNumberOfPayments("2020-01-01", "weekly", -5);
    expect(result).toEqual("");
  });
  it(">> should return default message for bad frequency", () => {
    const result = getEndDateForNumberOfPayments(
      "2020-01-01",
      "semimonthly",
      1
    );
    expect(result).toEqual("");
  });
  it(">> should return proper end date with correct arguments", () => {
    let result = getEndDateForNumberOfPayments("2020-01-01", "weekly", 1);
    expect(result).toEqual("Jan 01, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "weekly", 2);
    expect(result).toEqual("Jan 08, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "weekly", 10);
    expect(result).toEqual("Mar 04, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "biweekly", 1);
    expect(result).toEqual("Jan 01, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "biweekly", 2);
    expect(result).toEqual("Jan 15, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "biweekly", 3);
    expect(result).toEqual("Jan 29, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "monthly", 1);
    expect(result).toEqual("Jan 01, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "monthly", 3);
    expect(result).toEqual("Mar 01, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "yearly", 1);
    expect(result).toEqual("Jan 01, 2020");
    result = getEndDateForNumberOfPayments("2020-01-01", "yearly", 3);
    expect(result).toEqual("Jan 01, 2022");
  });
});

describe("Testing getEndDateNoOfPaymentsMessage", () => {
  it(">> should return default on garbage input", () => {
    const result = getEndDateNoOfPaymentsMessage("some garbage");
    expect(result).toEqual("");
  });
  it(">> should return default on garbage state", () => {
    let state = {
      endingOption: "some garbage"
    };
    let result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
    state = {
      garbage: "some garbage"
    };
    result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
    state = null;
    result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
    state = undefined;
    result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
  });
  it(">> should return default message on missing data for number of payments", () => {
    const state = {
      endingOption: endingOptions.endDate,
      starting: "2020-04-30",
      ending: "2020-04-30"
    };
    const result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
  });
  it(">> should return default message on missing data for end date", () => {
    const state = {
      endingOption: endingOptions.numberOfPayments,
      starting: "2020-04-30",
      frequency: "weekly"
    };
    const result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("");
  });

  it(">> should return number of payment message", () => {
    const state = {
      endingOption: endingOptions.endDate,
      starting: "2020-04-30",
      ending: "2020-04-30",
      frequency: "weekly"
    };
    const result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("Number of payments: 1");
  });
  it(">> should return end date message", () => {
    const state = {
      endingOption: endingOptions.numberOfPayments,
      starting: "2020-04-30",
      numberOfPayments: "10",
      frequency: "weekly"
    };
    const result = getEndDateNoOfPaymentsMessage(state);
    expect(result).toEqual("End date: Jul 02, 2020");
  });
});

describe("Testing preparePaymentSuccessMessage", () => {
  const state = {
    billPayees: [
      {
        billPayeeId: "1234",
        payeeName: "Elton John",
        payeeNickname: "The Rocketman"
      }
    ],
    to: "1234"
  };
  it(">> should prepare proper success message", () => {
    let result = preparePaymentSuccessMessage(state);
    expect(result).toEqual(
      "You've successfully created your bill payment to The Rocketman."
    );
    result = preparePaymentSuccessMessage(state, true);
    expect(result).toEqual(
      "You've successfully created your bill payment(s) to The Rocketman."
    );
    let differentState = { ...state, to: "1111" };
    result = preparePaymentSuccessMessage(differentState);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(differentState, true);
    expect(result).toEqual("");

    differentState = { ...state, to: "" };
    result = preparePaymentSuccessMessage(differentState);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(differentState, true);
    expect(result).toEqual("");

    differentState = { ...state, billPayees: [], to: "1234" };
    result = preparePaymentSuccessMessage(differentState);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(differentState, true);
    expect(result).toEqual("");

    result = preparePaymentSuccessMessage(undefined);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(undefined, true);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(null);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(null, true);
    expect(result).toEqual("");

    differentState = {
      ...state,
      billPayees: [
        {
          billPayeeId: "1234",
          payeeName: "Elton John"
        }
      ]
    };
    result = preparePaymentSuccessMessage(differentState);
    expect(result).toEqual(
      "You've successfully created your bill payment to Elton John."
    );
    result = preparePaymentSuccessMessage(differentState, true);
    expect(result).toEqual(
      "You've successfully created your bill payment(s) to Elton John."
    );
  });
  it(">> should return default state on garbage input", () => {
    let result = preparePaymentSuccessMessage(null);
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage("");
    expect(result).toEqual("");
    result = preparePaymentSuccessMessage(undefined);
    expect(result).toEqual("");
  });
});

describe("Testing preparePaymentErrorMessage", () => {
  const state = {
    billPayees: [
      {
        billPayeeId: "1234",
        payeeName: "Elton John",
        payeeNickname: "The Rocketman"
      }
    ],
    to: "1234"
  };

  const error = {
    message: "Error message"
  };
  it(">> should prepare proper error message", () => {
    let result = preparePaymentErrorMessage(state, error);
    let differentState = { ...state, to: "1111" };
    result = preparePaymentErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);

    differentState = { ...state, to: "" };
    result = preparePaymentErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);

    differentState = { ...state, billPayees: [], to: "1234" };
    result = preparePaymentErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);

    differentState = {
      ...state,
      billPayees: [
        {
          billPayeeId: "1234",
          payeeName: "Elton John"
        }
      ]
    };
  });
  it(">> should return empty message on garbage inputs", () => {
    let result = preparePaymentErrorMessage(state, null);
    expect(result).toEqual(<React.Fragment />);
    result = preparePaymentErrorMessage(null, null);
    expect(result).toEqual(<React.Fragment />);
    result = preparePaymentErrorMessage(undefined, error);
    expect(result).toEqual(<React.Fragment />);
    result = preparePaymentErrorMessage("", error);
    expect(result).toEqual(<React.Fragment />);
  });
});

describe("Testing prepareRecurringDataToPost", () => {
  const state = {
    from: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
    to: "2625",
    fromCurrency: "CAD",
    amount: "$1.00",
    frequency: "weekly",
    starting: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
    endingOption: endingOptions.never,
    reviewEnding: null,
    note: "note"
  };

  it(">> should prepare data properly for posting", () => {
    let result = prepareRecurringDataToPost(state);
    expect(result).toMatchObject({
      amount: {
        currency: "CAD",
        value: 1
      },
      billPayeeId: "2625",
      executionCycle: {
        dayWithinPeriod: 3,
        lastExecutionDate: undefined,
        nextExecutionDate: undefined,
        periodFrequency: 1,
        periodUnit: "Week",
        startingDate: "2020-03-18"
      },
      isCreditCard: false,
      memo: "note",
      paymentDate: "2020-03-18",
      paymentType: "Recurring",
      sourceAccountId: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    });

    let differentState = {
      ...state,
      endingOption: endingOptions.endDate,
      reviewEnding: dayjs("May 18, 2020", "MMM DD, YYYY")
    };
    result = prepareRecurringDataToPost(differentState);
    expect(result.executionCycle).toMatchObject({
      dayWithinPeriod: 3,
      lastExecutionDate: "2020-05-18",
      nextExecutionDate: undefined,
      periodFrequency: 1,
      periodUnit: "Week",
      startingDate: "2020-03-18"
    });

    differentState = {
      ...state,
      frequency: "biweekly",
      endingOption: endingOptions.endDate,
      reviewEnding: dayjs("May 18, 2020", "MMM DD, YYYY")
    };
    result = prepareRecurringDataToPost(differentState);
    expect(result.executionCycle).toMatchObject({
      dayWithinPeriod: 3,
      lastExecutionDate: "2020-05-18",
      nextExecutionDate: undefined,
      periodFrequency: 2,
      periodUnit: "Week",
      startingDate: "2020-03-18"
    });

    differentState = {
      ...state,
      fromCurrency: "USD"
    };
    result = prepareRecurringDataToPost(differentState);
    expect(result.amount).toMatchObject({
      currency: "USD",
      value: 1
    });

    differentState = {
      ...state,
      frequency: "monthly",
      endingOption: endingOptions.endDate,
      reviewEnding: dayjs("May 18, 2020", "MMM DD, YYYY")
    };
    result = prepareRecurringDataToPost(differentState);
    expect(result.executionCycle).toMatchObject({
      dayWithinPeriod: 18,
      lastExecutionDate: "2020-05-18",
      nextExecutionDate: undefined,
      periodFrequency: 1,
      periodUnit: "Month",
      startingDate: "2020-03-18"
    });
  });
  it(">> should return null if no from or to data", () => {
    let differentState = {
      ...state,
      from: ""
    };
    let res = prepareRecurringDataToPost(differentState);
    expect(res).toEqual(null);
    differentState = {
      ...state,
      to: ""
    };
    res = prepareRecurringDataToPost(differentState);
    expect(res).toEqual(null);
    res = prepareRecurringDataToPost(null);
    expect(res).toEqual(null);
    res = prepareRecurringDataToPost("");
    expect(res).toEqual(null);
    res = prepareRecurringDataToPost(undefined);
    expect(res).toEqual(null);
  });
});

describe("Testing additional provider handles", () => {
  const oneTime = {
    onChange: jest.fn(),
    onPayAnotherBill: jest.fn(),
    onCleanForm: jest.fn()
  };
  const recurring = {
    onChange: jest.fn(),
    onPayAnotherBill: jest.fn(),
    onCleanForm: jest.fn()
  };

  it(">> should update state properly in both reducers", () => {
    persistDataBetweenForms(
      { name: "from", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledWith({
      name: "from",
      value: "value"
    });
    expect(recurring.onChange).toBeCalledWith({
      name: "from",
      value: "value"
    });

    persistDataBetweenForms({ name: "to", value: "value" }, oneTime, recurring);
    expect(oneTime.onChange).toBeCalledTimes(2);
    expect(recurring.onChange).toBeCalledTimes(2);

    persistDataBetweenForms(
      { name: "amount", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(3);
    expect(recurring.onChange).toBeCalledTimes(3);

    persistDataBetweenForms(
      { name: "when", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(3);

    persistDataBetweenForms(
      { name: "note", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(4);

    persistDataBetweenForms(
      { name: "frequency", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(5);

    persistDataBetweenForms(
      { name: "starting", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(6);

    persistDataBetweenForms(
      { name: "ending", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(7);

    persistDataBetweenForms(
      { name: "numberOfPayments", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(8);

    persistDataBetweenForms(
      { name: "endingOption", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(5);
    expect(recurring.onChange).toBeCalledTimes(9);
  });
  it(">> should call handleOnPayAnotherBillOneTime", () => {
    handleOnPayAnotherBillOneTime(oneTime, recurring);
    expect(oneTime.onPayAnotherBill).toBeCalled();
    expect(recurring.onCleanForm).toBeCalled();
  });
  it(">> should call handleOnPayAnotherBillRecurring", () => {
    handleOnPayAnotherBillRecurring(oneTime, recurring);
    expect(recurring.onPayAnotherBill).toBeCalled();
    expect(oneTime.onCleanForm).toBeCalled();
  });
});

describe("Testing prepareOneTimeDataForReview", () => {
  afterEach(() => {
    MockDate.reset();
  });

  const stateData = {
    fromAccountsFormatted: [
      {
        text: "No-Fee All-In Account (7679) | $89,526.63",
        key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
      }
    ],
    from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
    fromCurrency: "CAD",
    billPayeesFormatted: [
      {
        text: "12 MILE STORAGE (3568)",
        key: "3568",
        value: "3568"
      }
    ],
    to: "3568",
    toCurrency: "CAD",
    amount: "$100.00",
    when: dayjs("Jun 19, 2020", "MMM DD, YYYY"),
    note: "This is a note"
  };
  it(">> should return null for from or to if missing", () => {
    const differentState = {
      ...stateData,
      from: "",
      to: ""
    };
    let res = prepareOneTimeDataForReview(differentState);
    expect(res).toEqual(null);
    res = prepareOneTimeDataForReview(null);
    expect(res).toEqual(null);
    res = prepareOneTimeDataForReview(undefined);
    expect(res).toEqual(null);
    res = prepareOneTimeDataForReview("");
    expect(res).toEqual(null);
  });
  it(">> should prepare data for one time bill payment review before 8PM MT", () => {
    MockDate.set("2020-05-04T01:59:00Z");

    const { reviewData: res } = prepareOneTimeDataForReview(stateData);

    expect(res.From).toMatchObject({
      imageIcon: "account.svg",
      label: "No-Fee All-In Account (7679) | $89,526.63",
      title: "From",
      visible: true
    });
    expect(res.DownArrow).toMatchObject({
      imageIcon: "arrow_down.svg",
      visible: true
    });
    expect(res.To).toMatchObject({
      imageIcon: "pay-bill.svg",
      label: "12 MILE STORAGE (3568)",
      title: "To",
      visible: true
    });
    expect(res.Amount).toMatchObject({
      imageIcon: "money.svg",
      label: "$100.00",
      title: "Amount",
      visible: true
    });
    expect(res.When).toMatchObject({
      imageIcon: "calendar.svg",
      label: "Jun 19, 2020",
      title: "When",
      visible: true
    });
    expect(res.Note).toMatchObject({
      imageIcon: "note.svg",
      label: "This is a note",
      title: "Note",
      visible: true
    });
    expect(res.Message).toMatchObject({
      message: "",
      visible: false
    });
    // no cross currency file
    expect(res.ToAmount).toEqual(expect.objectContaining({ visible: false }));
    expect(res.ExchangeRate).toEqual(
      expect.objectContaining({ visible: false })
    );
    expect(res.ExchangeRateMessage).toEqual(
      expect.objectContaining({ visible: false })
    );
    expect(res.SecondMessage).toEqual(
      expect.objectContaining({ visible: false })
    );
  });
  it(">> should prepare data for cross cureency review and complete after 8PM MT", () => {
    const differentState = {
      ...stateData,
      enableFeatureToggle: true,
      toCurrency: "USD",
      amountTo: "$75.00",
      exchangeRateFormatted: "Formatted exchange rate"
    };
    MockDate.set("2020-05-04T02:01:00Z");

    const { reviewData: res, completeData } = prepareOneTimeDataForReview(
      differentState
    );

    expect(res.Amount).toMatchObject({
      imageIcon: "money.svg",
      label: "$100.00 CAD",
      title: "From amount",
      visible: true
    });
    expect(res.ToAmount).toMatchObject({
      imageIcon: "money.svg",
      label: "$75.00 USD",
      title: "To amount",
      visible: true
    });
    expect(res.ExchangeRate).toMatchObject({
      imageIcon: "foreign-exchange.svg",
      label: "Formatted exchange rate",
      title: EXCHANGE_RATE_TITLE,
      visible: true
    });
    expect(res.ExchangeRateMessage).toMatchObject({
      textOnly: EXCHANGE_RATE_TEXT,
      visible: true
    });

    expect(res.Message).toMatchObject({
      message: billPaymentErrors.MSG_RBBP_003,
      visible: true
    });

    expect(res.SecondMessage).toMatchObject({
      message: billPaymentErrors.MSG_RBBP_EXCHANGE_RATE_DISCLOSURE,
      visible: true
    });

    expect(completeData.ExchangeRateMessage).toEqual(
      expect.objectContaining({ visible: false })
    );
    expect(completeData.Message).toEqual(
      expect.objectContaining({ visible: false })
    );
    expect(completeData.SecondMessage).toEqual(
      expect.objectContaining({ visible: false })
    );
  });
  it(">> should return null if no data", () => {
    let res = prepareOneTimeDataForReview("");
    expect(res).toEqual(null);
    res = prepareOneTimeDataForReview(null);
    expect(res).toEqual(null);
    res = prepareOneTimeDataForReview(undefined);
    expect(res).toEqual(null);
  });
});

describe("Testing prepareRecurringDataForReview", () => {
  const stateData = {
    state: {
      fromAccounts: [
        {
          text: "No-Fee All-In Account (7679) | $89,526.63",
          key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
          value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
        }
      ],
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      billPayees: [
        {
          text: "12 MILE STORAGE (3568)",
          key: "3568",
          value: "3568"
        }
      ],
      to: "3568",
      amount: "$1.00",
      starting: dayjs("Apr 30, 2020", "MMM DD, YYYY"),
      endingOption: endingOptions.numberOfPayments,
      reviewEnding: dayjs("May 28, 2020", "MMM DD, YYYY"),
      reviewNumberOfPayments: "5",
      note: "Some note"
    }
  };
  it(">> should return null for from or to if missing", () => {
    const differentState = {
      ...stateData,
      state: {
        ...stateData.state,
        from: "",
        to: ""
      }
    };
    const res = prepareRecurringDataForReview(differentState);
    expect(res).toEqual(null);
  });
  it(">> should return null if no data", () => {
    let res = prepareRecurringDataForReview("");
    expect(res).toEqual(null);
    res = prepareRecurringDataForReview(null);
    expect(res).toEqual(null);
    res = prepareRecurringDataForReview(undefined);
    expect(res).toEqual(null);
  });
});

describe("Testing prepareOneTimePaymentDataToPost", () => {
  const state = {
    from: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
    fromCurrency: "CAD",
    to: "2625",
    amount: "$1.00",
    when: dayjs("Mar 18, 2020", "MMM DD, YYYY"),
    note: "note"
  };

  beforeEach(() => {
    MockDate.set("2020-03-18T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should prepare data properly for posting", () => {
    let result = prepareOneTimePaymentDataToPost(state);
    expect(result).toMatchObject({
      amount: {
        currency: "CAD",
        value: 1
      },
      billPayeeId: "2625",
      isCreditCard: false,
      memo: "note",
      paymentDate: "",
      paymentType: "Immediate",
      sourceAccountId: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    });

    const differentState = {
      ...state,
      when: dayjs("Apr 20, 2020", "MMM DD, YYYY")
    };
    result = prepareOneTimePaymentDataToPost(differentState);
    expect(result).toMatchObject({
      amount: {
        currency: "CAD",
        value: 1
      },
      billPayeeId: "2625",
      isCreditCard: false,
      memo: "note",
      paymentDate: "2020-04-20",
      paymentType: "FutureDated",
      sourceAccountId: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
    });
  });

  it(">> should prepare data properly for posting for crossCurrency", () => {
    const differentState = {
      ...state,
      enableFeatureToggle: true,
      toCurrency: "USD",
      amountTo: "$75.00",
      exchangeRateFormatted: "Formatted exchange rate"
    };
    const result = prepareOneTimePaymentDataToPost(differentState);
    expect(result).toMatchObject({
      amount: {
        currency: "USD",
        value: 75
      },
      billPayeeId: "2625",
      isCreditCard: false,
      memo: "note",
      paymentDate: "",
      paymentType: "Immediate",
      sourceAccountId: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
      netAmount: {
        currency: "CAD",
        value: 1
      }
    });
  });
  it(">> should return null if no from and to data", () => {
    let res = prepareOneTimePaymentDataToPost({ ...state, from: "" });
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost({ ...state, from: null });
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost({ ...state, to: "" });
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost({ ...state, to: null });
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost(null);
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost("");
    expect(res).toEqual(null);
    res = prepareOneTimePaymentDataToPost(undefined);
    expect(res).toEqual(null);
  });
});

describe("Testing prepareCancelReviewMessage", () => {
  it(">> should return empty fragment on all errors", () => {
    let res = prepareCancelReviewMessage(null);
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage(undefined);
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage("");
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...payBillDataMock,
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      to: "1967"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...payBillDataMock,
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...payBillDataMock,
      amount: "$10.00",
      to: "1967"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00",
      to: "1967",
      fromAccountFormatted: []
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00",
      to: "1967",
      billPayeesFormatted: []
    });
    expect(res).toEqual(<></>);
  });
});

describe("Testing getEligiblePayees", () => {
  it(">> should return  formatted payees when called from recurring reducer for CAD", () => {
    const result = getEligiblePayees(
      "CAD",
      crossCurrencyBillPayeeData.billPayees,
      true
    );
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdPayee01, disabled: true }
    ]);
  });
  it(">> should return  formatted payees when called from recurring reducer for USD", () => {
    const result = getEligiblePayees(
      "USD",
      crossCurrencyBillPayeeData.billPayees,
      true
    );
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.usdPayee01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadPayee01, disabled: true },
      { ...crossCurrencyBillPayeeData.cadPayee02, disabled: true }
    ]);
  });
  it(">> should return formatted payees when called for CAD", () => {
    const result = getEligiblePayees(
      "CAD",
      crossCurrencyBillPayeeData.billPayees
    );
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
  });

  it(">> should return formatted payees when called for USD", () => {
    const result = getEligiblePayees(
      "USD",
      crossCurrencyBillPayeeData.billPayees
    );
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.usdPayee01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadPayee01, disabled: true },
      { ...crossCurrencyBillPayeeData.cadPayee02, disabled: true }
    ]);
  });

  it(">> should properly return for garbage", () => {
    let result = getEligiblePayees("CAD", []);
    expect(result).toEqual([ADD_PAYEE]);
    result = getEligiblePayees("USD", null);
    expect(result).toEqual([ADD_PAYEE]);
    result = getEligiblePayees("TEST", crossCurrencyBillPayeeData.billPayees);
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
    result = getEligiblePayees(
      undefined,
      crossCurrencyBillPayeeData.billPayees
    );
    expect(result).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
    result = getEligiblePayees("TEST", []);
    expect(result).toMatchObject([ADD_PAYEE]);
  });
});

describe("Testing getEligibleFromAccounts", () => {
  it(">> should return formatted accounts when called from recurring reducer for CAD", () => {
    const result = getEligibleFromAccounts(
      "CAD",
      crossCurrencyBillPayeeData.fromAccounts,
      true
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.cadAccount02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdAccount01, disabled: true }
    ]);
  });

  it(">> should return formatted accounts when called from recurring reducer for USD", () => {
    const result = getEligibleFromAccounts(
      "USD",
      crossCurrencyBillPayeeData.fromAccounts,
      true
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadAccount02, disabled: true }
    ]);
  });
  it(">> should return formatted accounts when called for CAD", () => {
    const result = getEligibleFromAccounts(
      "CAD",
      crossCurrencyBillPayeeData.fromAccounts
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.cadAccount02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdAccount01, disabled: true }
    ]);
  });
  it(">> should return formatted accounts when called for USD", () => {
    const result = getEligibleFromAccounts(
      "USD",
      crossCurrencyBillPayeeData.fromAccounts
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
  });

  it(">> should properly return for garbage", () => {
    let result = getEligibleFromAccounts("CAD", []);
    expect(result).toEqual([]);
    result = getEligibleFromAccounts("USD", null);
    expect(result).toEqual([]);
    result = getEligibleFromAccounts(
      "TEST",
      crossCurrencyBillPayeeData.fromAccounts
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    result = getEligibleFromAccounts(
      undefined,
      crossCurrencyBillPayeeData.fromAccounts
    );
    expect(result).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    result = getEligibleFromAccounts("TEST", []);
    expect(result).toMatchObject([]);
  });
});

describe("Testing updateAccountsForEligibility", () => {
  it(">> should return states for primary account as from and fromCurrency as CAD", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.notSelected,
      fromCurrency: "CAD",
      toCurrency: "",
      to: ""
    };
    let result = updateAccountsForEligibility(state, "from", "idCAD");

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);

    // for recurring reducer
    result = updateAccountsForEligibility(state, "from", "idCAD", true);

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdPayee01, disabled: true }
    ]);
  });

  it(">> should return states for primary account as from and fromCurrency as USD", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.notSelected,
      fromCurrency: "USD",
      toCurrency: "",
      to: ""
    };
    let result = updateAccountsForEligibility(state, "from", "idUSD");

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.usdPayee01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadPayee01, disabled: true },
      { ...crossCurrencyBillPayeeData.cadPayee02, disabled: true }
    ]);

    // for recurring reducer is the same
    result = updateAccountsForEligibility(state, "from", "idUSD", true);

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.usdPayee01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadPayee01, disabled: true },
      { ...crossCurrencyBillPayeeData.cadPayee02, disabled: true }
    ]);
  });

  it(">> should return states for primary account as to and toCurrency as CAD", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.notSelected,
      fromCurrency: "",
      toCurrency: "CAD",
      from: ""
    };
    let result = updateAccountsForEligibility(state, "to", "CAD01");

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.cadAccount02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdAccount01, disabled: true }
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);

    // for recurring reducer is the same
    result = updateAccountsForEligibility(state, "to", "CAD01", true);

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.cadAccount02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdAccount01, disabled: true }
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
  });

  it(">> should return states for primary account as to and toCurrency as USD", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.notSelected,
      fromCurrency: "",
      toCurrency: "USD",
      from: ""
    };
    let result = updateAccountsForEligibility(state, "to", "USD01");

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);

    result = updateAccountsForEligibility(state, "to", "USD01", true);

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.cadAccount02, disabled: true }
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
  });
  it(">> should return states for primary account as to if primary is from for USD payee", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.selectedFrom,
      fromCurrency: "CAD",
      toCurrency: "",
      from: ""
    };
    let result = updateAccountsForEligibility(state, "to", "USD01");

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);

    // for recurring user cannot select USD payee
    result = updateAccountsForEligibility(state, "to", "CAD01", true);

    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.divider,
      { ...crossCurrencyBillPayeeData.usdPayee01, disabled: true }
    ]);
  });

  it(">> should return states for primary account as to if primary is 'to' for CAD payee", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.selectedTo,
      fromCurrency: "",
      toCurrency: "USD",
      from: ""
    };
    let result = updateAccountsForEligibility(state, "from", "idCAD");

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);

    // for recurring at this point user cannot select cad account
    result = updateAccountsForEligibility(state, "from", "idUSD", true);

    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject([
      crossCurrencyBillPayeeData.usdAccount01,
      crossCurrencyBillPayeeData.divider,
      crossCurrencyBillPayeeData.cadAccount02
    ]);
    expect(result.billPayeesFormatted).toMatchObject([
      ADD_PAYEE,
      crossCurrencyBillPayeeData.cadPayee01,
      crossCurrencyBillPayeeData.cadPayee02,
      crossCurrencyBillPayeeData.usdPayee01
    ]);
  });
  it(">> should clear to account and to currency", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.selectedFrom,
      fromCurrency: "CAD",
      toCurrency: "USD",
      from: "from account",
      to: "to Account"
    };
    let result = updateAccountsForEligibility(state, "from", "idCAD");
    expect(result.to).toEqual("to Account");
    expect(result.toCurrency).toEqual("USD");

    result = updateAccountsForEligibility(state, "from", "idCAD", true);
    expect(result.to).toEqual("");
    expect(result.toCurrency).toEqual("");
  });
  it(">> should clear from account and from currency", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.selectedTo,
      fromCurrency: "USD",
      toCurrency: "CAD",
      from: "idUSD",
      to: "to Account"
    };
    let result = updateAccountsForEligibility(state, "to", "CAD01");
    expect(result.from).toEqual("");
    expect(result.fromCurrency).toEqual("");

    result = updateAccountsForEligibility(state, "to", "CAD01", true);
    expect(result.from).toEqual("");
    expect(result.fromCurrency).toEqual("");

    result = updateAccountsForEligibility(
      { ...state, fromCurrency: "CAD", from: "idCAD" },
      "to",
      "CAD01"
    );
    expect(result.from).toEqual("idCAD");
    expect(result.fromCurrency).toEqual("CAD");
  });
  it(">> should clear add-payee added but ineligible", () => {
    const state = {
      ...crossCurrencyBillPayeeData,
      primary: primaryOptions.selectedFrom,
      fromCurrency: "USD",
      toCurrency: "CAD",
      from: "idUSD",
      to: "account"
    };
    let result = updateAccountsForEligibility(state, "to", "CAD01");
    expect(result.to).toEqual("");
    expect(result.toCurrency).toEqual("");

    result = updateAccountsForEligibility(state, "to", "USD01");
    expect(result.to).toEqual("account");
    expect(result.toCurrency).toEqual("USD");
  });
});
describe(">> testing getFutureDateCrossCurrencyError", () => {
  const state = {
    toCurrency: "CAD",
    fromCurrency: "CAD",
    fromAccounts: [
      { id: "toCAD", name: "toCAD", currency: "CAD" },
      { id: "toUSD", name: "toUSD", currency: "USD" }
    ],
    billPayees: [
      {
        billPayeeId: "toCAD",
        payeeName: "toCAD",
        ATBMastercardCurrency: "CAD"
      },
      { billPayeeId: "toUSD", payeeName: "toUSD", ATBMastercardCurrency: "USD" }
    ],
    when: dayjs().add(1, "day"),
    isDisplayedToAmount: false
  };
  let newState;

  it(">> should be false if to is not cross currency", () => {
    const res = getFutureDateCrossCurrencyError(state, "to", "toCAD");
    expect(res.isFutureDatedCrossCurrency).toBe(false);
  });
  it(">> should be true if TO cross currency changed", () => {
    newState = {
      ...state,
      from: state.fromAccounts[0].id,
      fromCurrency: "CAD"
    };
    const res = getFutureDateCrossCurrencyError(newState, "to", "toUSD");
    expect(res.isFutureDatedCrossCurrency).toBe(true);
  });
  it(">> should not be true if FROM is not cross currency", () => {
    const res = getFutureDateCrossCurrencyError(state, "from", "toCAD");
    expect(res.isFutureDatedCrossCurrency).toBe(false);
  });
  it(">> should be true if FROM cross currency changed", () => {
    newState = {
      ...state,
      to: state.billPayees[0].billPayeeId,
      toCurrency: "CAD"
    };
    const res = getFutureDateCrossCurrencyError(newState, "from", "toUSD");
    expect(res.isFutureDatedCrossCurrency).toBe(true);
  });
});
describe("Testing getFormattedAccounts", () => {
  it(">> should format accounts", () => {
    let res = getFormattedAccounts(payBillDataMock.fromBillAccounts, true);
    expect(res).toEqual([
      {
        key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
        text: "No-Fee All-In Account (7679) | $93,428.49 CAD",
        value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
      },
      {
        key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
        text: "Springboard Savings Account (1479) | $42,442.26 CAD",
        value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
      },
      {
        key: "33ZFwIxk3ZebPZZx1bDHjwWT_patMxC_VXSu76DnUvU",
        text: "Personal - US Dollar Chequing (5579) | $152.26 CAD",
        value: "33ZFwIxk3ZebPZZx1bDHjwWT_patMxC_VXSu76DnUvU"
      }
    ]);

    res = getFormattedAccounts([], false);
    expect(res).toEqual([]);
    res = getFormattedAccounts(null, false);
    expect(res).toEqual([]);
  });
});

describe("Testing getInitialBillPaymentAccounts", () => {
  const fromBankAccount = {
    accountId: "from-account",
    routingId: "01234",
    country: "CAD"
  };
  const creditCardNumber = "543212345";
  const associatedCreditCard = "567890987654";

  const state = {
    fromAccounts: [{ id: "from-account-id", bankAccount: fromBankAccount }],
    billPayees: [
      {
        billPayeeId: "bill-payee-id",
        ATBMastercardIndicator: true,
        payeeCustomerReference: creditCardNumber
      },
      {
        billPayeeId: "assoc-bill-payee-id",
        ATBMastercardIndicator: true,
        payeeCustomerReference: associatedCreditCard
      }
    ]
  };
  it(">> should return `to` and `from` as undefined if new accounts are undefined", () => {
    const accounts = getInitialBillPaymentAccounts(state, {});
    expect(accounts.to).toBeUndefined();
    expect(accounts.from).toBeUndefined();
  });

  it(">> should return `from` as undefined if from account is not found in fromAccounts", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      from: {
        accountId: "will",
        routingId: "not",
        country: "find"
      }
    });
    expect(accounts.from).toBeUndefined();
  });

  it(">> should return `to` as undefined when payeeCustomerReference does not match accountNumber or associatedAccountNumbers", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      to: {
        accountNumber: "111111111",
        associatedAccountNumbers: ["22222222", "333333333"]
      }
    });
    expect(accounts.to).toBeUndefined();
  });

  it(">> should return `to` as undefined if matching payee is not an ATB Mastercard", () => {
    const accounts = getInitialBillPaymentAccounts(
      {
        billPayees: [
          {
            billPayeeId: "credit-card-id",
            payeeCustomerReference: "12345678",
            ATBMastercardIndicator: false
          }
        ]
      },
      {
        to: { accountNumber: "12345678" }
      }
    );
    expect(accounts.to).toBeUndefined();
  });

  it(">> should return `from` account id if account exist in fromAccounts", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      from: fromBankAccount
    });
    expect(accounts.from).toBe("from-account-id");
  });

  it(">> should return `to` billPayeeId if `to` creditCardNumber matches payeeCustomerReference of a payee", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      to: { accountNumber: creditCardNumber }
    });
    expect(accounts.to).toBe("bill-payee-id");
  });

  it(">> should return `to` billPayeeId if `to` creditCardNumber exists in associatedAccounts of a payee", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      to: {
        accountNumber: "not-found-number",
        associatedAccountNumbers: [associatedCreditCard]
      }
    });
    expect(accounts.to).toBe("assoc-bill-payee-id");
  });

  it(">> should return `to` billPayeeId match on `payeeReferenceNumber` before `associatedAccounts` match", () => {
    const accounts = getInitialBillPaymentAccounts(state, {
      to: {
        accountNumber: creditCardNumber,
        associatedAccountNumbers: [associatedCreditCard]
      }
    });
    expect(accounts.to).toBe("bill-payee-id");
  });
});

describe("Testing getInitialPayeeValues", () => {
  it(">> should return undefined if payee is falsy", () => {
    expect(getInitialPayeeValues()).toBeUndefined();
    expect(getInitialPayeeValues("")).toBeUndefined();
    expect(getInitialPayeeValues(0)).toBeUndefined();
  });

  it(">> should return object with undefined keys if payee is empty", () => {
    expect(getInitialPayeeValues({})).toEqual({
      accountNumber: undefined,
      id: undefined
    });
  });

  it(">> should return the same account number that exists in payee", () => {
    expect(getInitialPayeeValues({ accountNumber: "444-555-666" })).toEqual({
      accountNumber: "444-555-666",
      id: undefined
    });
  });

  it(">> should return the id for ATB FINANCIAL MASTERCARD if currency is CAD", () => {
    expect(getInitialPayeeValues({ currency: "CAD" })).toEqual({
      accountNumber: undefined,
      id: "8836"
    });
  });

  it(">> should return the id for ATB US DOLLAR MASTERCARD if currency is USD", () => {
    expect(getInitialPayeeValues({ currency: "USD" })).toEqual({
      accountNumber: undefined,
      id: "1755672"
    });
  });

  it(">> should return undefined id if currency is not mapped", () => {
    expect(getInitialPayeeValues({ currency: "NOT" })).toEqual({
      accountNumber: undefined,
      id: undefined
    });
    expect(getInitialPayeeValues({ currency: "MAPPED" })).toEqual({
      accountNumber: undefined,
      id: undefined
    });
  });
});

describe("Testing getPaymentMessage", () => {
  const noMessage = { visible: false, message: "" };
  const afterHours = { visible: true, message: billPaymentErrors.MSG_RBBP_003 };

  it("should return no message just before 8PM MST", () => {
    expect(getPaymentMessage("2020-12-02T02:59:00Z")).toEqual(noMessage);
  });
  it("should return no message at midnight MST", () => {
    expect(getPaymentMessage("2020-12-02T07:00:00Z")).toEqual(noMessage);
  });
  it("should return next business day message at 8PM MST", () => {
    expect(getPaymentMessage("2020-12-02T03:00:00Z")).toEqual(afterHours);
  });
  it("should return next business day message before midnight MST", () => {
    expect(getPaymentMessage("2020-12-02T06:59:00Z")).toEqual(afterHours);
  });
  it("should return no message just before 8PM MDT", () => {
    expect(getPaymentMessage("2020-05-04T01:59:00Z")).toEqual(noMessage);
  });
  it("should return no message at midnight MDT", () => {
    expect(getPaymentMessage("2020-05-04T06:00:00Z")).toEqual(noMessage);
  });
  it("should return next business day message at 8PM MDT", () => {
    expect(getPaymentMessage("2020-05-04T02:00:00Z")).toEqual(afterHours);
  });
  it("should return next business day message before midnight MDT", () => {
    expect(getPaymentMessage("2020-05-04T05:59:00Z")).toEqual(afterHours);
  });
});

describe("Testing prepareDuplicatePaymentMessage", () => {
  const duplicatePayment = {
    sourceAccountProductName: "One Account",
    payeeName: "One Payee",
    payeeCustomerReference: "123456789",
    amount: {
      value: 10,
      currency: "EUR"
    }
    // postedDate // missing
  };
  it("should return null if missing data", () => {
    const res = prepareDuplicatePaymentMessage(duplicatePayment);
    expect(res).toEqual(null);
  });
  it("should return message content", () => {
    const { getByText } = render(
      prepareDuplicatePaymentMessage({
        ...duplicatePayment,
        postedDate: "10-5-2021"
      })
    );

    expect(getByText("From: One Account")).toBeTruthy();
    expect(getByText("To: One Payee (6789)")).toBeTruthy();
    expect(getByText("Amount: $10.00 EUR")).toBeTruthy();
    expect(getByText("Date: Oct 5, 2021")).toBeTruthy();
  });
});
