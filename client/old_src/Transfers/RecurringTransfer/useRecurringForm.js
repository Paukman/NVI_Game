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
  updateEndDateNoOfTransfersMessage
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
      numberOfTransfers: state.numberOfTransfers,
      endingOption: state.endingOption
    }
  });
  const history = useHistory();
  useEffect(() => {
    register({ name: "from" }, { validate: rules.from(state) });
    register({ name: "to" }, { validate: rules.to });
    register({ name: "amount" }, { validate: rules.amount(getValues, state) });
    register({ name: "frequency" }, { validate: rules.frequency });
    register({ name: "starting" }, { validate: rules.starting(getValues) });
    register(
      { name: "ending" },
      { validate: rules.ending(getValues, setError) }
    );
    register(
      { name: "numberOfTransfers" },
      { validate: rules.numberOfTransfers }
    );
    register({ name: "endingOption" });
  }, [getValues, register, setError, state]);

  const handleOnChange = async (e, { name, value }) => {
    setValue(name, value);
    onChange({ name, value });
    validateFields({ name, triggerValidation, getValues });
  };

  const handleOnFrequencyChange = async (e, { name, value }) => {
    setValue(name, value);
    onChange({ name, value });
    updateEndDateNoOfTransfersMessage();
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

    const filtered = numberFilter(value);
    setValue(name, filtered);
    onChange({ name, value: filtered });
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
    updateEndDateNoOfTransfersMessage();
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
    updateEndDateNoOfTransfersMessage();
    if (prevOption !== value) {
      if (value !== endingOptions.endDate) {
        validateFields({ name: "starting", triggerValidation });
      } else if (value === endingOptions.endDate && ending !== null) {
        validateFields({ name: "ending", triggerValidation });
      }
    }
  };

  const onChangeNoOfTansfers = async e => {
    const { value } = e.target;
    const filtered = restrictNoOfPaymentsRange(value);
    setValue("numberOfTransfers", filtered);
    onChange({ name: "numberOfTransfers", value: filtered });
    updateEndDateNoOfTransfersMessage();
    validateFields({ name: "numberOfTransfers", triggerValidation });
  };

  const validateOnSubmit = async () => {
    setValue("from", state.from);
    setValue("to", state.to);
    setValue("numberOfTransfers", state.numberOfTransfers);
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
    onChangeNoOfTansfers,
    triggerValidation,
    onChangeDate,
    getValues,
    setValue,
    validateOnSubmit,
    history
  };
};

export default useRecurringForm;
