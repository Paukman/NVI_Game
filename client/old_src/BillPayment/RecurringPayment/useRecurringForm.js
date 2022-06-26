import { useEffect } from "react";
import useForm from "react-hook-form";
import {
  formatCurrency,
  unFormatCurrency,
  numberFilter,
  restrictNoOfPaymentsRange
} from "utils";
import { useHistory } from "react-router-dom";
import { endingOptions } from "../constants";
import { rules, validateFields, triggerSelectedValidation } from "./utils";

const useRecurringForm = (
  onChange,
  state,
  updateEndDateNoOfPaymentsMessage
) => {
  const {
    setValue,
    errors,
    register,
    triggerValidation,
    getValues,
    setError
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      from: state.from,
      to: state.to,
      amount: state.amount,
      frequency: state.frequency,
      ending: state.ending,
      starting: state.starting,
      numberOfPayments: state.numberOfPayments,
      note: state.note
    }
  });
  const history = useHistory();
  useEffect(() => {
    register({ name: "from" }, { validate: rules.from });
    register({ name: "to" }, { validate: rules.to });
    register({ name: "amount" }, { validate: rules.amount(getValues, state) });
    register({ name: "frequency" }, { validate: rules.frequency });
    register({ name: "starting" }, { validate: rules.starting(getValues) });
    register(
      { name: "ending" },
      { validate: rules.ending(getValues, setError) }
    );
    register(
      { name: "numberOfPayments" },
      { validate: rules.numberOfPayments }
    );
    register({ name: "endingOption" });
  }, [getValues, register, setError, state]);

  const handleOnChange = async (e, { name, value }) => {
    if (name === "to" && value === "add-payee") {
      history.push("/move-money/bill-payment/#addPayee");
      return;
    }
    setValue(name, value);
    onChange({ name, value });
    validateFields({ name, triggerValidation, getValues });
  };

  const handleOnFrequencyChange = async (e, { name, value }) => {
    setValue(name, value);
    onChange({ name, value });
    updateEndDateNoOfPaymentsMessage();
    // validate if ending date is there, eg. was by-weekly far out, now weekly
    validateFields({ name, triggerValidation });
    if (
      getValues().endingOption === endingOptions.endDate &&
      getValues().ending !== null
    ) {
      validateFields({ name: "ending", triggerValidation });
    }
  };

  const handleInputChange = async e => {
    const { name } = e.target;
    const { value } = e.target;

    if (name === "amount") {
      const filtered = numberFilter(value);
      setValue(name, filtered);
      onChange({ name, value: filtered });
      validateFields({ name, triggerValidation });
      return;
    }

    setValue(name, value);
    onChange({ name, value });
    validateFields({ name, triggerValidation });
  };

  const onBlurAmount = e => {
    onChange({
      name: "amount",
      value: formatCurrency(e.target.value)
    });
  };

  const onFocusAmount = e => {
    onChange({
      name: "amount",
      value: unFormatCurrency(e.target.value)
    });
  };

  const onChangeDate = async (name, value) => {
    setValue(name, value);
    onChange({ name, value });
    updateEndDateNoOfPaymentsMessage();
    validateFields({
      name,
      triggerValidation,
      endingOption: state.endingOption
    });
  };

  const onChangeEndingOption = async (name, value) => {
    const prevOption = getValues().endingOption;
    const { ending } = state;
    setValue(name, value);
    onChange({ name, value });
    updateEndDateNoOfPaymentsMessage();
    if (prevOption !== value) {
      if (value !== endingOptions.endDate) {
        validateFields({ name: "starting", triggerValidation });
      } else if (value === endingOptions.endDate && ending !== null) {
        validateFields({ name: "ending", triggerValidation });
      }
    }
  };

  const onChangeNoOfPayments = async e => {
    const { value } = e.target;
    const filtered = restrictNoOfPaymentsRange(value);
    setValue("numberOfPayments", filtered);
    onChange({ name: "numberOfPayments", value: filtered });
    updateEndDateNoOfPaymentsMessage();
    validateFields({ name: "numberOfPayments", triggerValidation });
  };

  const validateOnSubmit = async () => {
    setValue("from", state.from);
    setValue("to", state.to);
    setValue("numberOfPayments", state.numberOfPayments);
    setValue("starting", state.starting);
    setValue("ending", state.ending);
    setValue("amount", state.amount);
    setValue("frequency", state.frequency);
    setValue("endingOption", state.endingOption);

    const valid = await triggerSelectedValidation(triggerValidation, state);
    return valid;
  };

  return {
    onBlurAmount,
    onFocusAmount,
    handleOnChange,
    handleOnFrequencyChange,
    handleInputChange,
    onChangeEndingOption,
    errors,
    onChangeNoOfPayments,
    triggerValidation,
    onChangeDate,
    getValues,
    setValue,
    validateOnSubmit,
    history
  };
};

export default useRecurringForm;
