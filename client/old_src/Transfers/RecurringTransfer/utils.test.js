import MockDate from "mockdate";

import {
  validateFields,
  validation,
  rules,
  triggerSelectedValidation
} from "./utils";
import { endingOptions } from "../constants";

describe("Testing validation", () => {
  it(">> should return default", () => {
    const result = validation("undefined", "Undefined");
    expect(result).toEqual(true);
  });
  it(">> should return true or false", () => {
    let result = validation("from", "something");
    expect(result).toEqual(true);
    result = validation("from", "");
    expect(result).toEqual(false);

    result = validation("to", "something");
    expect(result).toEqual(true);
    result = validation("to", "");
    expect(result).toEqual(false);

    result = validation("frequency", "something");
    expect(result).toEqual(true);
    result = validation("frequency", "");
    expect(result).toEqual(false);

    result = validation("numberOfTransfers", "something");
    expect(result).toEqual(true);
    result = validation("numberOfTransfers", "");
    expect(result).toEqual(false);

    result = validation("amount", "something");
    expect(result).toEqual(false);
    result = validation("amount", "");
    expect(result).toEqual(false);
    result = validation("amount", "100");
    expect(result).toEqual(true);
    result = validation("amount", "0");
    expect(result).toEqual(false);
    result = validation("amount", "0.01");
    expect(result).toEqual(true);
  });
});

describe("Testing rules", () => {
  beforeEach(() => {
    MockDate.set("2019-01-30T10:20:30Z");
  });

  afterEach(() => {
    MockDate.reset();
  });

  it(">> should validate properly for requiredFromAccount", () => {
    let result = rules.from().requiredFromAccount("");
    expect(result).toEqual(false);
    result = rules.from().requiredFromAccount("Some Account");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for ensureRecurringTransferSupported", () => {
    const state = {
      recurringAccounts: [
        {
          id: "Some Account"
        }
      ]
    };
    let result = rules.from(state).ensureRecurringTransferSupported();
    expect(result).toEqual(false);
    result = rules.from(state).ensureRecurringTransferSupported("Some Account");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for requiredToAccount", () => {
    let result = rules.to.requiredToAccount("");
    expect(result).toEqual(false);
    result = rules.to.requiredToAccount("Some Account");
    expect(result).toEqual(true);
  });
  it(">> should test ending ensureDateIsNotBeforeStartDate with garbage dates", () => {
    const getValues = () => {
      return { starting: "" };
    };
    const setError = jest.fn();
    const methods = rules.ending(getValues, setError);
    const result = methods.ensureDateIsNotBeforeStartDate("dhjshfj");
    expect(result).toEqual(false);
  });
  it(">> should validate properly for requiredFrequency", () => {
    let result = rules.frequency.requiredFrequency("");
    expect(result).toEqual(false);
    result = rules.frequency.requiredFrequency("some value");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for requiredAmount", () => {
    const getValues = () => {
      return { from: "" };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    let result = errors.requiredAmount("");
    expect(result).toEqual(false);
    result = errors.requiredAmount("100");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for amount ranges", () => {
    const getValues = () => {
      return { from: "" };
    };
    const state = {};
    const errors = rules.amount(getValues, state);
    let result = errors.requiredMinAmount("0");
    expect(result).toEqual(false);
    result = errors.requiredMinAmount("0.01");
    expect(result).toEqual(true);
    result = errors.requiredMaxAmount("99999.99");
    expect(result).toEqual(true);
    result = errors.requiredMaxAmount("100000.00");
    expect(result).toEqual(false);
  });
  it(">> should validate properly for amount balanceLimit", () => {
    const getValues = () => {
      return { from: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk" };
    };
    const state = {
      fromAccounts: [
        {
          availableBalance: { currency: "CAD", value: 2000.01 },
          id: "33ZFwIxk3ZebPZZx1bDHjy71QlRdVISubFjoa9XRhzU"
        },
        {
          availableBalance: { currency: "CAD", value: 1000.01 },
          id: "33ZFwIxk3ZebPZZx1bDHj_kyx3U7p6DqxfheOgDVosk"
        }
      ]
    };
    const errors = rules.amount(getValues, state);
    let result = errors.balanceLimit("1500");
    expect(result).toEqual(false);
    result = errors.balanceLimit("500");
    expect(result).toEqual(true);
  });

  it(">> should not validate for amount balanceLimit withouth the account", () => {
    const getValues = () => {
      return { from: "" };
    };
    const state = null;

    const errors = rules.amount(getValues, state);
    let result = errors.balanceLimit("0.2");
    expect(result).toEqual(true);
    result = errors.balanceLimit("500");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureValidDate", () => {
    const getValues = () => {
      return { from: "" };
    };
    const endingOption = {};
    const errors = rules.starting(getValues, endingOption);
    let result = errors.ensureValidDate("garbage");
    expect(result).toEqual(false);
    result = errors.ensureValidDate("Jun, 25 2020");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureDateIsNotInThePast", () => {
    const getValues = () => {
      return { from: "" };
    };
    const endingOption = {};
    const errors = rules.starting(getValues, endingOption);
    let result = errors.ensureDateIsNotInThePast("2018-12-01");
    expect(result).toEqual(false);
    result = errors.ensureDateIsNotInThePast("2019-03-01");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureDateIsNotTooFarInFuture", () => {
    const getValues = () => {
      return "anything";
    };
    const endingOption = {};
    const errors = rules.starting(getValues, endingOption);
    let result = errors.ensureDateIsNotTooFarInFuture("2020-01-30");
    expect(result).toEqual(false);
    result = errors.ensureDateIsNotTooFarInFuture("2020-01-29");
    expect(result).toEqual(true);
  });
  it(">> should return true for ensureDateIsNotAfterEndDate with endingOption", () => {
    const getValues = () => {
      return { ending: "Apr 01, 2020" };
    };
    const endingOption = endingOptions.never;
    const errors = rules.starting(getValues, endingOption);
    const result = errors.ensureDateIsNotAfterEndDate("2020-03-01");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for starting ensureDateIsNotAfterEndDate", () => {
    const getValues = () => {
      return { ending: "Apr 01, 2020", endingOption: endingOptions.endDate };
    };
    const errors = rules.starting(getValues);
    let result = errors.ensureDateIsNotAfterEndDate("2020-04-10");
    expect(result).toEqual(false);
    result = errors.ensureDateIsNotAfterEndDate("2020-03-30");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for ending ensureValidDate", () => {
    const getValues = () => {
      return { from: "" };
    };
    const setError = jest.fn();
    const errors = rules.ending(getValues, setError);
    let result = errors.ensureValidDate("garbage");
    expect(result).toEqual(false);
    result = errors.ensureValidDate("Jun, 25 2020");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for ending ensureDateIsNotInThePast", () => {
    const getValues = () => {
      return { from: "" };
    };
    const setError = jest.fn();
    const errors = rules.ending(getValues, setError);
    let result = errors.ensureDateIsNotInThePast("2018-12-01");
    expect(result).toEqual(false);
    result = errors.ensureDateIsNotInThePast("2019-03-01");
    expect(result).toEqual(true);
  });

  it(">> should validate properly for ending ensureDateIsNotBeforeStartDate", () => {
    const getValues = () => {
      return { starting: "Apr 20, 2020" };
    };
    const setError = jest.fn();
    const errors = rules.ending(getValues, setError);
    let result = errors.ensureDateIsNotBeforeStartDate("2020-04-10");
    expect(result).toEqual(false);
    result = errors.ensureDateIsNotBeforeStartDate("2020-04-25");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for ending ensureRecurringDateIsNotTooFarOut", () => {
    const getValues = () => {
      return { starting: "Apr 26, 2020", frequency: "weekly" };
    };
    const setError = jest.fn();
    const errors = rules.ending(getValues, setError);
    let result = errors.ensureRecurringDateIsNotTooFarOut("2039-06-18");
    expect(setError).toBeCalledWith(
      "ending",
      "ensureRecurringDateIsNotTooFarOut",
      "Jun 18, 2039"
    );
    expect(result).toEqual(false);
    result = errors.ensureRecurringDateIsNotTooFarOut("2039-03-17");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for numberOfTransfers requiredNoOfPayments", () => {
    let result = rules.numberOfTransfers.requiredNoOfTransfers("");
    expect(result).toEqual(false);
    result = rules.numberOfTransfers.requiredNoOfTransfers("10");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for numberOfTransfers ensureIsNumber", () => {
    let result = rules.numberOfTransfers.ensureIsNumber("not number");
    expect(result).toEqual(false);
    result = rules.numberOfTransfers.ensureIsNumber("10");
    expect(result).toEqual(true);
  });
  it(">> should validate properly for numberOfTransfers ensureNumberIsInRange", () => {
    let result = rules.numberOfTransfers.ensureNumberIsInRange("0");
    expect(result).toEqual(false);
    result = rules.numberOfTransfers.ensureNumberIsInRange("1");
    expect(result).toEqual(true);
    result = rules.numberOfTransfers.ensureNumberIsInRange("999");
    expect(result).toEqual(true);
    result = rules.numberOfTransfers.ensureNumberIsInRange("1000");
    expect(result).toEqual(false);
  });
});

describe("Testing validateFields", () => {
  it(">> should return null", async () => {
    const result = await validateFields({ name: "undefined", getValues: null });
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

  it(">> should validate to field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "to", triggerValidation });
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

  it(">> should validate frequency field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "frequency", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "frequency" });
  });

  it(">> should validate starting field with ending option", async () => {
    let result = "";
    const fieldsCalled = [];
    const endingOption = endingOptions.endDate;
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        fieldsCalled.push(result);
        resolve(name);
      });
    });

    await validateFields({
      name: "starting",
      triggerValidation,
      endingOption
    });
    expect(triggerValidation).toBeCalledTimes(2);
    expect(result).toEqual({ name: "ending" });
    expect(fieldsCalled).toEqual([{ name: "starting" }, { name: "ending" }]);
  });
  it(">> should validate starting field without ending option", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({
      name: "starting",
      triggerValidation
    });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "starting" });
  });
  it(">> should validate ending field", async () => {
    let result = "";
    const fieldsCalled = [];
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        fieldsCalled.push(result);
        resolve(name);
      });
    });

    await validateFields({ name: "ending", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(2);
    expect(result).toEqual({ name: "starting" });
    expect(fieldsCalled).toEqual([{ name: "ending" }, { name: "starting" }]);
  });
  it(">> should validate numberOfTransfers field", async () => {
    let result = "";
    const triggerValidation = jest.fn(name => {
      return new Promise(resolve => {
        result = name;
        resolve(name);
      });
    });

    await validateFields({ name: "numberOfTransfers", triggerValidation });
    expect(triggerValidation).toBeCalledTimes(1);
    expect(result).toEqual({ name: "numberOfTransfers" });
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
  const mockState = {
    endingOption: endingOptions.never
  };
  it(">> should trigger custom validation with initial state", async () => {
    const triggerValidation = jest.fn();
    await triggerSelectedValidation(triggerValidation, mockState);
    expect(triggerValidation).toHaveBeenCalledTimes(5);
  });

  it(">> should trigger custom validation with endingOptions.endDate", async () => {
    const triggerValidation = jest.fn();
    const localState = { ...mockState, endingOption: endingOptions.endDate };
    await triggerSelectedValidation(triggerValidation, localState);
    expect(triggerValidation).toHaveBeenCalledTimes(6);
  });

  it(">> should trigger custom validation with endingOptions.numberOfTransfers ", async () => {
    const triggerValidation = jest.fn();
    const localState = {
      ...mockState,
      endingOption: endingOptions.numberOfTransfers
    };
    await triggerSelectedValidation(triggerValidation, localState);
    expect(triggerValidation).toHaveBeenCalledTimes(6);
  });
});
