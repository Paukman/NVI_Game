import { renderHook, act } from "@testing-library/react-hooks";
import useAddPayeeReducer, {
  initialState,
  LOADING_DATA,
  LOADING_DATA_FAILED,
  LOADED_DATA,
  ON_CHANGE,
  SEARCH_COMPLETED,
  SELECTED_PAYEE
} from "./useAddPayeeReducer";

describe("useAddPayeeReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: "Some gibberish type" }));
    expect(result.current[0]).toEqual(initialState);
  });
  it(">> should set the correct state when user is with success", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: LOADING_DATA }));
    expect(result.current[0].loading).toBe(true);
    const data = [{ 1: "1", 2: "" }];
    act(() => dispatch({ type: LOADED_DATA, data }));
    expect(result.current[0].loading).toBe(false);
    expect(result.current[0].approvedCreditors).toMatchObject([
      { 1: "1", 2: "" }
    ]);
  });
  it(">> loading data failed", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const dispatch = result.current[1];
    const failedState = {
      ...initialState,
      error: true,
      loading: false
    };
    act(() => dispatch({ type: LOADING_DATA_FAILED }));
    expect(result.current[0]).toEqual(failedState);
  });
  it(">> ON_CHANGE", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const dispatch = result.current[1];
    const data = {
      name: "payeeName",
      value: "HOGG"
    };
    act(() => dispatch({ type: ON_CHANGE, data }));
    expect(result.current[0].payeeName).toEqual("HOGG");
  });
  it(">> it can set state on SEARCH_COMPLETED for payeeName.length > 3 and searchResults > 0", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const dispatch = result.current[1];
    let data = {
      name: "payeeName",
      value: "HOGG"
    };
    act(() => dispatch({ type: ON_CHANGE, data }));
    const results = [1, 2, 3, 4];
    act(() => dispatch({ type: SEARCH_COMPLETED, results }));
    expect(result.current[0].disabled).toEqual(false);
    expect(result.current[0].searchResults).toMatchObject(results);
    data = {
      name: "payeeName",
      value: ""
    };
    act(() => dispatch({ type: ON_CHANGE, data }));
    expect(result.current[0].payeeName).toEqual("");
    expect(result.current[0].disabled).toEqual(true);
  });
  it(">> it can set state on SEARCH_COMPLETED for payeeName.length =< 3 and searchResults === 0", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const dispatch = result.current[1];
    const data = {
      name: "payeeName",
      value: "HOG"
    };
    act(() => dispatch({ type: ON_CHANGE, data }));
    const results = [];
    act(() => dispatch({ type: SEARCH_COMPLETED, results }));
    expect(result.current[0].disabled).toEqual(true);
    expect(result.current[0].searchResults).toMatchObject(results);
  });
  it(">> it can set state on SELECTED_PAYEE ", () => {
    const { result } = renderHook(() => useAddPayeeReducer());
    const dispatch = result.current[1];
    const data = { data: "some account" };
    act(() => dispatch({ type: SELECTED_PAYEE, data }));
    expect(result.current[0].selectedPayee).toMatchObject(data);
  });
});
