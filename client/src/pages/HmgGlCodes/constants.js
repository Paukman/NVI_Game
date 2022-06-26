import React from 'react';
import { InputField } from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';
import { buttonEditGrey, buttonRemoveGrey, cancelButton, submitButton } from 'config/actionButtons';
import {
  MdoGlCodeSelector,
  StatusSelector,
  HotelSelector,
  FilterPnLDepartments,
  FilterPnLMdoGlCodes,
  FilterStatusActiveInactive,
  GenericSelector,
} from 'components';
import { placements } from 'components/GenericForm';

export const pageState = {
  ERROR: { state: 'ERROR' },
  NO_DATA: { state: 'NO_DATA' }, // will use different message for different modules.
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'MESSAGE', message: getText('generic.selectFilters') },
};

export const GL_MODES = {
  MAPPING: {
    value: 0,
    label: getText('hmgGlCodes.mapping'),
  },
  HIERARCHY: {
    value: 1,
    label: getText('hmgGlCodes.hierarchy'),
  },
};

export const ALL_MDO_CODES = 'ALL_MDO_CODES';
export const ALL = 'ALL';

export const DEFAULT_FILTERS = {
  filterMdoGlCode: ALL_MDO_CODES,
  filterMdoDepartment: ALL,
  filterStatus: ALL,
};

export const SEARCH_EXCLUDE_LIST = ['id', 'mdoGlCode', 'hotelId', 'statusId'];

export const filtersConfig = (onHandleCancel, onHandleSubmit) => {
  const buttons = [
    { ...cancelButton, onHandleClick: onHandleCancel },
    { ...submitButton, onHandleClick: onHandleSubmit, submitButton: true },
  ];

  const displayConfig = {
    formTitle: getText('generic.filters'),
    //onXCancelButton: onXCancelButton,
    formPlacement: placements.center,
    buttonsPlacement: placements.left,
    fieldMargin: 30,
    width: 320,
    buttonsSize: 'default',
  };

  const items = [
    {
      name: 'filterMdoGlCode', // mandatory
      attrs: { label: getText('generic.mdoGlCode') },
      component: <FilterPnLMdoGlCodes />, // mandatory
      visible: true, // mandatory
    },
    {
      name: 'filterMdoDepartment',
      attrs: { label: getText('generic.department') },
      component: <FilterPnLDepartments />,
      visible: true,
    },
    {
      name: 'filterStatus',
      attrs: { label: getText('generic.status') },
      component: <FilterStatusActiveInactive />,
      visible: true,
    },
  ];
  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
    },
  };
};

export const GL_CODE_STATUS = {
  ACTIVE: 100,
  DISABLED: 0,
};

export const STATUS_ITEMS = {
  disabled: { label: getText('selectors.status.disabled'), value: GL_CODE_STATUS.DISABLED },
  active: { label: getText('selectors.status.active'), value: GL_CODE_STATUS.ACTIVE },
};

export const addEditGenericFormConfig = (onHandleCancel, onHandleSubmit, onChange, state) => {
  const buttons = [
    { ...cancelButton, onHandleClick: onHandleCancel },
    // with submitButton: true, this button will return field values
    {
      ...submitButton,
      onHandleClick: onHandleSubmit,
      submitButton: true,
      // plan for calc eventually, check client/src/components/GenericForm/constants.js example for visible calc
      isDisabled: { dependencies: ['hmgGlCode', 'displayName', 'mdoGlCode'] },
    },
  ];

  const displayConfig = {
    formTitle: state?.hotelName,
    //onXCancelButton: onHandleCancel,
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
      name: 'hotelId', // mandatory
      attrs: { label: getText('generic.property'), disableClearable: true },
      component: <HotelSelector />, // mandatory
      visible: state?.hmgGlCodeId ? false : !state?.hotelName ? true : false, // mandatory
    },
    {
      name: 'hmgGlCode',
      attrs: { label: getText('generic.hmgGlCode'), required: true },
      component: <InputField />,
      visible: true,
    },
    {
      name: 'displayName',
      attrs: { label: getText('generic.displayName'), required: true },
      component: <InputField />,
      visible: true,
    },
    {
      name: 'mdoGlCode',
      attrs: {
        label: getText('generic.mdoGlCode'),
        required: true,
        selectNone: true,
        skipAllParents: true,
        disabledItems: state?.disabledItems,
      },
      component: <MdoGlCodeSelector />,
      visible: true,
    },
    {
      name: 'statusId',
      attrs: { label: getText('generic.status'), disabled: state?.mdoGlCode, items: STATUS_ITEMS },
      component: <GenericSelector />,
      visible: true,
    },
  ];
  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
      onChange: onChange,
    },
  };
};

export const GL_ACTIONS = {
  EDIT: 'EDIT',
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  MAP_MDO: 'MAP_MDO',
  CHANGE_STATUS: 'CHANGE_STATUS',
  DOWNLOAD: 'DOWNLOAD',
  ALL_STATUSES_ON: 'ALL_STATUSES_ON',
  COPY: 'COPY',
  UPLOAD: 'UPLOAD',
};

export const COA_ITEMS = [
  {
    label: 'HMG',
    value: 0,
  },
  {
    label: 'Specific Hotels',
    value: 1,
  },
];

export const STATUSES = {
  IDLE: 1,
  SAVING: 2,
  SAVED: 3,
};
