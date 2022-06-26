import { renderHook, act } from "@testing-library/react-hooks";
import useAutodepositReducer, {
  initialState,
  LOADING_DATA,
  DATA_LOADING_FAILED,
  DATA_LOADED,
  ON_CHANGE,
  REGISTER,
  HIDESIDEBAR,
  UPDATE_RULES
} from "./useAutodepositReducer";
import { testAutodeposit } from "../constants";

describe("useAutodepositReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: "Some gibberish type" }));
    expect(result.current[0]).toEqual(initialState);
  });
  it(">> should LOADING_DATA state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: LOADING_DATA }));
    expect(result.current[0].loading).toEqual(true);
    // expect(result.current[0].error).toEqual({ type: null }); // ATTODO
  });
  it(">> should DATA_LOADING_FAILED state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const dispatch = result.current[1];
    act(() => dispatch({ type: DATA_LOADING_FAILED }));
    expect(result.current[0].loading).toEqual(false);
    // expect(result.current[0].error).toEqual({ type: null }); // ATTODO
  });
  it(">> should DATA_LOADED state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    const accounts = [
      {
        name: "some account",
        id: "1",
        number: "customer id",
        bankAccount: {
          country: "CA",
          routingId: "021908859",
          accountId: "0000000734458979"
        }
      }
    ];
    const data = {
      accounts,
      legalName: "",
      rules: testAutodeposit.autodepositState.rules
    };
    act(() => dispatch({ type: DATA_LOADED, data }));
    expect(result.current[0].loading).toEqual(false);
    expect(result.current[0].error).toEqual({ type: null });
    expect(result.current[0].accounts).toEqual(accounts);
    expect(result.current[0].formattedAccountOptions).toEqual([
      {
        key: "1",
        text: "some account (customer id)",
        value: "1"
      }
    ]);
  });
  it(">> should ON_CHANGE state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    const changes = {
      name: "email",
      value: "bond_james@email.com"
    };
    act(() => dispatch({ type: ON_CHANGE, data: changes }));
    const { email } = result.current[0];
    expect(email).toEqual("bond_james@email.com");
  });
  it(">> should REGISTER state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    const { mode } = result.current[0];
    expect(mode).toEqual("");
    act(() => dispatch({ type: REGISTER }));
    expect(result.current[0].mode).toEqual("CREATE");
  });

  it(">> should change email on ON_CHANGE", () => {
    const email = "test@attb.com";
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() =>
      dispatch({
        type: "ON_CHANGE",
        data: {
          name: "email",
          value: email
        }
      })
    );
    expect(result.current[0].email).toEqual(email);
  });

  it(">> CLEAR_AUTO_DEPOSIT_FORM should clear email, account and mode value", () => {
    const email = "test@attb.com";
    const account = "12345678";
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() =>
      dispatch({
        type: "REGISTER"
      })
    );
    act(() =>
      dispatch({
        type: "ON_CHANGE",
        data: {
          name: "email",
          value: email
        }
      })
    );
    act(() =>
      dispatch({
        type: "ON_CHANGE",
        data: {
          name: "account",
          value: account
        }
      })
    );
    expect(result.current[0].mode).toEqual("CREATE");
    expect(result.current[0].email).toEqual(email);
    expect(result.current[0].account).toEqual(account);
    act(() =>
      dispatch({
        type: "CLEAR_AUTO_DEPOSIT_FORM"
      })
    );
    expect(result.current[0].mode).toEqual("");
    expect(result.current[0].email).toEqual("");
    expect(result.current[0].account).toEqual("");
  });

  it(">> should HIDESIDEBAR state", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    const { hideSidebar } = result.current[0];
    expect(hideSidebar).toEqual("show");
    act(() =>
      dispatch({
        type: HIDESIDEBAR,
        data: {
          hideSidebar: "hidden"
        }
      })
    );
    expect(result.current[0].hideSidebar).toEqual("hidden");
  });
  it(">> should set autodepositRule to edit on SET_AUTODEPOSIT", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() =>
      dispatch({
        type: "SET_AUTODEPOSIT",
        data: {
          autodepositRule: testAutodeposit.autodepositState.rules[0],
          mode: "UPDATE"
        }
      })
    );
    expect(result.current[0].autodepositRule).toEqual(
      testAutodeposit.autodepositState.rules[0]
    );
  });
  it(">> should set updated list of rules on UPDATE_RULES", () => {
    const { result } = renderHook(() => useAutodepositReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    const { rules } = testAutodeposit.autodepositState;
    const currentCount = testAutodeposit.autodepositState.rules.length;
    const data = {
      accounts: [
        {
          name: "some account",
          id: "1",
          number: "customer id",
          bankAccount: {
            country: "CA",
            routingId: "021908859",
            accountId: "0000000734458979"
          }
        }
      ],
      legalName: "",
      autodeposits: rules
    };
    act(() => dispatch({ type: DATA_LOADED, data }));
    expect(result.current[0].loading).toEqual(false);
    expect(result.current[0].rules).toEqual(rules);
    const updatedRules = rules.splice(1);
    act(() => dispatch({ type: UPDATE_RULES, data: updatedRules }));
    expect(result.current[0].rules.length).toEqual(currentCount - 1);
  });
});
