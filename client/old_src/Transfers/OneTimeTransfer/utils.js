import dayjs from "dayjs";
import { unFormatCurrency, floatValue } from "utils";

import {
  validateMinAmount,
  validateMaxAmount,
  validateAmountBalance,
  validateInvalidDate
} from "utils/formValidationUtils";
import { amountRange, amountExchangeRate } from "../constants";

export const validation = (type, value) => {
  switch (type) {
    case "from":
    case "to": {
      if (!value || !value.length) {
        return false;
      }
      return true;
    }
    case "amount":
    case "amountTo": {
      const filtered = unFormatCurrency(value);
      if (!value || !value.length || parseFloat(filtered) === 0) {
        return false;
      }
      return true;
    }
    default: {
      return true;
    }
  }
};

export const rules = {
  from: {
    requiredFromAccount: value => {
      return validation("from", value);
    }
  },
  to: {
    requiredToAccount: value => {
      return validation("to", value);
    }
  },
  amount: (getValues, fromAccounts) => {
    return {
      requiredAmount: value => {
        // run this validation only on non numbers
        if (value === "" || value === null || value === undefined) {
          return validation("amount", value);
        }
        return true;
      },
      requiredMinAmount: value => {
        if (getValues().isDisplayedToAmount) {
          return true;
        }
        return validateMinAmount(floatValue(value), amountRange.min);
      },
      requiredMaxAmount: value => {
        if (getValues().isDisplayedToAmount) {
          return true;
        }
        return validateMaxAmount(floatValue(value), amountRange.max);
      },
      requiredMinExchangeAmount: value => {
        if (!getValues().isDisplayedToAmount) {
          return true;
        }
        if (getValues().fromCurrency === "CAD") {
          return validateMinAmount(floatValue(value), amountExchangeRate.min);
        }
        return true;
      },
      requiredMaxExchangeAmount: value => {
        if (!getValues().isDisplayedToAmount) {
          return true;
        }
        if (getValues().fromCurrency === "CAD") {
          return validateMaxAmount(floatValue(value), amountExchangeRate.max);
        }
        return true;
      },
      balanceLimit: value => {
        const { fromCurrency, from } = getValues();

        if (
          from &&
          (fromCurrency === "CAD" ||
            (fromCurrency === "USD" && parseFloat(value).toFixed(2) !== "0.00"))
        ) {
          return validateAmountBalance(
            floatValue(value),
            fromAccounts,
            getValues()
          );
        }
        return true;
      }
    };
  },
  amountTo: getValues => {
    // assumption is amountTo is only called when isDisplayedToAmount is true
    return {
      requiredAmount: value => {
        if (value === "" || value === null || value === undefined) {
          return validation("amountTo", value);
        }
        return true;
      },
      requiredMinExchangeAmount: value => {
        if (getValues().fromCurrency === "CAD") {
          return true;
        }
        return validateMinAmount(floatValue(value), amountExchangeRate.min);
      },
      requiredMaxExchangeAmount: value => {
        if (getValues().fromCurrency === "CAD") {
          return true;
        }
        return validateMaxAmount(floatValue(value), amountExchangeRate.max);
      }
    };
  },
  when: {
    ensureValidDate: value => {
      return validateInvalidDate(value);
    },
    ensureDateIsNotInThePast: value => {
      const startDate = dayjs(value).format("YYYY-MM-DD");
      const today = dayjs().format("YYYY-MM-DD");
      if (startDate < today) {
        return false;
      }
      return true;
    },
    ensureDateIsNotTooFarInFuture: value => {
      const startDate = dayjs(value).format("YYYY-MM-DD");
      const future = dayjs()
        .add(1, "year")
        .format("YYYY-MM-DD");
      if (startDate >= future) {
        return false;
      }
      return true;
    }
  }
};

export const validateFields = async ({
  name,
  triggerValidation,
  getValues = () => null
}) => {
  switch (name) {
    case "from": {
      await triggerValidation({ name: "from" });
      if (getValues().amount !== "" && getValues().amount !== undefined) {
        await triggerValidation({ name: "amount" });
      }
      break;
    }
    case "to": {
      await triggerValidation({ name: "to" });
      if (getValues().amount !== "" && getValues().amount !== undefined) {
        await triggerValidation({ name: "amount" });
      }
      break;
    }
    case "amount": {
      await triggerValidation({ name: "amount" });
      break;
    }
    case "amountTo": {
      await triggerValidation({ name: "amountTo" });
      break;
    }
    case "when": {
      await triggerValidation({ name: "when" });
      if (getValues().from !== "" && getValues().from !== undefined) {
        await triggerValidation({ name: "from" });
      }
      break;
    }
    default: {
      return null;
    }
  }
  return null;
};

export const triggerSelectedValidation = async (
  triggerValidation,
  getValues
) => {
  const validFrom = await triggerValidation({ name: "from" });
  const validTo = await triggerValidation({ name: "to" });
  const validAmount = await triggerValidation({ name: "amount" });
  const validWhen = await triggerValidation({ name: "when" });

  // do not validate what is not visible on the form:
  let validAmountTo = true;
  if (getValues().isDisplayedToAmount) {
    validAmountTo = await triggerValidation({ name: "amountTo" });
  }
  return validFrom && validTo && validAmount && validWhen && validAmountTo;
};
