import timer from "./timer";

describe("timer function", () => {
  it("should call the listener", () => {
    jest.useFakeTimers();
    const litener = jest.fn();
    timer([1, 20], litener);
    jest.advanceTimersByTime(3000);
    expect(litener).toBeCalledTimes(3);
  });
  it("should return the correct countdown values", () => {
    jest.useFakeTimers();
    let values;
    const litener = time => {
      values = time;
    };
    timer([1, 20], litener);
    jest.advanceTimersByTime(3000);
    expect(values).toMatchObject({ sec: 17, min: 1, secondsCounter: 17 });
    jest.advanceTimersByTime(18000);
    expect(values).toMatchObject({ sec: 59, min: 0, secondsCounter: -1 });
  });
});
