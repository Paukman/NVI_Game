import { validateAmountRange } from "./validators";

describe("Validator tests", () => {
  const interacLimits = {
    limits: {
      requestMoneyLimits: {
        maxRequestOutgoingAmount: 3000
      }
    }
  };

  it(">> should return MSG_RBET_012 message when amount value is above maximum request amount", () => {
    const returnVal = validateAmountRange(3000.01, interacLimits);
    expect(returnVal).toEqual("Enter an amount between $0.01 and $3,000.00.");
  });

  it(">> should return MSG_RBET_012 message when amount value is below minimum request amount", () => {
    const returnVal = validateAmountRange(0.0, interacLimits);
    expect(returnVal).toEqual("Enter an amount between $0.01 and $3,000.00.");
  });

  it(">> should return same amount value when between minimum and maximum request amount", () => {
    const returnVal = validateAmountRange(25.01, interacLimits);
    expect(returnVal).toEqual(25.01);
  });
});
