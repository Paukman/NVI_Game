import { useEffect } from "react";
import useForm from "react-hook-form";
import { rules } from "./utils";

const useAutodepositForm = (onInputChange, state) => {
  const { register, errors, setValue, triggerValidation } = useForm();

  useEffect(() => {
    register(
      { name: "email" },
      {
        validate: rules.email
      }
    );
    register(
      { name: "account" },
      {
        validate: rules.account
      }
    );
  }, [register]);

  const onChange = e => {
    const { name } = e.target;
    const { value } = e.target;
    setValue(name, value);
    onInputChange(e);
    triggerValidation({ name });
  };

  const handleOnDropdownChange = async (e, { name, value }) => {
    setValue(name, value);
    triggerValidation();
    const target = {
      name,
      value
    };
    onInputChange({ target });
  };

  const validateForm = async () => {
    setValue("email", state.email);
    setValue("account", state.account);
    const valid = await triggerValidation();
    return valid;
  };

  return {
    errors,
    onChange,
    validateForm,
    handleOnDropdownChange
  };
};

export default useAutodepositForm;
