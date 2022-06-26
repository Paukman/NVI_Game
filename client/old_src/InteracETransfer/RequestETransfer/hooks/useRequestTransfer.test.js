import { renderHook, act } from "@testing-library/react-hooks";
import useRequestETransfer from "./useRequestETransfer";

describe("Testing useRequestETransfer hook", () => {
  it(">> should change value and clean value", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() => useRequestETransfer(() => null));
    });
    const { result } = hook;
    expect(result.current.requestState.from).toEqual("");
    await act(async () => {
      result.current.onChange({ name: "from", value: "some account" });
    });
    expect(result.current.requestState.from).toEqual("some account");
    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.requestState.from).toEqual("");
  });
});
