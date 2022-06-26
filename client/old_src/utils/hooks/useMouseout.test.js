import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { fireEvent } from "@testing-library/react";

import useMouseout from "./useMouseout";

const DELAY = 500;

describe("useMouseout hook", () => {
  it(">>> set the mouseout state on mouseover and mouseout events", async () => {
    const ref = React.createRef();
    ref.current = document.body;
    const { result, waitForNextUpdate } = renderHook(
      ({ mouseRef, delay }) => useMouseout(mouseRef, delay),
      { initialProps: { delay: DELAY, mouseRef: ref } }
    );
    act(() => {
      fireEvent(ref.current, new Event("mouseover"));
    });
    expect(result.current[0]).toEqual(false);

    act(() => {
      fireEvent(ref.current, new Event("mouseout"));
    });
    await waitForNextUpdate();
    expect(result.current[0]).toEqual(true);
  });
});
