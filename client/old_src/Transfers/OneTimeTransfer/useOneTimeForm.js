import { useEffect } from "react";
import { formatCurrency, unFormatCurrency, numberFilter } from "utils";
import { useHistory } from "react-router-dom";
import useForm from "react-hook-form";
import { rules, validateFields, triggerSelectedValidation } from "./utils";
import { SUCCESS_CALL } from "../TransferProvider/hooks/constants";
import { getCurrencies } from "../TransferProvider/hooks/utils";

const useOneTimeForm = (onChange, state, updateExchangeRate) => {
  const {
    register,
    errors,
    setValue,
    getValues,
    triggerValidation,
    clearError
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      from: state.from,
      to: state.to,
      when: state.when,
      amount: state.amount,
      amountTo: state.amountTo,
      isDisplayedToAmount: state.isDisplayedToAmount,
      fromCurrency: state.fromCurrency,
      clearValidationErrors: state.clearValidationErrors
    }
  });
  const history = useHistory();

  const {
    fromAccounts,
    clearValidationErrors,
    amount,
    amountTo,
    from,
    to,
    when
  } = state;

  useEffect(() => {
    if (clearValidationErrors) {
      clearError(["amount", "amountTo", "from", "to", "when"]);
      setValue("amount", amount);
      setValue("amountTo", amountTo);
      setValue("from", from);
      setValue("to", to);
      setValue("when", when);
    }
  }, [
    fromAccounts,
    clearValidationErrors,
    amount,
    amountTo,
    from,
    to,
    when,
    clearError,
    setValue
  ]);

  useEffect(() => {
    register({ name: "from" }, { validate: rules.from });
    register({ name: "to" }, { validate: rules.to });
    register(
      { name: "amount" },
      { validate: rules.amount(getValues, fromAccounts) }
    );
    register({ name: "when" }, { validate: rules.when });
    register(
      { name: "amountTo" },
      { validate: rules.amountTo(getValues, triggerValidation) }
    );
    register({ name: "isDisplayedToAmount" });
    register({ name: "fromCurrency" });
  }, [getValues, register, fromAccounts, triggerValidation]);

  const handleAmountChange = async e => {
    const { name } = e.target;
    const { value } = e.target;
    const filtered = numberFilter(value);
    setValue(name, filtered);
    onChange({ name, value: filtered });
    validateFields({ name, triggerValidation });
  };

  // to or from account
  const handleOnAccountChange = async (e, { name, value }) => {
    setValue(name, value);
    const { fromCurrency, isDisplayedToAmount } = getCurrencies(
      state,
      name,
      value
    );
    setValue("fromCurrency", fromCurrency);
    setValue("isDisplayedToAmount", isDisplayedToAmount);

    validateFields({
      name,
      triggerValidation,
      getValues
    });

    const result = await updateExchangeRate({
      fieldName: name,
      fieldValue: value,
      exchangeAmount: state.amount,
      fieldToUpdate: "amountTo"
    });
    if (result?.type === SUCCESS_CALL) {
      setValue("amountTo", numberFilter(result.toAmount));
      validateFields({ name: "amount", triggerValidation, getValues });
      validateFields({ name: "amountTo", triggerValidation, getValues });
    }
    onChange({ name, value });
  };

  const onChangeDate = async (name, value) => {
    setValue(name, value);
    onChange({ name, value });
    validateFields({ name, triggerValidation, getValues });
  };

  const onBlurAmount = async e => {
    const { value } = e.target;
    const result = await updateExchangeRate({
      fieldToUpdate: "amountTo",
      exchangeAmount: value,
      toCurrency: state.toCurrency,
      fromCurrency: state.fromCurrency
    });
    if (result?.type === SUCCESS_CALL) {
      setValue("amountTo", numberFilter(result.toAmount));
      validateFields({ name: "amount", triggerValidation, getValues });
      validateFields({ name: "amountTo", triggerValidation, getValues });
    }
    onChange({
      name: "amount",
      value: formatCurrency(value)
    });
  };

  const onFocusAmount = e => {
    onChange({
      name: "amount",
      value: unFormatCurrency(e.target.value)
    });
  };

  const onBlurAmountTo = async e => {
    let { value } = e.target;
    let result = null;
    if (!value || parseFloat(unFormatCurrency(value)).toFixed(2) === "0.00") {
      // special case, should trigger exchange rate API again
      result = await updateExchangeRate({
        fieldToUpdate: "amountTo",
        exchangeAmount: state.amount,
        toCurrency: state.toCurrency,
        fromCurrency: state.fromCurrency
      });
      if (result?.type === SUCCESS_CALL) {
        setValue("amountTo", numberFilter(result.toAmount));
        value = result.toAmount;
        validateFields({ name: "amount", triggerValidation, getValues });
        validateFields({ name: "amountTo", triggerValidation, getValues });
      }
    } else {
      result = await updateExchangeRate({
        fieldToUpdate: "amount",
        exchangeAmount: value,
        toCurrency: state.toCurrency,
        fromCurrency: state.fromCurrency
      });

      if (result?.type === SUCCESS_CALL) {
        setValue("amount", numberFilter(result.fromAmount));
        validateFields({ name: "amount", triggerValidation, getValues });
        validateFields({ name: "amountTo", triggerValidation, getValues });
      }
    }
    onChange({
      name: "amountTo",
      value: formatCurrency(value)
    });
  };

  const onFocusAmountTo = e => {
    onChange({
      name: "amountTo",
      value: unFormatCurrency(e.target.value)
    });
  };

  const validateOnSubmit = async () => {
    setValue("from", state.from);
    setValue("to", state.to);
    setValue("when", state.when);
    setValue("amount", state.amount);
    setValue("amountTo", state.amountTo);

    const valid = await triggerSelectedValidation(triggerValidation, getValues);
    return valid;
  };

  return {
    register,
    errors,
    onChangeDate,
    handleOnAccountChange,
    handleAmountChange,
    onBlurAmount,
    onFocusAmount,
    triggerValidation,
    validateOnSubmit,
    getValues,
    setValue,
    history,
    onBlurAmountTo,
    onFocusAmountTo
  };
};

export default useOneTimeForm;
