import React from "react";
import MockDate from "mockdate";
import dayjs from "dayjs";
import { transferErrors } from "utils/MessageCatalog";
import { transferDataMock, oneTimeDataForReview } from "./constants";
import {
  endingOptions,
  transferStateMock,
  primaryOptions,
  account01noFee,
  account01noFeeUSD,
  account02SPRINGBOARD,
  account02SPRINGBOARDUSD
} from "../../constants";

import {
  getEndDateNoOfTransfersMessage,
  prepareTransferErrorMessage,
  getToOrFromAccountMessage,
  notSupportedFutureDatedTransfer,
  prepareOneTimeDataForReview,
  prepareCancelReviewMessage,
  getValueToPersist,
  persistDataBetweenForms,
  handleOnSendAnotherTransferOneTime,
  handleOnSendAnotherTransferRecurring,
  updateAccountsForEligibility,
  removeSelectedAccount,
  getEligibleFormattedAccounts,
  getCurrencies,
  getInitialTransferAccounts,
  prepareDataForExchangeAPICall,
  futureDateCrossCurrency,
  isToAccountValid,
  prepareOneTimeDataToPost
} from "./utils";

describe("Testing prepareCancelReviewMessage", () => {
  it(">> should return empty fragment on all errors", () => {
    let res = prepareCancelReviewMessage(null);
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage(undefined);
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage("");
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...transferDataMock,
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...transferDataMock,
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      ...transferDataMock,
      amount: "$10.00",
      to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00",
      to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      fromAccountFormatted: []
    });
    expect(res).toEqual(<></>);
    res = prepareCancelReviewMessage({
      from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
      amount: "$10.00",
      to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
      toAccountFormatted: []
    });
    expect(res).toEqual(<></>);
  });
});

describe("Testing getValueToPersist", () => {
  it(">> should return passed in `value` when name is `from` and `state.fromAccounts` contains the id value", () => {
    const result = getValueToPersist(
      { name: "from", value: "sharedAccountId" },
      { fromAccounts: [{ id: "sharedAccountId" }] }
    );
    expect(result).toBe("sharedAccountId");
  });

  it(">> should return an empty string when name is `from` and `state.fromAccounts` does not contains the passed in value", () => {
    const stateHasFromAccountResult = getValueToPersist(
      { name: "from", value: "oneId" },
      { fromAccounts: [{ id: "anotherId" }] }
    );
    expect(stateHasFromAccountResult).toBe("");

    const fromAccountEmptyResult = getValueToPersist(
      { name: "from", value: "notSharedAccountId" },
      { fromAccounts: [] }
    );
    expect(fromAccountEmptyResult).toBe("");

    const stateUndefinedResult = getValueToPersist({
      name: "from",
      value: "notShared"
    });
    expect(stateUndefinedResult).toBe("");
  });

  it(">> should return passed in value if name is not in handled in switch case", () => {
    const stringResult = getValueToPersist({ name: "to", value: "string" }, {});
    expect(stringResult).toEqual("string");

    const undefinedResult = getValueToPersist({}, {});
    expect(undefinedResult).toEqual(undefined);

    const nullResult = getValueToPersist({ name: null, value: "null" }, {});
    expect(nullResult).toEqual("null");
  });
});

describe("Testing persistDataBetweenForms", () => {
  const oneTime = {
    onChange: jest.fn(),
    onSendAnotherTransfer: jest.fn(),
    onCleanForm: jest.fn(),
    oneTimeState: { fromAccounts: [{ id: "value" }, { id: "unique" }] }
  };
  const recurring = {
    onChange: jest.fn(),
    onSendAnotherTransfer: jest.fn(),
    onCleanForm: jest.fn(),
    recurringState: { fromAccounts: [{ id: "value" }] }
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
      { name: "frequency", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(4);

    persistDataBetweenForms(
      { name: "starting", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(5);

    persistDataBetweenForms(
      { name: "ending", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(6);

    persistDataBetweenForms(
      { name: "numberOfTransfers", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(7);

    persistDataBetweenForms(
      { name: "endingOption", value: "value" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledTimes(4);
    expect(recurring.onChange).toBeCalledTimes(8);
  });

  it(">> should update `from` state in both reducers if both contain the account", () => {
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
  });

  it(">> should reset `from` state in a reducer if it doesn't contain the account id", () => {
    persistDataBetweenForms(
      { name: "from", value: "unique" },
      oneTime,
      recurring
    );
    expect(oneTime.onChange).toBeCalledWith({
      name: "from",
      value: "unique"
    });
    expect(recurring.onChange).toBeCalledWith({
      name: "from",
      value: ""
    });
  });
});

describe("Testing additional provider handles", () => {
  const oneTime = {
    onChange: jest.fn(),
    onSendAnotherTransfer: jest.fn(),
    onCleanForm: jest.fn()
  };
  const recurring = {
    onChange: jest.fn(),
    onSendAnotherTransfer: jest.fn(),
    onCleanForm: jest.fn()
  };
  it(">> should call handleOnSendAnotherTransferOneTime", () => {
    handleOnSendAnotherTransferOneTime(oneTime, recurring);
    expect(oneTime.onSendAnotherTransfer).toBeCalled();
    expect(recurring.onCleanForm).toBeCalled();
  });
  it(">> should call handleOnSendAnotherTransferRecurring", () => {
    handleOnSendAnotherTransferRecurring(oneTime, recurring);
    expect(recurring.onSendAnotherTransfer).toBeCalled();
    expect(oneTime.onCleanForm).toBeCalled();
  });
});

describe("Testing getEndDateNoOfTransfersMessage", () => {
  it(">> should return default on garbage input", () => {
    const result = getEndDateNoOfTransfersMessage("some garbage");
    expect(result).toEqual("");
  });
  it(">> should return default on garbage state", () => {
    let state = {
      endingOption: "some garbage"
    };
    let result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
    state = {
      garbage: "some garbage"
    };
    result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
    state = null;
    result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
    state = undefined;
    result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
  });
  it(">> should return default message on missing data for number of payments", () => {
    const state = {
      endingOption: endingOptions.endDate,
      starting: "2020-04-30",
      ending: "2020-04-30"
    };
    const result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
  });
  it(">> should return default message on missing data for end date", () => {
    const state = {
      endingOption: endingOptions.numberOfTransfers,
      starting: "2020-04-30",
      frequency: "weekly"
    };
    const result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("");
  });

  it(">> should return number of payment message", () => {
    const state = {
      endingOption: endingOptions.endDate,
      starting: "2020-04-30",
      ending: "2020-04-30",
      frequency: "weekly"
    };
    const result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("Number of transfers: 1");
  });
  it(">> should return end date message", () => {
    const state = {
      endingOption: endingOptions.numberOfTransfers,
      starting: "2020-04-30",
      numberOfTransfers: "10",
      frequency: "weekly"
    };
    const result = getEndDateNoOfTransfersMessage(state);
    expect(result).toEqual("End date: Jul 02, 2020");
  });
});

describe("Testing prepareTransferErrorMessage", () => {
  const state = {
    ...transferDataMock,
    from: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
    to: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw",
    amount: "$100.00"
  };

  const error = {
    message: "something went wrong"
  };
  it(">> should prepare proper error message", () => {
    let result = prepareTransferErrorMessage(state, error);
    let differentState = { ...state, to: "1111" };
    result = prepareTransferErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);

    differentState = { ...state, to: "" };
    result = prepareTransferErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);

    differentState = { ...state, billPayees: [], to: "1234" };
    result = prepareTransferErrorMessage(differentState, error);
    expect(result).toEqual(<React.Fragment />);
  });
  it(">> should return empty message on garbage inputs", () => {
    let result = prepareTransferErrorMessage(state, null);
    expect(result).toEqual(<React.Fragment />);
    result = prepareTransferErrorMessage(null, null);
    expect(result).toEqual(<React.Fragment />);
    result = prepareTransferErrorMessage(undefined, error);
    expect(result).toEqual(<React.Fragment />);
    result = prepareTransferErrorMessage("", error);
    expect(result).toEqual(<React.Fragment />);
  });
});

describe("Testing getToOrFromAccountMessage", () => {
  it(">> should prepare getToOrFromAccountMessage message properly", () => {
    const toDailyInterestAccount = {
      text: "Daily Interest Account"
    };
    const toBuilderAccount = {
      text: "Builder Account"
    };
    const toTaxFreeSaverAccount = {
      text: "Tax-Free Saver Account"
    };
    const fromTaxFreeSaverAccount = {
      text: "Tax-Free Saver Account"
    };
    let result = getToOrFromAccountMessage(
      { text: "fromAccount" },
      toDailyInterestAccount
    );
    expect(result).toMatchObject({
      message:
        "To avoid paying any penalties, be careful not to exceed your maximum contribution limit for the year. You can confirm your limit by reviewing your notice of assessment or by contacting the Canada Revenue Agency (CRA).",
      visible: true
    });

    result = getToOrFromAccountMessage(
      { text: "fromAccount" },
      toBuilderAccount
    );
    expect(result).toMatchObject({
      message:
        "To avoid paying any penalties, be careful not to exceed your maximum contribution limit for the year. You can confirm your limit by reviewing your notice of assessment or by contacting the Canada Revenue Agency (CRA).",
      visible: true
    });

    result = getToOrFromAccountMessage(
      { text: "fromAccount" },
      toTaxFreeSaverAccount
    );
    expect(result).toMatchObject({
      message:
        "To avoid paying any penalties, be careful not to exceed your maximum contribution limit for the year. Learn more about TFSA contribution limits at the Canada Revenue Agency (CRA).",
      visible: true
    });

    result = getToOrFromAccountMessage(fromTaxFreeSaverAccount, {
      text: "account"
    });
    expect(result).toMatchObject({
      message:
        "Remember: the amount of any withdrawals (other than qualifying transfers) from your TFSA in a year will be added to your contribution room the following year. Also, withdrawing funds from your TFSA does not reduce the total amount of contributions you have already made for the year.",
      visible: true
    });

    result = getToOrFromAccountMessage(fromTaxFreeSaverAccount, null);
    expect(result).toMatchObject({
      message: "",
      visible: false
    });
    result = getToOrFromAccountMessage(null, toBuilderAccount);
    expect(result).toMatchObject({
      message: "",
      visible: false
    });
    result = getToOrFromAccountMessage(null, "");
    expect(result).toMatchObject({
      message: "",
      visible: false
    });
  });
});

describe("Testing prepareOneTimeDataForReview", () => {
  const stateData = {
    oneTimeDataForReview
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
  it(">> should prepare data for one time bill payment review", () => {
    const { reviewData: res } = prepareOneTimeDataForReview(
      oneTimeDataForReview
    );
    expect(res.From).toMatchObject({
      imageIcon: "account.svg",
      label: "No-Fee All-In Account (7679) | $386,756.06 CAD",
      title: "From",
      visible: true
    });
    expect(res.DownArrow).toMatchObject({
      imageIcon: "arrow_down.svg",
      visible: true
    });
    expect(res.To).toMatchObject({
      imageIcon: "account.svg",
      label: "Springboard Savings Account (1479) | $220,491.79 CAD",
      title: "To",
      visible: true
    });
    expect(res.Amount).toMatchObject({
      imageIcon: "money.svg",
      label: "$1.00",
      title: "Amount",
      visible: true
    });
    expect(res.When).toMatchObject({
      imageIcon: "calendar.svg",
      label: "Mar 18, 2020",
      title: "When",
      visible: true
    });
    expect(res.Message).toMatchObject({
      message: "",
      visible: false
    });
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

describe("Testing notSupportedFutureDatedTransfer", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });
  afterEach(() => {
    MockDate.reset();
  });

  it(">> should return proper value for provided arguments for to and from", () => {
    const stateWithTodaysDate = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      when: dayjs("Jan 30, 2019", "MMM DD, YYYY")
    };

    const stateWithFutureDate = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      when: dayjs("Jan 31, 2019", "MMM DD, YYYY")
    };
    let result = notSupportedFutureDatedTransfer(
      stateWithTodaysDate,
      "from",
      "id_01"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDate,
      "from",
      "id_03"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithFutureDate,
      "from",
      "id_01"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithFutureDate,
      "from",
      "id_03"
    );
    expect(result).toEqual(true);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDate,
      "to",
      "id_01"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDate,
      "to",
      "id_03"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithFutureDate,
      "to",
      "id_01"
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithFutureDate,
      "to",
      "id_03"
    );
    expect(result).toEqual(false);
  });
  it(">> should return proper value for provided arguments for when", () => {
    const stateWithTodaysDateIdBelongsFrom = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      from: "id_01"
    };

    const stateWithTodaysDateIdNotBelongsFrom = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      from: "id_03"
    };

    const stateWithTodaysDateIdBelongsTo = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      to: "id_01"
    };

    const stateWithTodaysDateIdNotBelongsTo = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }],
      to: "id_03"
    };

    const stateWithFutureDate = {
      futureDatedTransferAccounts: [{ id: "id_01" }, { id: "id_02" }]
    };

    let result = notSupportedFutureDatedTransfer(
      stateWithTodaysDateIdBelongsFrom,
      "when",
      dayjs("Jan 30, 2019", "MMM DD, YYYY")
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDateIdNotBelongsFrom,
      "when",
      dayjs("Jan 30, 2019", "MMM DD, YYYY")
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDateIdBelongsTo,
      "when",
      dayjs("Jan 30, 2019", "MMM DD, YYYY")
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithTodaysDateIdNotBelongsTo,
      "when",
      dayjs("Jan 30, 2019", "MMM DD, YYYY")
    );
    expect(result).toEqual(false);

    result = notSupportedFutureDatedTransfer(
      stateWithFutureDate,
      "when",
      dayjs("Jan 31, 2019", "MMM DD, YYYY")
    );
    expect(result).toEqual(false);
  });

  it(">> should return false for garbage", () => {
    let result = notSupportedFutureDatedTransfer(null);
    expect(result).toEqual(false);
    result = notSupportedFutureDatedTransfer(undefined);
    expect(result).toEqual(false);
    result = notSupportedFutureDatedTransfer("");
    expect(result).toEqual(false);
    result = notSupportedFutureDatedTransfer({});
    expect(result).toEqual(false);
  });
});

describe("Testing updateAccountsForEligibility", () => {
  it(">> should just return existing state for wrong name", () => {
    const state = {
      ...transferStateMock,
      to: "",
      from: ""
    };
    const result = updateAccountsForEligibility(state, "amount", "100");
    expect(result.to).toEqual("");
    expect(result.from).toEqual("");
    expect(result.primary).toEqual(primaryOptions.notSelected);
    expect(result.fromAccountsFormatted).toMatchObject(
      state.fromAccountsFormatted
    );
    expect(result.toAccountsFormatted).toMatchObject(state.toAccountsFormatted);
  });
  it(">> should update primary flag properly", () => {
    const state = {
      ...transferStateMock,
      to: "",
      from: "account_01_NoFee",
      toCurrency: "",
      fromCurrency: "Excellent Currency"
    };
    let result = updateAccountsForEligibility(
      state,
      "from",
      "account_01_NoFee"
    );
    expect(result.to).toEqual("");
    expect(result.from).toEqual("account_01_NoFee");
    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromCurrency).toEqual("Excellent Currency");
    expect(result.toCurrency).toEqual("");
    const differentState = {
      ...transferStateMock,
      to: "account_01_NoFee",
      from: "",
      toCurrency: "Another Excellent Currency",
      fromCurrency: "Excellent Currency"
    };
    result = updateAccountsForEligibility(
      differentState,
      "to",
      "account_01_NoFee"
    );
    expect(result.to).toEqual("account_01_NoFee");
    expect(result.from).toEqual("");
    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromCurrency).toEqual("Excellent Currency");
    expect(result.toCurrency).toEqual("Another Excellent Currency");
  });

  it(">> should return same state on garbage for from field", () => {
    const state = {
      ...transferStateMock,
      fromAccounts: [],
      to: "",
      from: "account_01_NoFee"
    };
    let result = updateAccountsForEligibility(
      state,
      "from",
      "account_01_NoFee"
    );
    expect(result.to).toEqual("");
    expect(result.from).toEqual("account_01_NoFee");
    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject(
      state.fromAccountsFormatted
    );
    expect(result.toAccountsFormatted).toMatchObject(state.toAccountsFormatted);

    const secondState = {
      ...transferStateMock,
      to: "",
      from: "account_01_NoFee"
    };

    result = updateAccountsForEligibility(secondState, "from", "Elvis");
    expect(result.to).toEqual("");
    expect(result.from).toEqual("account_01_NoFee");
    expect(result.primary).toEqual(primaryOptions.selectedFrom);
    expect(result.fromAccountsFormatted).toMatchObject(
      secondState.fromAccountsFormatted
    );
    expect(result.toAccountsFormatted).toMatchObject(
      secondState.toAccountsFormatted
    );
  });

  it(">> should return same state on garbage for to field", () => {
    const state = {
      ...transferStateMock,
      toAccounts: [],
      from: "",
      to: "account_01_NoFee"
    };
    let result = updateAccountsForEligibility(state, "to", "account_01_NoFee");
    expect(result.to).toEqual("account_01_NoFee");
    expect(result.from).toEqual("");
    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject(
      state.fromAccountsFormatted
    );
    expect(result.toAccountsFormatted).toMatchObject(state.toAccountsFormatted);

    const secondState = {
      ...transferStateMock,
      from: "",
      to: "account_01_NoFee"
    };

    result = updateAccountsForEligibility(secondState, "to", "Presley");
    expect(result.from).toEqual("");
    expect(result.to).toEqual("account_01_NoFee");
    expect(result.primary).toEqual(primaryOptions.selectedTo);
    expect(result.fromAccountsFormatted).toMatchObject(
      secondState.fromAccountsFormatted
    );
    expect(result.toAccountsFormatted).toMatchObject(
      secondState.toAccountsFormatted
    );
  });

  it(">> should clear to state", () => {
    const state = {
      ...transferStateMock,
      to: "account_03_LLOC",
      from: "account_03_LLOC",
      primary: primaryOptions.selectedFrom
    };
    const result = updateAccountsForEligibility(
      state,
      "from",
      "account_03_LLOC"
    );
    expect(result.to).toEqual("");
    expect(result.from).toEqual("account_03_LLOC");
    expect(result.fromAccountsFormatted).toMatchObject(
      state.fromAccountsFormatted
    );
    // test in getEligibleFormattedAccounts
    // expect(result.toAccountsFormatted).toMatchObject(state.toAccountsFormatted);
  });
  it(">> should clear from state", () => {
    const state = {
      ...transferStateMock,
      to: "account_03_LLOC",
      from: "account_03_LLOC",
      primary: primaryOptions.selectedTo
    };
    const result = updateAccountsForEligibility(state, "to", "account_03_LLOC");
    expect(result.from).toEqual("");
    expect(result.to).toEqual("account_03_LLOC");
    expect(result.toAccountsFormatted).toMatchObject(state.toAccountsFormatted);
  });
  it(">> should return proper value for removeSelectedAccount", () => {});
  it(">> should get formated to accounts", () => {});
  it(">> should get formated from accounts", () => {});
});

describe(">> testing removeSelectedAccount", () => {
  it(">> should return proper value", () => {
    const accounts = [{ id: "id1" }, { id: "id2" }];
    let result = removeSelectedAccount(accounts, "id1");
    expect(result).toMatchObject([{ id: "id2" }]);
    result = removeSelectedAccount(accounts, "id3");
    expect(result).toMatchObject([{ id: "id1" }, { id: "id2" }]);
    result = removeSelectedAccount(null, "id3");
    expect(result).toMatchObject([]);
    result = removeSelectedAccount(undefined, "id3");
    expect(result).toMatchObject([]);
    result = removeSelectedAccount("", "id3");
    expect(result).toMatchObject([]);
    result = removeSelectedAccount([], "id3");
    expect(result).toMatchObject([]);
  });
});

describe(">> testing getEligibleFormattedAccounts", () => {
  it(">> should return empty array for garbage", () => {
    let result = getEligibleFormattedAccounts(null, ["item1", "item2"]);
    expect(result).toEqual([]);
    result = getEligibleFormattedAccounts([], ["item1", "item2"]);
    expect(result).toEqual([]);
    result = getEligibleFormattedAccounts(undefined, ["item1", "item2"]);
    expect(result).toEqual([]);
    result = getEligibleFormattedAccounts("", ["item1", "item2"]);
    expect(result).toEqual([]);
    result = getEligibleFormattedAccounts(
      [account01noFee, account02SPRINGBOARD],
      ""
    );
    expect(result).toEqual([]);

    // this in now not empty
    result = getEligibleFormattedAccounts(
      [account01noFee, account02SPRINGBOARD],
      []
    );
    expect(result).not.toEqual([]);
    result = getEligibleFormattedAccounts(
      [account01noFee, account02SPRINGBOARD],
      null
    );
    expect(result).toEqual([]);
    result = getEligibleFormattedAccounts(
      [account01noFee, account02SPRINGBOARD],
      undefined
    );
    expect(result).toEqual([]);

    // verify different currency account is disabled
    result = getEligibleFormattedAccounts(
      [account01noFee, account01noFeeUSD, account02SPRINGBOARDUSD],
      account02SPRINGBOARDUSD.eligibleToAccounts,
      "USD"
    );

    expect(result[0].value).toEqual("account_01_NoFee_USD");
    expect(result[1].value).toEqual("account_02_SPRINGBOARD_USD");
    expect(result[2].value).toEqual("divider");
    expect(result[3].value).toEqual("account_01_NoFee");
    expect(result[3].disabled).toBeTruthy();

    // verify different currency account is NOT disabled
    result = getEligibleFormattedAccounts(
      [account01noFee, account01noFeeUSD, account02SPRINGBOARDUSD],
      account02SPRINGBOARDUSD.eligibleToAccounts,
      null
    );

    expect(result.length).toEqual(3);
    expect(result[1].value).toEqual("account_01_NoFee_USD");
    expect(result[2].value).toEqual("account_02_SPRINGBOARD_USD");
    expect(result[0].value).toEqual("account_01_NoFee");
  });
});

describe(">> testing getCurrencies", () => {
  const state = {
    toCurrency: "CAD",
    fromCurrency: "CAD",
    toAccounts: [{ id: "id1", currency: "EUR" }],
    fromAccounts: [{ id: "id2", currency: "RSD" }]
  };
  it(">> should preparte data properly", () => {
    let res = getCurrencies(state, "to", "id1");
    expect(res).toMatchObject({
      toCurrency: "EUR",
      fromCurrency: "CAD",
      isDisplayedToAmount: true
    });

    res = getCurrencies(state, "from", "id2");
    expect(res).toMatchObject({
      toCurrency: "CAD",
      fromCurrency: "RSD",
      isDisplayedToAmount: true
    });

    res = getCurrencies(state, null, "id1");
    expect(res).toMatchObject({
      toCurrency: "CAD",
      fromCurrency: "CAD",
      isDisplayedToAmount: false
    });

    res = getCurrencies(state, null, "garbage");
    expect(res).toMatchObject({
      toCurrency: "CAD",
      fromCurrency: "CAD",
      isDisplayedToAmount: false
    });

    const otherState = { ...state, toAccounts: [] };
    res = getCurrencies(otherState, "to", "id1");
    expect(res).toMatchObject({
      toCurrency: "CAD",
      fromCurrency: "CAD",
      isDisplayedToAmount: false
    });

    const someOtherState = { ...state, fromAccounts: [] };
    res = getCurrencies(someOtherState, "from", "id1");
    expect(res).toMatchObject({
      toCurrency: "CAD",
      fromCurrency: "CAD",
      isDisplayedToAmount: false
    });
  });
});

describe(">> testing prepareDataForExchangeAPICall", () => {
  it(">> should prepare data properly", () => {
    let res = prepareDataForExchangeAPICall("amount", "100.34", "CAD", "USD");
    expect(res).toMatchObject({
      fromAmount: null,
      toAmount: "100.34",
      fromCurrency: "CAD",
      toCurrency: "USD"
    });

    res = prepareDataForExchangeAPICall("amountTo", "100.34", "CAD", "USD");
    expect(res).toMatchObject({
      fromAmount: "100.34",
      toAmount: null,
      fromCurrency: "CAD",
      toCurrency: "USD"
    });
  });
});

describe(">> testing isFutureDateCrossCurrency", () => {
  const state = {
    toCurrency: "CAD",
    fromCurrency: "CAD",
    fromAccounts: [
      { id: "toCAD", name: "toCAD", currency: "CAD" },
      { id: "toUSD", name: "toUSD", currency: "USD" }
    ],
    toAccounts: [
      { id: "toCAD", name: "toCAD", currency: "CAD" },
      { id: "toUSD", name: "toUSD", currency: "USD" }
    ],
    when: dayjs().add(1, "day"),
    isDisplayedToAmount: false
  };

  it(">> should not be true if TO is not cross currency", () => {
    const res = futureDateCrossCurrency(state, "to", "toCAD");
    expect(res.isFutureDatedCrossCurrency).toBe(false);
  });
  it(">> should be true if TO cross currency changed", () => {
    const res = futureDateCrossCurrency(state, "to", "toUSD");
    expect(res.isFutureDatedCrossCurrency).toBe(true);
  });
  it(">> should not be true if FROM is not cross currency", () => {
    const res = futureDateCrossCurrency(state, "from", "toCAD");
    expect(res.isFutureDatedCrossCurrency).toBe(false);
  });
  it(">> should be true if FROM cross currency changed", () => {
    const res = futureDateCrossCurrency(state, "from", "toUSD");
    expect(res.isFutureDatedCrossCurrency).toBe(true);
  });
});

describe("testing isToAccountValid", () => {
  it(">> should return transferErrors.MSG_RBTR_046 when balance is zero", () => {
    const state = {
      preparedDataForPost: { amount: { value: 100 } },
      toAccounts: [{ type: "Loan", id: "id", balance: { value: 0 } }],
      to: "id"
    };
    const message = isToAccountValid(state);
    expect(message).toMatchObject(transferErrors.MSG_RBTR_046());
  });
  it(">> should return transferErrors.MSG_RBTR_047 when paying over balance", () => {
    const state = {
      preparedDataForPost: { amount: { value: 100 } },
      toAccounts: [{ type: "Loan", id: "id", balance: { value: 10 } }],
      to: "id"
    };
    const message = isToAccountValid(state);
    expect(message).toMatchObject(transferErrors.MSG_RBTR_047());
  });
  it(">> should return null where account type is not loan", () => {
    const state = {
      preparedDataForPost: { amount: { value: 100 } },
      toAccounts: [{ type: "NotLoan", id: "id", balance: { value: 10 } }],
      to: "id"
    };
    const message = isToAccountValid(state);
    expect(message).toEqual(null);
  });
  it(">> should return null on bad data", () => {
    let state = null;
    let message = isToAccountValid(state);
    expect(message).toEqual(null);

    state = {
      preparedDataForPost: {},
      toAccounts: [{ type: "Loan", id: "id", balance: { value: 10 } }],
      to: "id"
    };
    message = isToAccountValid(state);
    expect(message).toEqual(null);

    state = {
      preparedDataForPost: { amount: { value: 100 } },
      toAccounts: [{ type: "Loan", id: "id", balance: { value: 10 } }],
      to: ""
    };
    message = isToAccountValid(state);
    expect(message).toEqual(null);

    state = {
      preparedDataForPost: { amount: { value: 100 } },
      toAccounts: [],
      to: "id"
    };
    message = isToAccountValid(state);
    expect(message).toEqual(null);
  });
});

describe("testing prepareOneTimeDataToPost", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });
  afterEach(() => {
    MockDate.reset();
  });
  const state = {
    when: dayjs("Jan 30, 2019", "MMM DD, YYYY"),
    toCurrency: "CAD",
    fromCurrency: "CAD",
    amount: "$75.00",
    amountTo: "$100.00",
    to: "to",
    from: "from"
  };
  it(">> should properly prepare state for same currency", () => {
    let res = prepareOneTimeDataToPost(state);
    expect(res).toMatchObject({
      amount: { currency: "CAD", value: 75 },
      fromAccountId: "from",
      toAccountId: "to",
      transferType: "Immediate"
    });
    const bothAccountsUSDState = {
      ...state,
      fromCurrency: "USD",
      toCurrency: "USD"
    };
    res = prepareOneTimeDataToPost(bothAccountsUSDState);
    expect(res).toMatchObject({
      amount: { currency: "USD", value: 75 },
      fromAccountId: "from",
      toAccountId: "to",
      transferType: "Immediate"
    });
    const bothUSDAccountsFutureDate = {
      ...bothAccountsUSDState,
      when: dayjs("Mar 30, 2019", "MMM DD, YYYY")
    };
    res = prepareOneTimeDataToPost(bothUSDAccountsFutureDate);
    expect(res).toMatchObject({
      amount: { currency: "USD", value: 75 },
      fromAccountId: "from",
      toAccountId: "to",
      transferType: "FutureDated"
    });
  });
  it(">> should properly prepare state for cross currency", () => {
    const fromCADAccountState = { ...state, toCurrency: "USD" };
    let res = prepareOneTimeDataToPost(fromCADAccountState);
    expect(res).toMatchObject({
      amount: { currency: "USD", value: "100.00" },
      fromAccountId: "from",
      toAccountId: "to",
      transferType: "Immediate",
      netAmount: { currency: "CAD", value: 75 }
    });
    const fromUSDAccountState = { ...state, fromCurrency: "USD" };
    res = prepareOneTimeDataToPost(fromUSDAccountState);
    expect(res).toMatchObject({
      amount: { currency: "CAD", value: "100.00" },
      fromAccountId: "from",
      toAccountId: "to",
      transferType: "Immediate",
      netAmount: { currency: "USD", value: 75 }
    });
  });
});
describe(">> testing getInitialTransferAccounts", () => {
  const fromBankAccount = {
    accountId: "from-account",
    routingId: "01234",
    country: "CAD"
  };
  const toBankAccount = {
    accountId: "to-account",
    routingId: "56789",
    country: "CAD"
  };

  const state = {
    fromAccounts: [{ id: "from-account-id", bankAccount: fromBankAccount }],
    toAccounts: [{ id: "to-account-id", bankAccount: toBankAccount }]
  };

  it(">> should return to and from as undefined if new accounts are undefined", () => {
    const accounts = getInitialTransferAccounts(state, {});
    expect(accounts.to).toBeUndefined();
    expect(accounts.from).toBeUndefined();
  });

  it(">> should return to and from as undefined if new accounts are not found in account lists", () => {
    const accounts = getInitialTransferAccounts(state, {
      from: {
        accountId: "will",
        routingId: "not",
        country: "find"
      },
      to: {
        accountId: "not",
        routingId: "in",
        country: "list"
      }
    });
    expect(accounts.to).toBeUndefined();
    expect(accounts.from).toBeUndefined();
  });
  it(">> should return to and from as undefined if new accounts are not valid bank account objects", () => {
    const accounts = getInitialTransferAccounts(state, {
      from: "from-account",
      to: "to-account"
    });
    expect(accounts.to).toBeUndefined();
    expect(accounts.from).toBeUndefined();
  });

  it(">> should return new account ids if new bank accounts also exist in account lists", () => {
    const accounts = getInitialTransferAccounts(state, {
      from: fromBankAccount,
      to: toBankAccount
    });
    expect(accounts.to).toBe("to-account-id");
    expect(accounts.from).toBe("from-account-id");
  });
});
