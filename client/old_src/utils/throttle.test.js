import throttle from "./throttle";

const DELAY = 500;

describe("throttle function", () => {
  it(">> should execute the callback once every 500 milliseconds", done => {
    const callback = jest.fn();
    const func = throttle(DELAY, callback);
    let result = func();
    expect(result.called).toBe(true);
    expect(callback).toHaveBeenCalled();
    result = func();
    expect(result.called).toBe(false);
    setTimeout(() => {
      result = func();
      expect(result.called).toBe(true);
      done();
    }, DELAY + 1);
  });
  it(">> should return function with the correct args", () => {
    const callback = jest.fn();
    const func = throttle(DELAY, callback);
    expect(...func({ foo: "bar" }).args).toEqual({ foo: "bar" });
    expect(func({ foo: "bar" }).delay).toEqual(DELAY);
    expect(func({ foo: "bar" }).called).toBeDefined();
  });
});
