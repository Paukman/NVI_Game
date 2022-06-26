import { renderHook, act } from "@testing-library/react-hooks";
import useAutoLogout from "./useAutoLogout";

describe("useAutoLogout hook", () => {
  it(">> should set the state on idle ", async () => {
    jest.useFakeTimers();
    let hook;
    await act(async () => {
      hook = renderHook(idleTime => useAutoLogout(idleTime), {
        initialProps: { idleTime: 1 }
      });
    });
    const { result } = hook;
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 120 });
    expect(result.current.isIdle).toBe(false);
    expect(result.current.show).toBe(false);
    expect(result.current.intervalId.current).toEqual(null);
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    expect(result.current.intervalId.current).not.toEqual(null);
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 60 });
    expect(result.current.show).toBe(true);
    expect(result.current.isIdle).toBe(true);
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });

    expect(result.current.intervalId.current).toEqual(null);
    expect(result.current.time).toMatchObject({ minutes: 1, seconds: 0 });
    expect(result.current.show).toBe(false);
    expect(result.current.isIdle).toBe(true);
  });

  it(">> should set state on handleContinue ", async () => {
    jest.useFakeTimers();
    let hook;
    await act(async () => {
      hook = renderHook(idleTime => useAutoLogout(idleTime), {
        initialProps: { idleTime: 1 }
      });
    });
    const { result } = hook;
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 120 });
    expect(result.current.isIdle).toBe(false);
    expect(result.current.show).toBe(false);
    expect(result.current.intervalId.current).toEqual(null);
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    expect(result.current.intervalId.current).not.toEqual(null);
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 60 });
    expect(result.current.show).toBe(true);
    expect(result.current.isIdle).toBe(true);
    await act(async () => {
      result.current.handleContinue();
    });
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 120 });
    expect(result.current.show).toBe(false);
    expect(result.current.intervalId.current).toEqual(null);
  });
  it(">> should set state on handleLogout ", async () => {
    jest.useFakeTimers();
    let hook;
    await act(async () => {
      hook = renderHook(idleTime => useAutoLogout(idleTime), {
        initialProps: { idleTime: 1 }
      });
    });
    const { result } = hook;
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 120 });
    expect(result.current.isIdle).toBe(false);
    expect(result.current.show).toBe(false);
    expect(result.current.intervalId.current).toEqual(null);
    await act(async () => {
      jest.advanceTimersByTime(60000);
    });
    expect(result.current.intervalId.current).not.toEqual(null);
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 60 });
    expect(result.current.show).toBe(true);
    expect(result.current.isIdle).toBe(true);
    await act(async () => {
      result.current.handleLogout();
    });
    expect(result.current.time).toMatchObject({ minutes: 2, seconds: 60 });
    expect(result.current.show).toBe(false);
    expect(result.current.intervalId.current).toEqual(null);
  });
});
