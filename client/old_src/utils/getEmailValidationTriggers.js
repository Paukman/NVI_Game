import { isFunction } from "lodash";

/**
 * Email validation should always occur `onBlur` and `onSubmit`. Validation should
 * also occur `onChange` only when there is an existing error. This clears the field
 * as soon as any existing email errors are resolved, without polluting the field
 * with errors as the user initially enters their email.
 */
export const getEmailValidationTriggers = (antdFormInstance, fieldName) => {
  const defaultTriggers = ["onBlur", "onSubmit"];
  if (!isFunction(antdFormInstance?.getFieldError) || !fieldName) {
    return defaultTriggers;
  }

  const fieldHasError = !!antdFormInstance.getFieldError(fieldName).length;
  return [...defaultTriggers, ...(fieldHasError ? ["onChange"] : [])];
};
