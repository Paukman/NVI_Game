import { renderHook, act } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

import useScroll from "./useScroll";

const DELAY = 500;

describe("useScroll hook", () => {
  it(">> should state of scrollY, scrollX, scrollDirection using throttle", done => {
    const { result } = renderHook(({ delay }) => useScroll(delay), {
      initialProps: { delay: DELAY }
    });
    window.document.body.getBoundingClientRect = jest.fn(() => {
      return {
        width: 120,
        height: 120,
        top: 10,
        left: 10,
        bottom: 20,
        right: 0
      };
    });
    act(() => {
      fireEvent.scroll(window);
    });

    const [scrollY, scrollX, scrollDirection, lastScrollTop] = result.current;
    expect(scrollY).toEqual(-10);
    expect(scrollX).toEqual(10);
    expect(scrollDirection).toEqual("down");
    expect(lastScrollTop).toEqual(-10);
    window.document.body.getBoundingClientRect = jest.fn(() => {
      return {
        width: 120,
        height: 120,
        top: 100,
        left: 10,
        bottom: 20,
        right: 0
      };
    });
    act(() => {
      fireEvent.scroll(window);
    });
    // expect the previous value, throttle should prevent it calling it again in this time interval
    expect(scrollY).toEqual(-10);
    expect(scrollX).toEqual(10);
    expect(scrollDirection).toEqual("down");
    expect(lastScrollTop).toEqual(-10);
    setTimeout(() => {
      act(() => {
        fireEvent.scroll(window);
      });
      expect(result.current).toEqual([-100, 10, "down", -100]);
      done();
    }, 1000);
  });
});
