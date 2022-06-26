import debounce from "./debounce";

const DELAY = 500;

describe("debounce function", () => {
  it(">> should execute the callback after a timeout", done => {
    const callback = jest.fn();
    const func = debounce(DELAY, callback);
    func();
    expect(callback).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(callback).toHaveBeenCalled();
      done();
    }, DELAY + 10);
  });
  it(">> should return function with the correct args", () => {
    const callback = jest.fn();
    const func = debounce(DELAY, callback);
    expect(func({ foo: "bar" }).timerId).toBeTruthy();
    expect(...func({ foo: "bar" }).args).toEqual({ foo: "bar" });
    expect(func({ foo: "bar" }).delay).toEqual(DELAY);
  });
});
