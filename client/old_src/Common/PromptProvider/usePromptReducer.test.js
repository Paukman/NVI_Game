import { renderHook, act } from "@testing-library/react-hooks";
import usePromptReducer, {
  BLOCK_LOCATION,
  BLOCK_CLOSING_BROWSER,
  SHOW_MODAL,
  COMMIT,
  CANCEL,
  initialState
} from "./usePromptReducer";

describe("usePromptReducer hook", () => {
  it(">> dispatching actions and setting the state", () => {
    const { result } = renderHook(() => usePromptReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: "UNDEFINED" }));
    expect(state).toEqual(initialState);
    act(() => dispatch({ type: BLOCK_LOCATION }));
    expect(result.current[0].blocked).toBe(true);
    expect(result.current[0].showModal).toBe(false);
    expect(result.current[0].confirm).toBe(false);

    act(() => dispatch({ type: SHOW_MODAL, data: true }));

    expect(result.current[0].showModal).toBe(true);
    act(() => dispatch({ type: COMMIT }));
    expect(result.current[0].blocked).toBe(false);
    expect(result.current[0].confirm).toBe(true);
    expect(result.current[0].showModal).toBe(false);

    act(() => dispatch({ type: BLOCK_LOCATION }));
    expect(result.current[0].blocked).toBe(true);
    expect(result.current[0].showModal).toBe(false);
    expect(result.current[0].confirm).toBe(false);
    act(() => dispatch({ type: SHOW_MODAL, data: true }));
    act(() => dispatch({ type: CANCEL }));
    expect(result.current[0].showModal).toBe(false);

    act(() => dispatch({ type: BLOCK_CLOSING_BROWSER }));
    expect(result.current[0].blockedCloseBrowser).toBe(true);
    expect(result.current[0].showModal).toBe(false);
    expect(result.current[0].confirm).toBe(false);
    act(() => dispatch({ type: SHOW_MODAL, data: true }));
    act(() => dispatch({ type: CANCEL }));
    expect(result.current[0].showModal).toBe(false);
  });
});
