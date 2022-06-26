import { cloneDeep } from 'lodash';
import logger from 'utils/logger';
import produce from 'immer';

export const isConfigValid = (items) => {
  let isValid = true;
  const itemNames = [];
  for (const [index, obj] of items.entries()) {
    if (!obj.name || !obj.component || obj.visible === null || obj.visible === undefined) {
      logger.debug('Missing mandatory field name, component or visible in item ', obj);
      isValid = false;
      break;
    }
    if (typeof obj.visible !== 'boolean') {
      if (!obj.visible.dependants || !obj.visible.dependants.length) {
        logger.debug('Missing dependants in item ', obj);
        isValid = false;
        break;
      }
      if (!obj.visible.calc || typeof obj.visible.calc !== 'function') {
        logger.debug('Missing or wrong calculation in item ', obj);
        isValid = false;
        break;
      }
    }
    if (itemNames.length && itemNames.includes(obj.name)) {
      logger.debug('name ', obj.name, ' field not unique');
      isValid = false;
      break;
    }
    itemNames.push(obj.name);
  }
  return isValid;
};

export const updateDataCfg = (configurationSubset, prevElement) => {
  if (prevElement === null) {
    return configurationSubset;
  }

  const dependant = prevElement.name;
  const value = prevElement.value;

  const updatedConfigSubset = configurationSubset.map((obj) => {
    if (typeof obj.visible === 'boolean' || !obj.visible.dependants.includes(dependant)) {
      return obj; // no need to cahnge anything, continue to the next element
    }
    if (obj.visible?.dependants?.includes(dependant)) {
      const show = obj.visible.calc(value);
      return { ...obj, show: show, value: show ? obj.value : '' };
    }
  });

  return updatedConfigSubset;
};

export const mapDataConfiguration = (configuration) => {
  let prevElement = null;
  let configurationSubset = cloneDeep(configuration);
  let data = {};
  for (let i = 0; i < configuration.length; i++) {
    // reduce by one on every next itteration, skip first one...
    if (prevElement !== null) {
      configurationSubset.splice(0, 1);
    }
    const updatedConfigSubset = updateDataCfg(configurationSubset, prevElement);

    prevElement = updatedConfigSubset[0];
    // remove name and assign...
    const { name, ...prevElementWthName } = prevElement;
    data[name] = prevElementWthName;

    configurationSubset = cloneDeep(updatedConfigSubset);
  }

  return { data };
};

export const checkForErrors = (formConfig) => {
  let errors = {};
  if (!formConfig || (Array.isArray(formConfig) && !formConfig?.length)) {
    return errors;
  }

  for (let i = 0; i < formConfig?.length; i++) {
    const item = formConfig[i];
    if (Array.isArray(item) && item.length) {
      if (item?.[0]?.attrs?.error && item?.[0]?.attrs?.name) {
        errors[item[0].attrs.name] = item[0].attrs.helperText;
      }
      if (item?.[1]?.attrs?.error && item?.[1]?.attrs?.name) {
        errors[item[1].attrs.name] = item[1].attrs.helperText;
      }
    } else if (item?.attrs?.error && item?.attrs?.name) {
      errors[item.attrs.name] = item?.attrs?.helperText;
    }
  }
  return errors;
};

export const updateConfigurationForErrors = (formConfig, errors) => {
  const formConfigWErrors = formConfig.map((obj) => {
    if (Array.isArray(obj) && obj.length) {
      const newColumns = obj.map((column) => {
        const newObj = produce(column, (draft) => {
          if (column.assignHelperTextAndError) {
            draft.attrs.helperText = errors?.[column.name] ?? ''; // need to have only one palce to set error and helper text
            draft.attrs.error = !!errors?.[column.name];
          }
        });
        return newObj;
      });
      return newColumns;
    } else {
      const newObj = produce(obj, (draft) => {
        if (obj.assignHelperTextAndError) {
          draft.attrs.helperText = errors?.[obj.name] ?? '';
          draft.attrs.error = !!errors?.[obj.name];
        }
      });
      return newObj;
    }
  });

  return formConfigWErrors;
};

export const prepareConfigurationForRender = (configuration, inputData, errors) => {
  let formConfig = [];
  let dataCfg = [];

  if (!errors) {
    errors = {}; // if not passed in
  }

  if (Array.isArray(configuration) && configuration.length && isConfigValid(configuration)) {
    formConfig = configuration?.map((obj) => {
      let displayName = '';
      if (typeof obj.component?.type === 'string') {
        displayName = obj.component?.type;
      } else {
        displayName = obj.component?.type?.displayName;
      }

      const attrs = {
        ...obj.attrs,
        name: obj.name,
        dataEl: obj.attrs?.dataEl ?? `${displayName}-${obj.name}`,
      };

      // have to assign only if explicitly defined
      // if we assign automatically then it will prevent default component errors, like from InputDate
      if (obj.attrs?.helperText) {
        attrs.helperText = obj.attrs?.helperText;
      }
      if (obj.assignHelperTextAndError) {
        attrs.helperText = errors[obj.name] || obj.attrs?.helperText;
        attrs.error = !!errors[obj.name];
      }

      //this configruation will be used on recursive dependancy search
      const value = obj.allowNullValue ? inputData?.[obj?.name] : inputData?.[obj?.name] ?? '';
      dataCfg.push({
        name: obj.name,
        value: value,
        visible: obj.visible ?? true,
        show: typeof obj.visible === 'boolean' ? obj.visible : false,
        allowNullValue: obj.allowNullValue ?? false,
        regex: obj.regex,
      });

      return {
        component: obj.component,
        name: obj.name,
        attrs,
        singleRowElement: obj.singleRowElement ?? true,
        fieldMargin: obj.fieldMargin,
        fieldPlacement: obj.fieldPlacement,
        assignHelperTextAndError: obj.assignHelperTextAndError,
      };
    });
  }
  const { data } = mapDataConfiguration(dataCfg);

  let multipleRowElements = [];
  const newFormConfig = [];
  const temp = formConfig.map((obj, index) => {
    if (obj.singleRowElement) {
      newFormConfig.push(obj);
    } else {
      multipleRowElements.push(obj);
      // we only allow max 2 fields per row
      if (multipleRowElements.length === 2) {
        newFormConfig.push([...multipleRowElements]);
        multipleRowElements.length = 0;
      }
    }
  });

  const formConfigWErrors = updateConfigurationForErrors(newFormConfig, errors);

  return { formConfig: formConfigWErrors, dataCfg, data };
};

export const mapObjectConfigurationToArray = (dataObj, name, value) => {
  const arrayConfiguration = Object.keys(dataObj).map(function (key) {
    // this is the place we need to add new elements...
    return {
      name: key,
      value: key === name ? value : dataObj[key].value,
      visible: dataObj[key].visible,
      show: dataObj[key].show,
      regex: dataObj[key].regex,
      allowNullValue: dataObj[key].allowNullValue,
    };
  });

  return arrayConfiguration;
};

export const prepareDataForRenderOnChange = (dataObj, name, value) => {
  const arrayConfiguration = mapObjectConfigurationToArray(dataObj, name, value);
  const { data } = mapDataConfiguration(arrayConfiguration);
  return { data };
};

export const prepareSubmitData = (data) => {
  const res = {};
  for (const [key, value] of Object.entries(data)) {
    if (value.show) {
      res[key] = value.value;
    }
  }
  return res;
};
