import { renderHook, act } from "@testing-library/react-hooks";
import { windowMatchMediaMock } from "utils/TestUtils";
import useCounter from "./useCounter";

describe("Testing useCounter", () => {
  beforeEach(() => {
    windowMatchMediaMock();
  });

  it(">> shud return on empty message", async () => {
    const form = {
      setFieldsValue: jest.fn()
    };
    const updateText = jest.fn();
    const { result } = renderHook(() =>
      useCounter(10, form, "field", "helper text", updateText)
    );
    const [updateCounter] = result.current;
    await act(async () => updateCounter(null));
    expect(form.setFieldsValue).toBeCalledTimes(0);
    expect(updateText).toBeCalledTimes(0);
  });
});
