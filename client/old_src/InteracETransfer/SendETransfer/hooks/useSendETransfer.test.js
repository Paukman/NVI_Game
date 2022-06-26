import { renderHook, act } from "@testing-library/react-hooks";
import useSendETransfer from "./useSendETransfer";

describe("Testing useSendETransfer hook", () => {
  it(">> should change value and clean value", async () => {
    let hook;
    await act(async () => {
      hook = renderHook(() =>
        useSendETransfer(() => ({
          showErrorModal: jest.fn()
        }))
      );
    });
    const { result } = hook;
    expect(result.current.sendState.to).toEqual("");
    await act(async () => {
      result.current.onChange({ name: "to", value: "some account" });
    });
    expect(result.current.sendState.to).toEqual("some account");
    await act(async () => {
      result.current.onCleanForm();
    });
    expect(result.current.sendState.to).toEqual("");
  });
});
