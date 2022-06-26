import React from 'react';
import {
  Dropdown,
  MultiSelectDropdown,
  InputField,
  InputDate,
  RenderValue,
  SearchableDropdown,
} from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';
import { GenericSelector } from 'components';
import { placements } from 'components/GenericForm';

const numberFormatFields = ['variance', 'outstandingAmount', 'authorizedLimitAmount', 'roomRate'];
export const extraSearchFields = [
  'outstandingAmountSearch',
  'authorizedLimitAmountSearch',
  'varianceSearch',
  'roomRateSearch',
];

const guestLedgerOperators = [
  {
    label: getText('guestLedger.greaterThan'),
    value: '>',
  },
  {
    label: getText('guestLedger.lessThan'),
    value: '<',
  },
];

const CellRenderer = (props) => {
  const { value, column } = props;
  if (numberFormatFields.includes(column.field)) {
    return <RenderValue value={value} displaySize={'as-is'} valueTypeId={2} valueFormat={'0,000.00'}></RenderValue>;
  }
  return value;
};

export const mapGuestLedgerColumns = (items) => {
  const mapping = [];
  items?.forEach((item, index) => {
    mapping.push({
      field: item.fieldName,
      headerName: item.title,
      align: 'left',
      width: index ? 100 : 120,
      minWidth: index ? 100 : 120,
      headerAlign: 'left',
      bgColor: index % 2 ? false : true,
      hasBorder: false,
      sortable: true,
      onRender: CellRenderer,
    });
  });
  return mapping;
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'DEFAULT', message: getText('guestLedger.noData') },
};

export const guestLedgerFilterConfig = (
  onHandleCancel,
  onHandleSubmit,
  onHandleCloseDrawer,
  filterSelections,
  onErrorHandle,
) => {
  const roomTypesObjs =
    filterSelections?.roomTypesItems?.map((obj) => {
      return { value: obj, label: obj };
    }) || [];

  const marshaCodeObjs =
    filterSelections?.marshaCodeItems?.map((obj) => {
      return { value: obj, label: obj };
    }) || [];

  const buttons = [
    {
      clickId: 'cancel',
      text: getText('generic.reset'),
      variant: 'default',
      onHandleClick: onHandleCancel,
      dataEl: 'buttonCancel',
    },
    {
      clickId: 'submit',
      text: getText('generic.apply'),
      variant: 'success',
      dataEl: 'buttonSave',
      onHandleClick: onHandleSubmit,
      submitButton: true,
      holdOnErrors: true,
      disableOnErrors: true,
      disabledOnEmpty: true,
    },
  ];

  const displayConfig = {
    formTitle: getText('generic.filters'),
    onXCancelButton: onHandleCloseDrawer,
    formPlacement: placements.center,
    buttonsPlacement: placements.left,
    fieldMargin: 20,
    width: 400,
    buttonsSize: 'default',
    topSpacing: 10,
    aroundSpacing: 30,
    buttonPadding: 40,
  };

  const items = [
    {
      name: 'hotelCode',
      attrs: {
        label: getText('guestLedger.marshaCode'),
        items: filterSelections.marshaCodeItems || [],
      },
      component: <MultiSelectDropdown />,
      visible: true,
    },
    {
      name: 'roomType',
      attrs: {
        label: getText('generic.type'),
        items: filterSelections.roomTypesItems || [],
      },
      component: <MultiSelectDropdown />,
      visible: true,
    },

    {
      name: 'groupCode',
      attrs: {
        label: getText('generic.group'),
        items: filterSelections.groupCodeItems || [],
        virtualize: true,
      },
      component: <SearchableDropdown />,
      visible: true,
      allowNullValue: true,
    },
    {
      name: 'settlementCode',
      attrs: {
        label: getText('generic.dbCode'),
        items: filterSelections.settlementCodeItems || [],
        virtualize: true,
      },
      component: <SearchableDropdown />,
      visible: true,
      allowNullValue: true,
    },
    {
      name: 'settlementType',
      attrs: {
        label: getText('guestLedger.settlementType'),
        selection: filterSelections.settlementTypeItems || [],
      },
      component: <GenericSelector />,
      visible: true,
    },
    {
      name: 'folio',
      attrs: {
        label: getText('guestLedger.folio'),
        items: filterSelections?.folioItems,
        virtualize: true,
      },
      component: <SearchableDropdown />,
      visible: true,
      allowNullValue: true,
    },
    {
      name: 'arrivalDate',
      attrs: {
        label: getText('generic.arrivalDate'),
        autoClose: true,
      },
      component: <InputDate />,
      visible: true,
      singleRowElement: false,
      allowNullValue: true,
      assignHelperTextAndError: true,
    },
    {
      name: 'departureDate',
      attrs: {
        label: getText('generic.departureDate'),
        autoClose: true,
      },
      component: <InputDate />,
      visible: true,
      singleRowElement: false,
      allowNullValue: true,
      assignHelperTextAndError: true,
    },
    {
      name: 'numberOfNight',
      attrs: {
        label: getText('guestLedger.numberOfNights'),
        autoClose: true,
        items: filterSelections.numberOfNightsItems || [],
        virtualize: true,
      },
      component: <SearchableDropdown />,
      visible: true,
      allowNullValue: true,
    },
    {
      name: 'outstandingAmountOperator',
      attrs: {
        label: getText('generic.outstanding'),
        placeholder: '',
        items: guestLedgerOperators,
      },
      component: <Dropdown />,
      visible: true,
      singleRowElement: false,
      assignHelperTextAndError: true,
    },
    {
      name: 'outstandingAmount',
      attrs: {
        label: getText('generic.amount'),
        autoClose: true,
      },
      component: <InputField />,
      visible: true,
      singleRowElement: false,
      disabled: {
        dependants: ['outstandingAmountOperator'],
        calc: (value) => value !== '',
      },
      assignHelperTextAndError: true,
      regex: /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/g,
    },

    {
      name: 'authorizedLimitOperator',
      attrs: {
        label: getText('generic.limit'),
        placeholder: '',
        items: guestLedgerOperators,
      },
      component: <Dropdown />,
      visible: true,
      singleRowElement: false,
      assignHelperTextAndError: true,
    },
    {
      name: 'authorizedLimitAmount',
      attrs: {
        label: getText('generic.amount'),
        autoClose: true,
      },
      component: <InputField />,
      visible: true,
      singleRowElement: false,
      disabled: {
        dependants: ['authorizedLimitOperator'],
        calc: (value) => value !== '',
      },
      assignHelperTextAndError: true,
      regex: /^[+-]?((\.\d+)|(\d+(\.\d+)?))$/g,
    },
  ];

  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
      onErrorHandle,
    },
  };
};

// if value returns null, add allowNullValue: true,
export const DEFAULT_FILTERS = {
  roomType: [],
  groupCode: null,
  settlementCode: null,
  settlementType: '',
  folio: null,
  arrivalDate: null,
  departureDate: null,
  numberOfNight: null,
  outstandingAmount: '',
  authorizedLimitAmount: '',
  outstandingAmountOperator: '',
  authorizedLimitOperator: '',
  hotelCode: [],
};

export const GL_PAGINATION = {
  page: 1,
  pageSize: 10000,
};

export const FILTER_TYPES = ['marshaCode', 'settlementType', 'type', 'group', 'dbCode', 'folio', 'numberOfNights'];
