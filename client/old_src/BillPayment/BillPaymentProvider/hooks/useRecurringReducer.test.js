import { renderHook, act } from "@testing-library/react-hooks";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import useRecurringReducer, {
  initialState,
  addTestAccount,
  ON_CHANGE,
  PREPARE_DATA_FOR_REVIEW,
  CLEAN_FORM,
  UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE,
  PREPARE_DATA_FOR_POST,
  UPDATE_SUCCESS_MESSAGE,
  POSTING
} from "./useRecurringReducer";
import {
  payBillDataMock,
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA
} from "./constants";
import { endingOptions, primaryOptions } from "../../constants";

dayjs.extend(customParseFormat);

describe("useRecurringReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);

    act(() => dispatch({ type: "Some gibberish type" }));
    expect(result.current[0]).toEqual(initialState);
  });
  it(">> should set the correct state when user is with success", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);

    act(() => dispatch({ type: LOADING_DATA }));
    expect(result.current[0].loading).toBe(true);
    const data = {
      fromBillAccounts: payBillDataMock.fromBillAccounts,
      billPayees: payBillDataMock.billPayees
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].fromAccountsFormatted[0]).toEqual(
      payBillDataMock.fromAccountsFormatted[0]
    );
    expect(result.current[0].billPayeesFormatted.toString()).toEqual(
      payBillDataMock.billPayeesFormatted.toString()
    );
  });
  it(">> loading data failed", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    const failedState = {
      ...initialState,
      error: true
    };
    act(() => dispatch({ type: LOADING_DATA_FAILED }));
    expect(result.current[0]).toEqual(failedState);
  });
  it(">> should reduce ON_CHANGE ", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    const nextState = {
      ...initialState,
      from: payBillDataMock.fromAccountsFormatted[0].key,
      to: payBillDataMock.billPayeesFormatted[1].key,
      billPayeesFormatted: [],
      fromAccounts: [],
      amount: 10,
      frequency: "frequency",
      starting: "now",
      ending: "in future",
      note: "note",
      numberOfPayments: "gazillion",
      endingOption: "never ever",
      primary: "notSelected",
      fromCurrency: "",
      toCurrency: ""
    };
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: payBillDataMock.fromAccountsFormatted[0].key
        }
      })
    );

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: payBillDataMock.billPayeesFormatted[1].key }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "amount", value: 10 } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "starting", value: "now" } })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "ending", value: "in future" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "frequency" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "numberOfPayments", value: "gazillion" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: "never ever" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "note", value: "note" } })
    );
    expect(result.current[0]).toEqual(nextState);
  });
  it(">> should reduce PREPARE_DATA_FOR_REVIEW", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];

    const data = {
      fromBillAccounts: payBillDataMock.fromBillAccounts,
      billPayees: payBillDataMock.billPayees
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].preparedDataForReview).toEqual({});
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: payBillDataMock.fromAccountsFormatted[0].key
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: payBillDataMock.billPayeesFormatted[0].key }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "weekly" }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_REVIEW }));
    expect(result.current[0].preparedDataForReview).toHaveProperty("Amount");
    expect(result.current[0].preparedDataForReview).toHaveProperty("Frequency");
    expect(result.current[0].preparedDataForReview.Frequency.label).toEqual(
      "Weekly"
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "garbage" }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_REVIEW }));
    expect(result.current[0].preparedDataForReview.Frequency.label).toEqual("");
  });
  it(">> should reduce CLEAN_FORM ", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: payBillDataMock.fromAccountsFormatted[0].key
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: payBillDataMock.billPayeesFormatted[1].key }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "amount", value: 10 } })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "starting", value: "starting" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "frequency" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: "endingOption" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "ending", value: "ending" } })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "numberOfPayments", value: "numberOfPayments" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "note", value: "note" } })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "reviewEnding", value: "reviewEnding" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "reviewNumberOfPayments",
          value: "reviewNumberOfPayments"
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "endDateNoOfPaymentsMessage",
          value: "endDateNoOfPaymentsMessage"
        }
      })
    );
    const nextState = {
      ...initialState,
      from: payBillDataMock.fromAccountsFormatted[0].key,
      to: payBillDataMock.billPayeesFormatted[1].key,
      amount: 10,
      frequency: "frequency",
      starting: "starting",
      endingOption: "endingOption",
      ending: "ending",
      reviewEnding: "reviewEnding",
      numberOfPayments: "numberOfPayments",
      reviewNumberOfPayments: "reviewNumberOfPayments",
      endDateNoOfPaymentsMessage: "endDateNoOfPaymentsMessage",
      note: "note",
      billPayeesFormatted: [],
      primary: primaryOptions.notSelected,
      fromCurrency: "",
      toCurrency: ""
    };
    expect(result.current[0]).toEqual(nextState);
    act(() => dispatch({ type: CLEAN_FORM }));
    const nextCleanState = {
      ...initialState,
      from: "",
      to: "",
      amount: "",
      frequency: "",
      // starting: dayjs().add(1, "day"), cannot test this, since it is dynamic
      endingOption: endingOptions.never,
      ending: null,
      reviewEnding: "",
      numberOfPayments: "",
      reviewNumberOfPayments: "",
      endDateNoOfPaymentsMessage: "",
      note: ""
    };
    expect(result.current[0].from).toEqual(nextCleanState.from);
    expect(result.current[0].to).toEqual(nextCleanState.to);
    expect(result.current[0].amount).toEqual(nextCleanState.amount);
    expect(result.current[0].frequency).toEqual(nextCleanState.frequency);
    expect(result.current[0].endingOption).toEqual(nextCleanState.endingOption);
    expect(result.current[0].ending).toEqual(nextCleanState.ending);
    expect(result.current[0].reviewEnding).toEqual(nextCleanState.reviewEnding);
    expect(result.current[0].numberOfPayments).toEqual(
      nextCleanState.numberOfPayments
    );
    expect(result.current[0].reviewNumberOfPayments).toEqual(
      nextCleanState.reviewNumberOfPayments
    );
    expect(result.current[0].endDateNoOfPaymentsMessage).toEqual(
      nextCleanState.endDateNoOfPaymentsMessage
    );
    expect(result.current[0].note).toEqual(nextCleanState.note);
  });
  it(">> fire undefined ", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    act(() => dispatch({ type: "UNKNOWN" }));
    const nextState = {
      ...initialState
    };
    expect(result.current[0].from).toEqual(nextState.from);
    expect(result.current[0].to).toEqual(nextState.to);
    expect(result.current[0].amount).toEqual(nextState.amount);
    expect(result.current[0].frequency).toEqual(nextState.frequency);
    expect(result.current[0].endingOption).toEqual(nextState.endingOption);
    expect(result.current[0].preparedDataForReview).toEqual(
      nextState.preparedDataForReview
    );
    expect(result.current[0].ending).toEqual(nextState.ending);
    expect(result.current[0].reviewEnding).toEqual(nextState.reviewEnding);
    expect(result.current[0].numberOfPayments).toEqual(
      nextState.numberOfPayments
    );
    expect(result.current[0].reviewNumberOfPayments).toEqual(
      nextState.reviewNumberOfPayments
    );
    expect(result.current[0].endDateNoOfPaymentsMessage).toEqual(
      nextState.endDateNoOfPaymentsMessage
    );
    expect(result.current[0].note).toEqual(nextState.note);
  });
  it(">> should reduce UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "frequency", value: "weekly" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "starting",
          value: dayjs("Apr 01, 2020", "MMM DD, YYYY")
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "ending",
          value: dayjs("May 01, 2020", "MMM DD, YYYY")
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: endingOptions.endDate }
      })
    );

    act(() => dispatch({ type: UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE }));
    expect(result.current[0].endDateNoOfPaymentsMessage).toEqual(
      "Number of payments: 5"
    );
    expect(result.current[0].reviewNumberOfPayments).toEqual(5);
    // have to do this way because of discrepancy between local and pipeline
    expect(result.current[0].reviewEnding.toString()).toContain(
      "Fri, 01 May 2020"
    );

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "endingOption", value: endingOptions.numberOfPayments }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "numberOfPayments", value: 5 }
      })
    );
    act(() => dispatch({ type: UPDATE_END_DATE_NO_OF_PAYMENTS_MESSAGE }));
    expect(result.current[0].endDateNoOfPaymentsMessage).toEqual(
      "End date: Apr 29, 2020"
    );
    expect(result.current[0].reviewNumberOfPayments).toEqual(5);
    expect(result.current[0].reviewEnding).toEqual("Apr 29, 2020");
  });
  it(">> should reduce POSTING", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    expect(result.current[0].isPosting).toEqual(false);
    act(() => dispatch({ type: POSTING, data: true }));
    expect(result.current[0].isPosting).toEqual(true);
  });
  it(">> should reduce PREPARE_DATA_FOR_POST", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];

    const data = {
      fromBillAccounts: payBillDataMock.fromBillAccounts,
      billPayees: payBillDataMock.billPayees
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].preparedDataForPost).toEqual({});
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: payBillDataMock.fromAccountsFormatted[0].key
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: payBillDataMock.billPayeesFormatted[0].key }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_POST }));
    expect(result.current[0].preparedDataForPost).toHaveProperty("billPayeeId");
  });
  it(">> should reduce UPDATE_SUCCESS_MESSAGE", () => {
    const { result } = renderHook(() => useRecurringReducer());
    const dispatch = result.current[1];
    expect(result.current[0].successMessage).toEqual("");
    act(() =>
      dispatch({ type: UPDATE_SUCCESS_MESSAGE, data: "My success message" })
    );
    expect(result.current[0].successMessage).toEqual("My success message");
  });
  it(">> should return proper value from addTestAccount", () => {
    const action = {
      data: {
        fromBillAccounts: payBillDataMock.fromBillAccounts,
        billPayees: payBillDataMock.billPayees
      }
    };
    const ret = addTestAccount(initialState, action);
    const numberOfAccounts = ret.fromAccountsFormatted.length;
    expect(ret.fromAccountsFormatted[numberOfAccounts - 1].text).toEqual(
      "CREDIT CARD TEST ACCOUNT (7679) | $89,486.63 CAD"
    );
    expect(ret.fromAccountsFormatted[numberOfAccounts - 1].key).toEqual(
      "testid"
    );
  });
});
