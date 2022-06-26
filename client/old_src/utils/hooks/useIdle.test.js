import { renderHook } from "@testing-library/react-hooks";
import useIdle from "./useIdle";

const DELAY = 500;

describe("useIdle hook", () => {
  it(">> should set idle state after time out on the next state ", async () => {
    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ delay }) => useIdle(delay),
      { initialProps: { delay: DELAY } }
    );
    const [isIdle] = result.current;
    expect(isIdle).toEqual(false);
    // next tick should be still idle = false
    const [nextIsIdle] = result.current;
    expect(nextIsIdle).toEqual(false);
    rerender({ delay: 100 });
    await waitForNextUpdate();
    const [newIsIdle] = result.current;
    expect(newIsIdle).toEqual(true);
  });
  it(">> should release resources on unmount ", async () => {
    const { result, unmount } = renderHook(({ delay }) => useIdle(delay), {
      initialProps: { delay: DELAY }
    });
    // on unmount clear resources
    unmount();
    const [isIdle, timerId] = result.current;
    expect(isIdle).toEqual(false);
    expect(timerId.current).toEqual(null);
  });
});
