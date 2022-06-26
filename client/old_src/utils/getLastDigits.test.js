import { getLastDigits } from "./getLastDigits";

describe("Get Last Digits Test", () => {
  it(">> Should return last four", () => {
    const lastFour = getLastDigits("456789");
    expect(lastFour).toEqual("6789");
  });

  it(">> Should return all numbers", () => {
    const allNumbers = getLastDigits("123");
    expect(allNumbers).toEqual("123");
  });
});
