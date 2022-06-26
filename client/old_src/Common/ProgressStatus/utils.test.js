import { getPercentage } from "./utils";

describe("Verify getPercentage function with status", () => {
  it("test create status", () => {
    const percentage = getPercentage(0);
    expect(percentage).toEqual(33.33);
  });

  it("test review status", () => {
    const percentage = getPercentage(1);
    expect(percentage).toEqual(66.66);
  });

  it("test send status", () => {
    const percentage = getPercentage(2);
    expect(percentage).toEqual(100);
  });

  it("test undefined status", () => {
    const percentage = getPercentage(undefined);
    expect(percentage).toEqual(0);
  });
});
