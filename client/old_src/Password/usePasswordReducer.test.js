import { renderHook, act } from "@testing-library/react-hooks";
import { authenticationErrors } from "utils/MessageCatalog";
import usePasswordReducer, { initialState } from "./usePasswordReducer";
import { ON_BLUR, ON_CHANGE, VALIDATE_FORM } from "./constants";

describe("usePasswordReducer hook", () => {
  it(">> should return default state", () => {
    const { result } = renderHook(() => usePasswordReducer());
    const [state, dispatch] = result.current;
    expect(state).toEqual(initialState);

    act(() => dispatch({ type: ON_CHANGE, data: { name: "blah", value: "" } }));
    act(() => dispatch({ type: ON_BLUR, data: { name: "blah", value: "" } }));
    expect(result.current[0]).toEqual(initialState);
  });
  it(">> should reduce ON_CHANGE validate password ", () => {
    const { result } = renderHook(() => usePasswordReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "" }
      })
    );
    expect(result.current[0].confirmPassword.validateStatus).toEqual("error");
    expect(result.current[0].confirmPassword.value).toEqual("");
    expect(result.current[0].confirmPassword.errorMsg).toEqual(
      authenticationErrors.MSG_RBAUTH_004
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "a" }
      })
    );
    expect(result.current[0].password.value).toEqual("a");
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "b" }
      })
    );
    expect(result.current[0].confirmPassword.validateStatus).toEqual("success");
    expect(result.current[0].confirmPassword.value).toEqual("b");
    expect(result.current[0].confirmPassword.errorMsg).toEqual(null);
    act(() => dispatch({ type: VALIDATE_FORM }));
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "currentPassword", value: "abc" }
      })
    );
    expect(result.current[0].currentPassword.value).toEqual("abc");
  });
  it(">> should reduce ON_CHANGE validate password ", () => {
    const { result } = renderHook(() => usePasswordReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "" }
      })
    );
    expect(result.current[0].password.types).toEqual([
      "LengthError",
      "UppercaseError",
      "LowercaseError",
      "DigitError",
      "SpecialCharacterError"
    ]);
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A" }
      })
    );
    expect(result.current[0].password.types).toEqual([
      "LengthError",
      "LowercaseError",
      "DigitError",
      "SpecialCharacterError"
    ]);
    act(() => dispatch({ type: VALIDATE_FORM }));
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A1" }
      })
    );
    expect(result.current[0].password.types).toEqual([
      "LengthError",
      "LowercaseError",
      "SpecialCharacterError"
    ]);
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A1a" }
      })
    );
    expect(result.current[0].password.types).toEqual([
      "LengthError",
      "SpecialCharacterError"
    ]);
    expect(result.current[0].isFormValid).toEqual(false);

    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A1a!" }
      })
    );
    expect(result.current[0].password.types).toEqual(["LengthError"]);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A1a!1234" }
      })
    );
    expect(result.current[0].password.types).toEqual([]);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "A1a!1234" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "currentPassword", value: "Test123" }
      })
    );
    expect(result.current[0].isFormValid).toEqual(true);
  });
  it(">> should reduce ON_CHANGE and ON_BLUR", () => {
    const { result } = renderHook(() => usePasswordReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "abc" }
      })
    );
    expect(result.current[0].password.value).toEqual("abc");
    act(() => dispatch({ type: VALIDATE_FORM }));
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "currentPassword", value: "abc" }
      })
    );
    expect(result.current[0].currentPassword.value).toEqual("abc");
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "abc" }
      })
    );
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_BLUR,
        data: { name: "confirmPassword", value: "abc" }
      })
    );
    expect(result.current[0].isFormValid).toEqual(false);
    expect(result.current[0].confirmPassword.validateStatus).toEqual("error");
    expect(result.current[0].confirmPassword.value).toEqual("abc");
    expect(result.current[0].confirmPassword.errorMsg).toEqual(
      authenticationErrors.MSG_RBAUTH_011B
    );
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "abcd" }
      })
    );
    act(() =>
      dispatch({
        type: ON_BLUR,
        data: { name: "confirmPassword", value: "abcd" }
      })
    );
    act(() => dispatch({ type: VALIDATE_FORM }));
    expect(result.current[0].isFormValid).toEqual(false);
    expect(result.current[0].confirmPassword.validateStatus).toEqual("success");
    expect(result.current[0].confirmPassword.value).toEqual("abcd");
    expect(result.current[0].confirmPassword.errorMsg).toEqual(null);
  });
  it(">> should reduce VALIDATE_FORM (check if all conditions are met) ", () => {
    const { result } = renderHook(() => usePasswordReducer());
    const dispatch = result.current[1];
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "password", value: "A1a!1234" }
      })
    );
    act(() =>
      dispatch({
        type: VALIDATE_FORM
      })
    );
    expect(result.current[0].isFormValid).toEqual(false);
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "currentPassword", value: "A" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "A1a!1234" }
      })
    );
    expect(result.current[0].isFormValid).toEqual(true);
    // confirm password is the same as current password
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "currentPassword", value: "A1a!1234" }
      })
    );
    act(() =>
      dispatch({
        type: ON_CHANGE,
        data: { name: "confirmPassword", value: "A1a!1234" }
      })
    );
    expect(result.current[0].isFormValid).toEqual(true);
  });
});
