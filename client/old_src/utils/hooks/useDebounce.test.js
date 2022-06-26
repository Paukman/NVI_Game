import { renderHook } from "@testing-library/react-hooks";
import useDebounce from "./useDebounce";

const DELAY = 500;

describe("useDebounce hook", () => {
  it(">> should set the debounced value after some delay", async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: DELAY } }
    );
    expect(result.current.debouncedValue).toEqual("a");
    expect(result.current.value).toEqual("a");
    rerender({ value: "ab" });
    expect(result.current.debouncedValue).toEqual("a");
    await waitForNextUpdate();
    expect(result.current.debouncedValue).toEqual("ab");
  });
  it(">> should release resources on unmount ", async () => {
    const { result, rerender, unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: DELAY } }
    );
    expect(result.current.debouncedValue).toEqual("a");
    expect(result.current.value).toEqual("a");
    rerender({ value: "ab" });
    unmount();
    expect(result.current.debouncedValue).toEqual("a");
  });
});
