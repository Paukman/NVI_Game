import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import useSnackbar from "./useSnackbar";

const initialState = {
  open: false,
  message: "",
  className: "",
  onClose: () => null,
  autoHideDuration: 5000,
  anchorOrigin: { vertical: "bottom", horizontal: "left" }
};
describe("useSnackbar hook", () => {
  it(">> sets the correct state ", async () => {
    const { result } = renderHook(useSnackbar);
    expect(JSON.stringify(result.current.snackbarState)).toEqual(
      JSON.stringify(initialState)
    );
    act(() => {
      result.current.openSnackbar({
        message: "Hello",
        className: "custom-class",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        },
        onClose: () => 123
      });
    });
    expect(result.current.snackbarState.open).toEqual(true);
    expect(result.current.snackbarState.onClose).toEqual(expect.any(Function));
    expect(result.current.snackbarState.onClose.toString()).toEqual(
      "() => 123"
    );
    expect(result.current.snackbarState.message).toEqual("Hello");
    expect(result.current.snackbarState.className).toEqual("custom-class");
    expect(result.current.snackbarState.anchorOrigin).toEqual({
      vertical: "bottom",
      horizontal: "right"
    });
  });
  it("can open and close the snackbar", () => {
    const { result, unmount } = renderHook(useSnackbar);
    act(() => {
      result.current.openSnackbar({ message: "Hello", autoHideDuration: 4000 });
    });
    expect(result.current.snackbarState.autoHideDuration).toEqual(4000);
    let onClose = jest.fn();
    act(() => {
      result.current.openSnackbar({ message: "Hello", onClose });
    });

    expect(result.current.snackbarState.open).toEqual(true);
    act(() => {
      result.current.close("", "timeout");
    });
    expect(result.current.snackbarState.onClose).toHaveBeenCalledTimes(1);
    expect(result.current.snackbarState.open).toEqual(false);
    onClose = jest.fn();
    act(() => {
      result.current.openSnackbar({ message: "Hello", onClose });
    });
    unmount();
    act(() => {
      result.current.close("", "timeout");
    });
    expect(result.current.snackbarState.onClose).toHaveBeenCalledTimes(0);
    expect(result.current.snackbarState.open).toEqual(true);
  });
  it("can manually close it", () => {
    const { result } = renderHook(useSnackbar);
    act(() => {
      result.current.openSnackbar({ message: "Hello", autoHideDuration: 4000 });
    });
    const onClose = jest.fn();
    act(() => {
      result.current.openSnackbar({ message: "Hello", onClose });
    });
    act(() => {
      result.current.manualClose();
    });
    expect(result.current.snackbarState.open).toEqual(false);
  });
  it("can render react elements", () => {
    const { result } = renderHook(useSnackbar);
    const handleOnClick = jest.fn();
    const reactEl = (
      <button type="button" onClick={handleOnClick}>
        Hello
      </button>
    );
    act(() => {
      result.current.openSnackbar({
        message: reactEl
      });
    });
    result.current.snackbarState.message.props.onClick();
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });
});
