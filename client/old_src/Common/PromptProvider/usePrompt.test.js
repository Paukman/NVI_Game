import React from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import usePrompt from "./usePrompt";

const Wrapper = (location, hide, show) => {
  const Component = props => {
    const { children } = props;
    return (
      <RenderWithProviders location={location} hide={hide} show={show}>
        {children}
      </RenderWithProviders>
    );
  };
  Component.propTypes = {
    children: PropTypes.element.isRequired
  };
  return Component;
};

describe("Testing usePrompt", () => {
  it(">> should block location", async () => {
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => usePrompt(), {
      wrapper: Wrapper("/test", hide, show)
    });
    expect(result.current.promptState).toMatchObject({
      blocked: false,
      showModal: false,
      confirm: false
    });
    act(() => result.current.blockLocation());
    expect(result.current.promptState).toMatchObject({
      blocked: true,
      showModal: false,
      confirm: false
    });

    act(() => result.current.history.push("/new-1"));

    expect(result.current.promptState).toMatchObject({
      blocked: true,
      showModal: true,
      confirm: false
    });

    act(() => result.current.history.push("/new-2"));
    act(() => result.current.onCancel());

    expect(result.current.promptState).toMatchObject({
      blocked: true,
      showModal: false,
      confirm: false
    });
    act(() => result.current.history.push("/new-3"));
    expect(result.current.promptState).toMatchObject({
      blocked: true,
      showModal: true,
      confirm: false
    });

    expect(result.current.nextLocation.current.pathname).toEqual("/new-3");
    act(() => result.current.onCommit());
    expect(result.current.promptState).toMatchObject({
      blocked: false,
      showModal: false,
      confirm: true
    });
  });
  it(">> should block when browser is closing", async () => {
    window.confirm = jest.fn;
    window.onbeforeunload = () => jest.fn();
    const hide = jest.fn();
    const show = jest.fn();
    const { result } = renderHook(() => usePrompt(), {
      wrapper: Wrapper("/test", hide, show)
    });
    expect(result.current.promptState).toMatchObject({
      blockedCloseBrowser: false,
      blocked: false,
      showModal: false,
      confirm: false
    });
    act(() => result.current.blockClosingBrowser());
    expect(result.current.promptState).toMatchObject({
      blockedCloseBrowser: true,
      blocked: false,
      showModal: false,
      confirm: false
    });
    expect(window.onbeforeunload()).toBe(true);
    act(() => result.current.onCommit());
    expect(result.current.promptState).toMatchObject({
      blockedCloseBrowser: false,
      blocked: false,
      showModal: false,
      confirm: true
    });
    expect(window.onbeforeunload()).toBe(null);
  });
});
