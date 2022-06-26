import { useState, useEffect } from 'react';
import logger from 'utils/logger';
import { isEmpty } from 'lodash';

import {
  prepareConfigurationForRender,
  prepareDataForRenderOnChange,
  prepareSubmitData,
  updateConfigurationForErrors,
  checkForErrors,
} from './utils';

const useGenericForm = (configuration, inputData, errors) => {
  const [formState, updateFormState] = useState({
    buttons: configuration?.buttons,
    items: configuration?.items, //could be used for later
    inputData: inputData,
  });

  useEffect(() => {
    const { formConfig, data } = prepareConfigurationForRender(configuration?.items, inputData, errors);
    updateFormState((state) => ({
      ...state,
      formConfig: formConfig,
      data: data,
      formButtons: formButtons(data, formConfig),
    }));
  }, [configuration, inputData, errors]);

  const formButtons = (data, currentConfig) => {
    const buttons = configuration?.buttons?.map((button) => {
      const disabledDependencies = button.isDisabled?.dependencies;

      if (!disabledDependencies?.length && !button.disabledOnEmpty) {
        return button;
      }

      const currentErrors = checkForErrors(currentConfig);
      if (!isEmpty(currentErrors) && button.disableOnErrors) {
        return { ...button, disabled: true };
      }

      if (disabledDependencies?.length) {
        let disabled = true;
        for (const [key, value] of Object.entries(data)) {
          if (disabledDependencies.includes(key)) {
            // it will stay true as long as we have all values from dependancy list
            if (Array.isArray(value?.value)) {
              disabled = disabled && !!value?.value?.length;
            } else {
              disabled = disabled && !!value?.value;
            }
          }
        }
        disabled = !disabled;
        return { ...button, disabled: disabled };
      } else {
        let disabled = true;
        for (const [key, value] of Object.entries(data)) {
          if (Array.isArray(value?.value) && value.value.length > 0) {
            disabled = false;
            break;
          } else if (!Array.isArray(value?.value) && value?.value) {
            disabled = false;
            break;
          }
        }
        return { ...button, disabled: disabled };
      }
    });
    return buttons;
  };

  const onChange = (name, value) => {
    let matching = true;

    if (formState.data?.[name]?.regex) {
      const regex = formState.data[name].regex;
      matching = value.match(regex);
    }

    if (matching || value === '' || value === '-') {
      // if callback function is available
      if (configuration?.onChange) {
        configuration.onChange(name, value);
      }
      const { data } = prepareDataForRenderOnChange(formState.data, name, value);

      let errors = {};
      if (configuration?.onErrorHandle) {
        const currentErrors = checkForErrors(formState.formConfig);
        errors = configuration.onErrorHandle(name, value, prepareSubmitData(data), currentErrors);
      }

      const formConfigWErrors = updateConfigurationForErrors(formState.formConfig, errors);

      updateFormState((state) => ({
        ...state,
        data: data,
        formButtons: formButtons(data, formConfigWErrors),
        formConfig: formConfigWErrors,
      }));
    }
  };

  const onHandleFormButtons = (value) => {
    if (!value) {
      logger.debug('useGenericForm: No value provided');
      return;
    }

    const handleSubmit = formState.buttons?.find((obj) => obj.clickId === value.clickId);
    if (handleSubmit) {
      // should get away from  forcing 'submit' on clickId, use submitButton: true on button configuration
      const errors = checkForErrors(formState.formConfig);
      logger.debug('Submit values', {
        data: prepareSubmitData(formState.data),
        inputData,
        value,
        errors,
        errors: isEmpty(errors),
      });
      if (
        (value.submitButton || value.clickId === 'submit') &&
        (!value.holdOnErrors || (value.holdOnErrors && isEmpty(errors))) // if holding on errors do not allow submit
      ) {
        handleSubmit.onHandleClick(prepareSubmitData(formState.data), inputData, value);
      } else if (!value.holdOnErrors || (value.holdOnErrors && isEmpty(errors))) {
        handleSubmit.onHandleClick(value);
      }
      updateFormState((state) => ({
        ...state,
        ...inputData,
      }));
    } else {
      logger.debug('handleSubmit nod defined for the value ', value);
    }
  };

  return { formState, onChange, onHandleFormButtons };
};

export default useGenericForm;
