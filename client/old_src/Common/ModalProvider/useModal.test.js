import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import useModal from "./useModal";

const initialState = {
  show: false,
  closeOnDimmerClick: false,
  closeOnEscape: true,
  modalClassName: "",
  contentClassName: "",
  actionsClassName: "",
  headerClassName: "",
  size: "mini",
  content: null,
  modalHeader: null,
  actions: null
};
describe("useModal hook", () => {
  it(">> renders the initial state ", async () => {
    const { result } = renderHook(useModal);
    expect(result.current.modalState.show).toEqual(initialState.show);
    expect(result.current.modalState.closeOnDimmerClick).toEqual(
      initialState.closeOnDimmerClick
    );
    expect(result.current.modalState.closeOnEscape).toEqual(
      initialState.closeOnEscape
    );
    expect(result.current.modalState.content).toEqual(initialState.content);
    expect(result.current.modalState.modalClassName).toEqual(
      initialState.modalClassName
    );
    expect(result.current.modalState.contentClassName).toEqual(
      initialState.contentClassName
    );
    expect(result.current.modalState.actionsClassName).toEqual(
      initialState.actionsClassName
    );
    expect(result.current.modalState.size).toEqual(initialState.size);
    expect(result.current.modalState.modalHeader).toEqual(
      initialState.modalHeader
    );
    expect(result.current.modalState.actions).toEqual(initialState.actions);
    expect(result.current.onCloseHandler).toBeNull();
  });
  it(">> sets the correct state ", async () => {
    const { result } = renderHook(useModal);
    act(() => {
      result.current.show({
        modalClassName: "modal_className",
        contentClassName: "content_className",
        actionsClassName: "actions_className",
        headerClassName: "header_className",
        size: "large",
        content: "Hello",
        modalHeader: "some_header",
        actions: null
      });
    });
    expect(result.current.modalState.show).toEqual(true);
    expect(result.current.modalState.closeOnDimmerClick).toEqual(false);
    expect(result.current.modalState.closeOnEscape).toEqual(true);
    expect(result.current.modalState.content).toEqual("Hello");
    expect(result.current.modalState.modalClassName).toEqual("modal_className");
    expect(result.current.modalState.contentClassName).toEqual(
      "content_className"
    );
    expect(result.current.modalState.actionsClassName).toEqual(
      "actions_className"
    );
    expect(result.current.modalState.size).toEqual("large");
    expect(result.current.modalState.modalHeader).toEqual("some_header");
    expect(result.current.modalState.actions).toEqual(null);
    expect(result.current.onCloseHandler).toBeNull();
  });
  it(">> sets all defaults when show is called empty ", async () => {
    const { result } = renderHook(useModal);
    act(() => {
      result.current.show({});
    });
    expect(result.current.modalState.show).toEqual(true);
    expect(result.current.modalState.closeOnDimmerClick).toEqual(false);
    expect(result.current.modalState.closeOnEscape).toEqual(true);
    expect(result.current.modalState.content).toEqual(initialState.content);
    expect(result.current.modalState.modalClassName).toEqual(
      initialState.modalClassName
    );
    expect(result.current.modalState.contentClassName).toEqual(
      initialState.contentClassName
    );
    expect(result.current.modalState.actionsClassName).toEqual(
      initialState.actionsClassName
    );
    expect(result.current.modalState.size).toEqual(initialState.size);
    expect(result.current.modalState.modalHeader).toEqual(
      initialState.modalHeader
    );
    expect(result.current.modalState.actions).toEqual(null);
    expect(result.current.onCloseHandler).toBeNull();
  });
  it("can show and hide the modal", () => {
    const { result } = renderHook(useModal);
    expect(result.current.modalState.show).toEqual(false);
    act(() => {
      result.current.show({});
    });
    expect(result.current.modalState.show).toEqual(true);
    act(() => {
      result.current.hide();
    });
    expect(result.current.modalState.show).toEqual(false);
  });
  it("can render react elements", () => {
    const { result } = renderHook(useModal);
    const handleOnClick = jest.fn();
    const reactEl = (
      <button type="button" onClick={handleOnClick}>
        Hello
      </button>
    );
    act(() => {
      result.current.show({
        actions: reactEl
      });
    });
    result.current.modalState.actions.props.onClick();
    expect(handleOnClick).toHaveBeenCalledTimes(1);
  });
  it("does nothing when call show when unmounted", () => {
    const { result, unmount } = renderHook(useModal);
    unmount();
    let showCompnent = null;
    act(() => {
      showCompnent = result.current.show({
        size: "large",
        content: "Hello"
      });
    });
    expect(showCompnent).toEqual(undefined);
  });
  it("does not set state on unmount when hide is called", () => {
    const { result, unmount } = renderHook(useModal);
    act(() => {
      result.current.show({
        size: "large",
        content: "Hello"
      });
    });

    expect(result.current.modalState.show).toEqual(true);
    unmount();
    act(() => {
      result.current.hide();
    });
    expect(result.current.modalState.show).toEqual(true);
  });

  it("it sets and calls hide is called", () => {
    const handleOnClose = jest.fn();

    const { result } = renderHook(useModal);
    act(() => {
      result.current.show({
        size: "large",
        content: "Hello",
        modalHeader: "some_header",
        actions: null,
        onClose: () => {
          handleOnClose();
        }
      });
    });

    expect(result.current.modalState.show).toEqual(true);
    act(() => {
      result.current.hide();
    });
    expect(handleOnClose).toBeCalled();
    expect(handleOnClose).toBeCalledTimes(1);
  });
});
