import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import AddPayee from "BillPayment/AddPayee/AddPayee";
import useOneTimeReducer, {
  ON_CHANGE,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  CLEAN_FORM,
  initialState,
  addTestAccount
} from "./useOneTimeReducer";
import {
  payBillDataMock,
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES
} from "./constants";

const fromAccounts = [
  {
    text: "No-Fee All-In Account (7679) | $93,428.49 CAD",
    key: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU",
    value: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
  },
  {
    text: "Springboard Savings Account (1479) | $42,442.26 CAD",
    key: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk",
    value: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
  }
];
const billPayees = [
  {
    text: <AddPayee />,
    key: "add-payee",
    value: "add-payee"
  },
  {
    key: "1967",
    text: "TELUS MOBILITY (1967)",
    value: "1967"
  },
  {
    key: "0056",
    text: "WESTBURNE WEST (0056)",
    value: "0056"
  }
];
describe("useOneTimeReducer hook", () => {
  it(">> should set the correct state when user is with success", () => {
    const { result } = renderHook(() => useOneTimeReducer());
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
    expect(result.current[0].fromAccountsFormatted[1]).toEqual(fromAccounts[1]);
    expect(result.current[0].billPayeesFormatted.toString()).toEqual(
      [
        {
          text: <AddPayee />,
          key: "add-payee",
          value: "add-payee"
        },
        ...billPayees
      ].toString()
    );
  });
  it(">> loading data failed", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];
    const failedState = {
      ...initialState,
      error: true
    };
    act(() => dispatch({ type: LOADING_DATA_FAILED }));
    expect(result.current[0]).toEqual(failedState);
  });
  it(">> on change handler ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];
    const nextState = {
      ...initialState,
      from: "fromAccount",
      to: "toAccount",
      amount: 10,
      when: "now",
      note: "note",
      error: false,
      loading: false
    };
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "from", value: "fromAccount" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "to", value: "toAccount" } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "amount", value: 10 } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "when", value: "now" } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "note", value: "note" } })
    );
    expect(result.current[0]).toEqual(nextState);
  });
  it(">> PREPARE_DATA_FOR_REVIEW call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
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
        data: { name: "from", value: fromAccounts[0].key }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: billPayees[0].key }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_REVIEW }));
    expect(result.current[0].preparedDataForReview).toHaveProperty("Amount");
  });
  it(">> PREPARE_DATA_FOR_POST call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
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
        data: { name: "from", value: fromAccounts[0].key }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: billPayees[0].key }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_POST }));
    expect(result.current[0].preparedDataForPost).toHaveProperty("billPayeeId");
  });
  it(">> CLEAN_FORM call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "from", value: "fromAccount" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "to", value: "toAccount" } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "amount", value: 10 } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "when", value: "now" } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "note", value: "note" } })
    );
    const nextState = {
      ...initialState,
      from: "fromAccount",
      to: "toAccount",
      amount: 10,
      when: "now",
      note: "note",
      error: false,
      loading: false
    };
    expect(result.current[0]).toEqual(nextState);
    act(() => dispatch({ type: CLEAN_FORM }));
    const nextCleanState = {
      ...initialState,
      from: "",
      to: "",
      amount: "",
      note: "",
      error: false,
      loading: false
    };
    expect(result.current[0].from).toEqual(nextCleanState.from);
    expect(result.current[0].to).toEqual(nextCleanState.to);
    expect(result.current[0].amount).toEqual(nextCleanState.amount);
    expect(result.current[0].note).toEqual(nextCleanState.note);
  });
  it(">> fire undefined ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];
    act(() => dispatch({ type: "UNKNOWN" }));
    const nextState = {
      ...initialState,
      fromAccounts: [],
      fromAccountsFormatted: [],
      from: "",
      billPayees: [],
      billPayeesFormatted: [],
      to: "",
      amount: "",
      note: "",
      loading: false,
      error: false,
      preparedDataForReview: {}
    };
    expect(result.current[0].from).toEqual(nextState.from);
    expect(result.current[0].to).toEqual(nextState.to);
    expect(result.current[0].amount).toEqual(nextState.amount);
    expect(result.current[0].note).toEqual(nextState.note);
    expect(result.current[0].error).toEqual(nextState.error);
    expect(result.current[0].preparedDataForReview).toEqual(
      nextState.preparedDataForReview
    );
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
  it(">> should call UPDATE_EXCHANGE_RATE call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];

    const nextState = {
      ...initialState,
      exchangeRate: "1.50000",
      exchangeRateFormatted: "$1 CAD = $1.5000 USD",
      amountTo: "$150.00",
      fromCurrency: "CAD",
      toCurrency: "USD"
    };

    const nextNextState = {
      ...initialState,
      exchangeRate: "1.50000",
      exchangeRateFormatted: "$1 CAD = $1.5000 USD",
      amount: "$100.00",
      amountTo: "$150.00",
      fromCurrency: "CAD",
      toCurrency: "USD"
    };

    const data = {
      result: {
        data: {
          exchangeRate: 1.5,
          toAmount: "150.00",
          fromAmount: "100.00"
        }
      },
      fieldToUpdate: "amountTo"
    };

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "fromCurrency", value: "CAD" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "toCurrency", value: "USD" } })
    );

    act(() => dispatch({ type: UPDATE_EXCHANGE_RATE, data }));
    expect(result.current[0]).toEqual(nextState);

    act(() =>
      dispatch({
        type: UPDATE_EXCHANGE_RATE,
        data: { ...data, fieldToUpdate: "amount" }
      })
    );
    expect(result.current[0]).toEqual(nextNextState);
  });
  it(">> should call UPDATE_CURRENCIES call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];

    const data = {
      fromBillAccounts: payBillDataMock.fromBillAccounts,
      billPayees: payBillDataMock.billPayees
    };
    act(() => dispatch({ type: LOADED_DATA, data }));

    const toAccountChangeData = {
      name: "to",
      value: "1967"
    };

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "fromCurrency", value: "USD" }
      })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "toCurrency", value: "USD" } })
    );
    act(() =>
      dispatch({ type: ON_CHANGE, data: { name: "amountTo", value: "150.00" } })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "exchangeRateFormatted", value: "$1 CAD = $1.5000 USD" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "exchangeRate", value: "1.50000" }
      })
    );

    act(() => dispatch({ type: UPDATE_CURRENCIES, data: toAccountChangeData }));
    expect(result.current[0].exchangeRate).toEqual("1.50000");
    expect(result.current[0].exchangeRateFormatted).toEqual(
      "$1 CAD = $1.5000 USD"
    );
    expect(result.current[0].toCurrency).toEqual("CAD");
    expect(result.current[0].fromCurrency).toEqual("USD");
    expect(result.current[0].isDisplayedToAmount).toEqual(true);
    expect(result.current[0].amountTo).toEqual("150.00");

    // clean now with same to and from currency
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "fromCurrency", value: "CAD" }
      })
    );
    act(() => dispatch({ type: UPDATE_CURRENCIES, data: toAccountChangeData }));
    expect(result.current[0].exchangeRate).toEqual("");
    expect(result.current[0].exchangeRateFormatted).toEqual("");
    expect(result.current[0].toCurrency).toEqual("CAD");
    expect(result.current[0].fromCurrency).toEqual("CAD");
    expect(result.current[0].isDisplayedToAmount).toEqual(false);
    expect(result.current[0].amountTo).toEqual("");
  });
});
