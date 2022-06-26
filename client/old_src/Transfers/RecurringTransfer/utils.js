import dayjs from "dayjs";
import { unFormatCurrency, floatValue } from "utils";
import {
  validateAmountBalance,
  validateInvalidDate,
  validateMinAmount,
  validateMaxAmount
} from "utils/formValidationUtils";
import { getEndDateForNumberOfPayments } from "BillPayment/BillPaymentProvider/hooks/utils";
import { amountRange, MAX_NUM_OF_PAYMENTS, endingOptions } from "../constants";

export const validation = (type, value) => {
  switch (type) {
    case "from":
    case "to":
    case "frequency":
    case "numberOfTransfers": {
      if (!value || !value.length) {
        return false;
      }
      return true;
    }
    case "amount": {
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
  from: state => {
    return {
      requiredFromAccount: value => {
        return validation("from", value);
      },
      ensureRecurringTransferSupported: value => {
        // make sure you don't crash...
        if (!state.recurringAccounts || state.recurringAccounts.length === 0) {
          return false;
        }
        const filteredAccounts = state.recurringAccounts.filter(
          account => account.id === value
        );
        if (filteredAccounts.length <= 0) {
          return false;
        }
        return true;
      }
    };
  },
  to: {
    requiredToAccount: value => {
      return validation("to", value);
    }
  },
  frequency: {
    requiredFrequency: value => {
      return validation("frequency", value);
    }
  },
  amount: (getValues, state) => {
    return {
      requiredAmount: value => {
        // run this validation only on non numbers
        if (value === "" || value === null || value === undefined) {
          return validation("amount", value);
        }
        return true;
      },
      requiredMinAmount: value => {
        return validateMinAmount(floatValue(value), amountRange.min);
      },
      requiredMaxAmount: value => {
        return validateMaxAmount(floatValue(value), amountRange.max);
      },
      balanceLimit: value => {
        if (getValues().from) {
          return validateAmountBalance(
            floatValue(value),
            state.fromAccounts,
            getValues()
          );
        }
        return true;
      }
    };
  },
  starting: getValues => {
    return {
      ensureValidDate: value => {
        return validateInvalidDate(value);
      },
      ensureDateIsNotInThePast: value => {
        const startDate = dayjs(value).format("YYYY-MM-DD");
        // recurring is starting today + 1 day
        const tomorrow = dayjs()
          .add(1, "day")
          .format("YYYY-MM-DD");
        if (startDate < tomorrow) {
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
      },
      ensureDateIsNotAfterEndDate: value => {
        if (getValues().endingOption === endingOptions.endDate) {
          const startDate = dayjs(value).format("YYYY-MM-DD");
          const endDate = dayjs(getValues().ending).format("YYYY-MM-DD");
          if (startDate >= endDate) {
            return false;
          }
          return true;
        }
        return true;
      }
    };
  },
  ending: (getValues, setError) => {
    return {
      ensureValidDate: value => {
        return validateInvalidDate(value);
      },
      ensureDateIsNotInThePast: value => {
        const endDate = dayjs(value).format("YYYY-MM-DD");
        // recurring is starting today + 1 day
        const tomorrow = dayjs()
          .add(1, "day")
          .format("YYYY-MM-DD");

        if (endDate < tomorrow) {
          return false;
        }
        return true;
      },
      ensureDateIsNotBeforeStartDate: value => {
        const startDate = dayjs(getValues().starting).format("YYYY-MM-DD");
        const endDate = dayjs(value).format("YYYY-MM-DD");
        if (startDate >= endDate) {
          return false;
        }
        return true;
      },
      ensureRecurringDateIsNotTooFarOut: value => {
        const furthestDayOut = getEndDateForNumberOfPayments(
          getValues().starting,
          getValues().frequency,
          MAX_NUM_OF_PAYMENTS + 1
        );
        const maxDayOut = dayjs(furthestDayOut)
          .subtract(1, "day")
          .format("YYYY-MM-DD");
        const endDate = dayjs(value).format("YYYY-MM-DD");
        if (endDate >= maxDayOut) {
          const maxDayOutFormatted = dayjs(maxDayOut).format("MMM DD, YYYY");
          setError(
            "ending",
            "ensureRecurringDateIsNotTooFarOut",
            maxDayOutFormatted
          );
          return false;
        }
        return true;
      }
    };
  },
  numberOfTransfers: {
    requiredNoOfTransfers: value => {
      return validation("numberOfTransfers", value);
    },
    ensureIsNumber: value => {
      if (value.match(/^[0-9]\d*$/g) === null) {
        return false;
      }
      return true;
    },
    ensureNumberIsInRange: value => {
      if (value < 1 || value > 999) {
        return false;
      }
      return true;
    }
  }
};

export const validateFields = async ({
  name,
  triggerValidation,
  endingOption = {},
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
      break;
    }
    case "amount": {
      await triggerValidation({ name: "amount" });
      break;
    }
    case "frequency": {
      await triggerValidation({ name: "frequency" });
      break;
    }
    case "starting": {
      await triggerValidation({ name: "starting" });
      if (endingOption === endingOptions.endDate) {
        await triggerValidation({ name: "ending" });
      }
      break;
    }
    case "ending": {
      await triggerValidation({ name: "ending" });
      await triggerValidation({ name: "starting" });
      break;
    }
    case "numberOfTransfers": {
      await triggerValidation({ name: "numberOfTransfers" });
      break;
    }
    case "note": {
      await triggerValidation({ name: "note" });
      break;
    }
    default: {
      return null;
    }
  }
  return null;
};

export const triggerSelectedValidation = async (
  runValidation,
  validationState
) => {
  const validFrom = await runValidation({ name: "from" });
  const validTo = await runValidation({ name: "to" });
  const validAmount = await runValidation({ name: "amount" });
  const validFreq = await runValidation({ name: "frequency" });
  const validStart = await runValidation({ name: "starting" });

  // do not validate what is not visible on the form:
  let validNoOf = true;
  if (validationState.endingOption === endingOptions.numberOfTransfers) {
    validNoOf = await runValidation({ name: "numberOfTransfers" });
  }
  let validEnd = true;
  if (validationState.endingOption === endingOptions.endDate) {
    validEnd = await runValidation({ name: "ending" });
  }
  return (
    validFrom &&
    validTo &&
    validAmount &&
    validFreq &&
    validStart &&
    validNoOf &&
    validEnd
  );
};
