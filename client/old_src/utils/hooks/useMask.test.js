import { renderHook, act } from "@testing-library/react-hooks";

import useMask from "./useMask";

describe("useMask hook", () => {
  it(">> should update the states of input when onChange is called", async done => {
    const maskFunction = value => {
      return `$${value}`;
    };
    const unmaskFuntion = value => {
      return value.substr(0);
    };
    const { result } = renderHook(() => useMask(maskFunction, unmaskFuntion), {
      initialProps: { maskFunction, unmaskFuntion }
    });

    const [maskedValue, unmaskedValue, onChange] = result.current;
    expect(maskedValue).toBe(undefined);
    expect(unmaskedValue).toBe(undefined);
    expect(onChange).toEqual(expect.any(Function));
    act(() => {
      onChange("123");
    });
    const [newMaskedValue, newUnmaskedValue] = result.current;
    expect(newMaskedValue).toBe("$123");
    expect(newUnmaskedValue).toBe("123");
    done();
  });
});
