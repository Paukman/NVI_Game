import MockDate from "mockdate";
import {
  validation,
  rules,
  validateFields,
  triggerSelectedValidation
} from "./utils";

describe(">> Testing rules", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate for fields", () => {
    const getValues = () => {
      return { maxLimitExceeded: false };
    };
    let from = "";
    expect(rules.from.requiredFromAccount(from)).toBe(false);
    from = null;
    expect(rules.from.requiredFromAccount(from)).toBe(false);
    from = undefined;
    expect(rules.from.requiredFromAccount(from)).toBe(false);
    from = "123";
    expect(rules.from.requiredFromAccount(from)).toBe(true);
    let amount = "";
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(false);
    amount = null;
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(false);
    amount = undefined;
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(false);
    amount = "123";
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(true);
    let to = "";
    expect(rules.to.requiredToAccount(to)).toBe(false);
    to = null;
    expect(rules.to.requiredToAccount(to)).toBe(false);
    to = undefined;
    expect(rules.to.requiredToAccount(to)).toBe(false);
    to = "123";
    expect(rules.to.requiredToAccount(to)).toBe(true);
    amount = "0";
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(false);
    amount = "0.01";
    expect(rules.amount(getValues).requiredAmount(amount)).toBe(true);

    let amountTo = "";
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(false);
    amountTo = null;
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(false);
    amountTo = undefined;
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(false);
    amountTo = "123";
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(true);
    amountTo = "0";
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(true);
    amountTo = "0.01";
    expect(rules.amountTo().requiredAmount(amountTo)).toBe(true);
  });
  it(">> validation func defaults to true", () => {
    expect(validation("unknowntype", undefined)).toBe(true);
  });
  it(">> should validate properly for when ensureValidDate", () => {
    let result = rules.when.ensureValidDate("garbage");
    expect(result).toEqual(false);
    result = rules.when.ensureValidDate("Jun, 25 2020");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureDateIsNotInThePast", () => {
    let result = rules.when.ensureDateIsNotInThePast("2018-12-01");
    expect(result).toEqual(false);
    result = rules.when.ensureDateIsNotInThePast("2019-03-01");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureDateIsNotTooFarInFuture", () => {
    let result = rules.when.ensureDateIsNotTooFarInFuture("2020-01-30");
    expect(result).toEqual(false);
    result = rules.when.ensureDateIsNotTooFarInFuture("2020-01-29");
    expect(result).toEqual(true);
  });
  it(">> should validate properly requiredAmount no maxLimitExceeded", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true, maxLimitExceeded: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    const result = errors.requiredAmount("eee");
    expect(result).toEqual(false);
  });
  it(">> should skip validation for requiredAmount with maxLimitExceeded", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true, maxLimitExceeded: 50000 };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    const result = errors.requiredAmount("eee");
    expect(result).toEqual(true);
  });

  it(">> should validate properly for mix and max amount for isDisplayedToAmount true", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    let result = errors.requiredMinAmount("100");
    expect(result).toEqual(true);
    result = errors.requiredMaxAmount("100");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMinAmount", () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    let result = errors.requiredMinAmount("");
    expect(result).toEqual(false);
    result = errors.requiredMinAmount("100");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMaxAmount", () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    let result = errors.requiredMaxAmount("99999.99");
    expect(result).toEqual(true);
    result = errors.requiredMaxAmount("100000");
    expect(result).toEqual(false);
  });
  it(">> should validate properly amount for requiredMinExchangeAmount if isDisplayedToAmount is false", () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    const result = errors.requiredMinExchangeAmount("");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMinExchangeAmount for CAD", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true, fromCurrency: "CAD" };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    let result = errors.requiredMinExchangeAmount("0.99");
    expect(result).toEqual(false);
    result = errors.requiredMinExchangeAmount("1");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMinExchangeAmount for USD", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true, fromCurrency: "USD" };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    const result = errors.requiredMinExchangeAmount("0.99");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMaxExchangeAmount if isDisplayedToAmount is false", () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    const result = errors.requiredMaxExchangeAmount("");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMaxExchangeAmount for CAD", () => {
    const getValues = () => {
      return {
        isDisplayedToAmount: true,
        fromCurrency: "CAD",
        maxLimitExceeded: false
      };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    // any amount will get true
    let result = errors.requiredMaxExchangeAmount("50000");
    expect(result).toEqual(true);
    result = errors.requiredMaxExchangeAmount("500000");
    expect(result).toEqual(true);
    result = errors.requiredMaxExchangeAmountVIP("500000");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMaxExchangeAmount for CAD and exceeding amount", () => {
    const getValues = () => {
      return {
        isDisplayedToAmount: true,
        fromCurrency: "CAD",
        maxLimitExceeded: 50000
      };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    // any amount will get false
    let result = errors.requiredMaxExchangeAmount("10");
    expect(result).toEqual(false);
    result = errors.requiredMaxExchangeAmount("50000.01");
    expect(result).toEqual(false);
    result = errors.requiredMaxExchangeAmountVIP("500000");
    expect(result).toEqual(true);
  });

  it(">> should validate properly amount for requiredMaxExchangeAmountVIP if isDisplayedToAmount is false", () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    const result = errors.requiredMaxExchangeAmountVIP("");
    expect(result).toEqual(true);
  });

  it(">> should validate properly amount for requiredMaxExchangeAmountVIP for CAD and exceeding amount", () => {
    const getValues = () => {
      return {
        isDisplayedToAmount: true,
        fromCurrency: "CAD",
        maxLimitExceeded: 99999.99
      };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    // any amount will get false
    let result = errors.requiredMaxExchangeAmountVIP("10");
    expect(result).toEqual(false);
    result = errors.requiredMaxExchangeAmountVIP("50000.01");
    expect(result).toEqual(false);
    result = errors.requiredMaxExchangeAmount("300000");
    expect(result).toEqual(true);
  });
  it(">> should validate properly amount for requiredMaxExchangeAmount for USD", () => {
    const getValues = () => {
      return { isDisplayedToAmount: true, fromCurrency: "USD" };
    };
    const state = {};
    const errors = rules.amount(getValues, state);

    const result = errors.requiredMaxExchangeAmount("0.99");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for amount balanceLimit", () => {
    const getValues = () => {
      return { from: "id", fromCurrency: "CAD" };
    };
    const fromAccounts = [
      {
        availableBalance: { currency: "CAD", value: 1000.01 },
        id: "id"
      }
    ];

    const errors = rules.amount(getValues, fromAccounts);
    let result = errors.balanceLimit("1500");
    expect(result).toEqual(false);
    result = errors.balanceLimit("500");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for amount balanceLimit for USD", () => {
    const getValues = () => {
      return { from: "id", fromCurrency: "USD" };
    };
    const fromAccounts = [
      {
        availableBalance: { currency: "USD", value: 1000.01 },
        id: "id"
      }
    ];

    const errors = rules.amount(getValues, fromAccounts);
    let result = errors.balanceLimit("0");
    expect(result).toEqual(true);
    result = errors.balanceLimit("500");
    expect(result).toEqual(true);
    result = errors.balanceLimit("1000.02");
    expect(result).toEqual(false);
  });

  it(">> should not validate for amount balanceLimit withouth the account", () => {
    const getValues = () => {
      return { from: "", fromCurrency: "CAD" };
    };
    const fromAccounts = [];

    const errors = rules.amount(getValues, fromAccounts);
    let result = errors.balanceLimit("0.2");
    expect(result).toEqual(true);
    result = errors.balanceLimit("500");
    expect(result).toEqual(true);
  });
});

describe("Testing validateFields", () => {
  it(">> should return null", async () => {
    const result = await validateFields({ name: "undefined" });
    expect(result).toEqual(null);
  });
  it(">> should validate from field with empty amount", async () => {
    let result = "";
    const getValues = () => {
      return { amount: "" };
    };
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "from", triggerValidation, getValues });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "from" });
  });
  it(">> should validate from field with amount present", async () => {
    let result = "";
    const fieldsCalled = [];
    const getValues = () => {
      return { amount: "100" };
    };
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        fieldsCalled.push(result);
        resolve(name);
      });
    });

    await validateFields({ name: "from", triggerValidation, getValues });
    expect(triggerValidation).toBeCalledTimes(2);
    expect(result).toEqual({ name: "amount" });
    expect(fieldsCalled).toEqual([{ name: "from" }, { name: "amount" }]);
  });

  it(">> should validate to field with amount present", async () => {
    let result = "";
    const fieldsCalled = [];
    const getValues = () => {
      return { amount: "100" };
    };
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        fieldsCalled.push(result);
        resolve(name);
      });
    });

    await validateFields({ name: "to", triggerValidation, getValues });
    expect(triggerValidation).toBeCalledTimes(2);
    expect(result).toEqual({ name: "amount" });
    expect(fieldsCalled).toEqual([{ name: "to" }, { name: "amount" }]);
  });
  it(">> should validate to field with empty amount", async () => {
    let result = "";
    const getValues = () => {
      return { amount: "" };
    };
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "to", triggerValidation, getValues });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "to" });
  });

  it(">> should validate amount field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "amount", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "amount" });
  });

  it(">> should validate amountTo field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "amountTo", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "amountTo" });
  });

  it(">> should validate when field without ending option", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({
      name: "when",
      triggerValidation
    });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "when" });
  });
  it(">> should validate note field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "note", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "note" });
  });
});

describe("Testing triggerSelectedValidation", () => {
  it(">> should trigger custom validation with no cross currency input", async () => {
    const getValues = () => {
      return { isDisplayedToAmount: false };
    };
    const runValidation = jest.fn();
    await triggerSelectedValidation(runValidation, getValues);
    expect(runValidation).toHaveBeenCalledTimes(4);
  });

  it(">> should trigger custom validation with cross currency input", async () => {
    const getValues = () => {
      return { isDisplayedToAmount: true };
    };
    const runValidation = jest.fn();
    await triggerSelectedValidation(runValidation, getValues);
    expect(runValidation).toHaveBeenCalledTimes(5);
  });
});
