import { insertDecimal } from "./index";

describe("insertDecimal", () => {
  it(">> Should convert to XX.XX", () => {
    const number = insertDecimal(1500);
    expect(number).toEqual("15.00");
  });
});
