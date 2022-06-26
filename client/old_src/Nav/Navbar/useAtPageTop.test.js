import React, { createRef } from "react";
import PropTypes from "prop-types";
import { renderHook, act } from "@testing-library/react-hooks";
import { RenderWithProviders } from "utils/TestUtils";
import useAtPageTop from "./useAtPageTop";

const Wrapper = (location = "/") => {
  const Component = ({ children }) => (
    <RenderWithProviders location={location}>{children}</RenderWithProviders>
  );

  Component.propTypes = {
    children: PropTypes.node.isRequired
  };
  return Component;
};

describe("useAtPageTop", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(">> should call observe when hook mounts and unobserve when hook unmounts", async () => {
    const ref = createRef();
    ref.current = document.body;

    const observe = jest.fn();
    const unobserve = jest.fn();

    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve
    }));

    let hook;
    await act(async () => {
      hook = renderHook(({ mouseRef }) => useAtPageTop(mouseRef), {
        initialProps: { mouseRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result, unmount } = hook;

    expect(result.current.atPageTop).toBe(true);
    expect(observe).toBeCalledTimes(1);
    expect(observe).toBeCalledWith(ref.current);

    unmount();

    expect(unobserve).toBeCalledTimes(1);
    expect(unobserve).toBeCalledWith(ref.current);
  });

  it(">> should not observe or unobserve if ref.current has no node", async () => {
    const ref = createRef();
    ref.current = undefined;

    const observe = jest.fn();
    const unobserve = jest.fn();

    window.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe,
      unobserve
    }));

    let hook;
    await act(async () => {
      hook = renderHook(({ mouseRef }) => useAtPageTop(mouseRef), {
        initialProps: { mouseRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result, unmount } = hook;

    expect(result.current.atPageTop).toBe(true);
    expect(observe).not.toBeCalled();

    unmount();

    expect(unobserve).not.toBeCalled();
  });

  it(">> should set atPageTop to true when top of page is intersects with viewport", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ mouseRef }) => useAtPageTop(mouseRef), {
        initialProps: { mouseRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result } = hook;

    expect(result.current.atPageTop).toBe(true);

    const observerCallback = global.IntersectionObserver.mock.calls[0][0];
    await act(async () => {
      observerCallback([{ intersectionRatio: 1, isIntersecting: true }]);
    });

    expect(result.current.atPageTop).toBe(true);
  });

  it(">> should set atPageTop to false when top of page does not intersect with viewport", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ mouseRef }) => useAtPageTop(mouseRef), {
        initialProps: { mouseRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result } = hook;

    expect(result.current.atPageTop).toBe(true);

    const observerCallback = global.IntersectionObserver.mock.calls[0][0];
    await act(async () => {
      observerCallback([{ intersectionRatio: 1, isIntersecting: false }]);
    });

    expect(result.current.atPageTop).toBe(false);
  });

  it(">> should not set atPageTop intersection ratio does not exist", async () => {
    const ref = createRef();
    ref.current = document.body;

    let hook;
    await act(async () => {
      hook = renderHook(({ mouseRef }) => useAtPageTop(mouseRef), {
        initialProps: { mouseRef: ref },
        wrapper: Wrapper()
      });
    });

    const { result } = hook;

    expect(result.current.atPageTop).toBe(true);

    const observerCallback = global.IntersectionObserver.mock.calls[0][0];
    await act(async () => {
      observerCallback([{ isIntersecting: false }]);
    });

    expect(result.current.atPageTop).toBe(true);
  });
});
