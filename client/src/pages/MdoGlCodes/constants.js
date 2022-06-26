import React from 'react';
import { InputField } from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';
import { cancelButton, submitButton } from 'config/actionButtons';
import { GenericSelector, MdoDepartmentSelector, DictionaryDropdown } from 'components';
import { placements } from 'components/GenericForm';
import { valueTypes } from 'config/constants';

export const addEditGenericFormConfig = (onHandleCancel, onHandleSubmit, onChange, state) => {
  const buttons = [
    { ...cancelButton, onHandleClick: onHandleCancel },
    // with submitButton: true, this button will return field values
    {
      ...submitButton,
      onHandleClick: onHandleSubmit,
      submitButton: true,
      // plan for calc eventually, check client/src/components/GenericForm/constants.js example for visible calc
      isDisabled: { dependencies: ['displayName', 'departmentId', 'accountType', 'parentId', 'valueType'] },
    },
  ];

  const displayConfig = {
    formPlacement: placements.center,
    buttonsPlacement: placements.left,
    fieldMargin: 30,
    width: 500,
    buttonsSize: 'default',
    titleFont: 16,
    topSpacing: 20,
  };

  const items = [
    {
      name: 'displayName',
      attrs: { label: `${getText('generic.description')} *` },
      component: <InputField />,
      visible: true,
    },
    {
      name: 'departmentId', // mandatory
      attrs: { label: `${getText('mdoGlCodes.department')} *`, required: true, value: state?.departmentId },
      component: <MdoDepartmentSelector />, // mandatory
      visible: true, // mandatory
    },
    {
      name: 'accountType',
      attrs: { label: `${getText('mdoGlCodes.accountType')} *`, required: true, dictionaryType: 'mdo-account-type' },
      component: <DictionaryDropdown />,
      visible: true,
    },
    {
      name: 'parentId',
      attrs: { label: `${getText('mdoGlCodes.parentSelector')} *`, required: true, items: state?.parentList },
      component: <GenericSelector />,
      visible: true,
    },
    {
      name: 'valueType',
      attrs: { label: `${getText('mdoGlCodes.valueType')} *`, required: true, items: valueTypes },
      component: <GenericSelector />,
      visible: true,
    },
  ];
  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
      onChange,
      state,
    },
  };
};
