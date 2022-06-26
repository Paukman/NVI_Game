import { useEffect } from "react";
import useForm from "react-hook-form";
import { rules } from "./utils";

const useAddPayeeForm = (
  onInputChange,
  handleResultSelect,
  handleSearchChange,
  state
) => {
  const { register, errors, setValue, triggerValidation } = useForm({
    mode: "onSubmit"
  });

  useEffect(() => {
    register(
      { name: "payeeName" },
      {
        validate: rules.createPayeeName(state.approvedCreditors)
      }
    );
    register(
      { name: "account" },
      {
        validate: rules.account
      }
    );
    register(
      { name: "nickname" },
      {
        validate: rules.nickname
      }
    );
  }, [register, state.approvedCreditors]);

  const onChange = e => {
    const { name, value } = e.target;
    setValue(name, value);
    onInputChange(e);
    triggerValidation({ name });
  };

  const onSelectResult = (e, { result }) => {
    handleResultSelect(result);
    setValue("payeeName", result.name);
    triggerValidation({ name: "payeeName" });
  };

  const onBlurPayee = async (e, data) => {
    if (data?.value) {
      const result = { name: data.value };
      handleResultSelect(result);
      setValue("payeeName", result.name);
      triggerValidation({ name: "payeeName" });
    }
  };

  const onSearch = async (e, data) => {
    handleSearchChange(e, data);
  };

  const validateForm = async () => {
    setValue("payeeName", state.payeeName);
    setValue("account", state.account);
    setValue("nickname", state.nickname);
    const result = await triggerValidation();
    return result;
  };

  return {
    register,
    errors,
    onChange,
    onSelectResult,
    onSearch,
    validateForm,
    onBlurPayee
  };
};

export default useAddPayeeForm;
