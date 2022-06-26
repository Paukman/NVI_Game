import { renderHook, act } from "@testing-library/react-hooks";
import useOneTimeReducer, { initialState } from "./useOneTimeReducer";
import {
  transferDataMock,
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  ON_CHANGE,
  PREPARE_DATA_FOR_REVIEW,
  PREPARE_DATA_FOR_POST,
  CLEAN_FORM,
  UPDATE_EXCHANGE_RATE,
  UPDATE_CURRENCIES
} from "./constants";

describe("useTransfersOneTimeReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: "Some gibberish type" }));
    expect(result.current[0]).toEqual(initialState);
  });

  it(">> should set the correct state when data fetched successfully for from and to accounts", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);

    act(() => dispatch({ type: LOADING_DATA }));
    expect(result.current[0].loading).toBe(true);
    const data = {
      toAccounts: transferDataMock.toAccounts,
      fromAccounts: transferDataMock.fromAccounts,
      immediateTransferAccounts: transferDataMock.immediateTransferAccounts,
      futureDatedTransferAccounts: transferDataMock.futureDatedTransferAccounts,
      recurringAccounts: transferDataMock.recurringAccounts
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].fromAccountsFormatted[1]).toEqual(
      transferDataMock.fromAccountsFormatted[1]
    );
    expect(result.current[0].toAccountsFormatted.toString()).toEqual(
      transferDataMock.toAccountsFormatted.toString()
    );
  });
  it(">> loading data failed", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];
    const failedState = {
      ...initialState,
      error: true,
      loading: false
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
    expect(result.current[0]).toEqual(nextState);
  });

  it(">> PREPARE_DATA_FOR_REVIEW call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];

    const data = {
      toAccounts: transferDataMock.toAccounts,
      fromAccounts: transferDataMock.fromAccounts,
      immediateTransferAccounts: transferDataMock.immediateTransferAccounts,
      futureDatedTransferAccounts: transferDataMock.futureDatedTransferAccounts,
      recurringAccounts: transferDataMock.recurringAccounts
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].preparedDataForReview).toEqual({});
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: transferDataMock.fromAccountsFormatted[0].key
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: transferDataMock.toAccountsFormatted[1].key }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_REVIEW }));
    expect(result.current[0].preparedDataForReview).toHaveProperty("Amount");
  });

  it(">> PREPARE_DATA_FOR_POST call ", () => {
    const { result } = renderHook(() => useOneTimeReducer());
    const dispatch = result.current[1];

    const data = {
      toAccounts: transferDataMock.toAccounts,
      fromAccounts: transferDataMock.fromAccounts,
      immediateTransferAccounts: transferDataMock.immediateTransferAccounts,
      futureDatedTransferAccounts: transferDataMock.futureDatedTransferAccounts,
      recurringAccounts: transferDataMock.recurringAccounts
    };
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].preparedDataForPost).toEqual({});
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: {
          name: "from",
          value: transferDataMock.fromAccountsFormatted[0].key
        }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "to", value: transferDataMock.toAccountsFormatted[1].key }
      })
    );
    act(() => dispatch({ type: PREPARE_DATA_FOR_POST }));
    expect(result.current[0].preparedDataForPost).toHaveProperty(
      "transferType"
    );
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

    const nextState = {
      ...initialState,
      from: "fromAccount",
      to: "toAccount",
      amount: 10,
      when: "now",
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
      toAccounts: [],
      toAccountsFormatted: [],
      to: "",
      amount: "",
      loading: false,
      error: false,
      preparedDataForReview: {}
    };
    expect(result.current[0].from).toEqual(nextState.from);
    expect(result.current[0].to).toEqual(nextState.to);
    expect(result.current[0].amount).toEqual(nextState.amount);
    expect(result.current[0].error).toEqual(nextState.error);
    expect(result.current[0].preparedDataForReview).toEqual(
      nextState.preparedDataForReview
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
      toAccounts: transferDataMock.toAccounts,
      fromAccounts: transferDataMock.fromAccounts,
      immediateTransferAccounts: transferDataMock.immediateTransferAccounts,
      futureDatedTransferAccounts: transferDataMock.futureDatedTransferAccounts,
      recurringAccounts: transferDataMock.recurringAccounts
    };
    act(() => dispatch({ type: LOADED_DATA, data }));

    const toAccountChangeData = {
      name: "to",
      value: "33ZFwIxk3ZebPZZx1bDHj3QahD-kTKacqITUUtv2Ecw"
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
