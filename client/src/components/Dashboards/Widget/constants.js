import React from 'react';
import { InputField, InputDate, Label, colors, MultiSelectDropdown, YearSelector, Switch } from 'mdo-react-components';

import {
  GenericSelector,
  GssAssignedPrioritiesDropdown,
  KpiDropdown,
  HotelSelector /* MdoGlCodeSelector */,
  BrandsDropdown,
  GssDescriptionDropdown,
} from 'components';
import { getText } from 'utils';
import { placements } from 'components/GenericForm';
import { WIDGET_VALUE_DATE_OFFSET_TYPE, valueDateOffsetTypes /* valueTypes */, KPI_GSS_VALUE } from 'config/constants';

export const WIDGET_ID = {
  OCCUPANCY: '00000000-1000-4000-9000-000000001000',
  CREDIT_SETTLEMENT: `00000000-1000-4000-9200-000000007000`,
  BY_REVENUE: '00000000-1000-4000-9000-000000000200',
  BY_PROPERTY: '00000000-1000-4000-9000-000000000100',
  AR_AGING_WIDGET: '00000000-1000-4000-9000-00000000A000',
};

export const HEIGHT_STEP = 400;
export const DATE_RANGE = 'DATE_RANGE';

export const MASTER_DECIMAL_VALUES = [0, 1, 2, 3, 4];

export const addDashboardCommentConfig = (onHandleCancel, onHandleSubmit, state, onErrorHandle) => {
  const buttons = [
    {
      clickId: 'submit',
      text: getText('generic.submit'),
      variant: 'success',
      dataEl: 'buttonSave',
      onHandleClick: onHandleSubmit,
      submitButton: true,
      // if value is an array it will check length
      isDisabled: { dependencies: ['message', 'kpiId'] },
      holdOnErrors: true,
      disableOnErrors: true,
    },
  ];

  const displayConfig = {
    formTitle: getText('generic.addComment'),
    onXCancelButton: onHandleCancel,
    formPlacement: placements.center,
    buttonsPlacement: placements.right,
    fieldMargin: 20,
    width: 600,
    buttonsSize: 'default',
    topSpacing: 10,
    aroundSpacing: 30,
    //buttonPadding: -28, //enable this once implemented viewAllComments
    buttonPadding: 10,
  };

  const property = {
    name: 'hotelId', // mandatory
    attrs: { label: getText('generic.property'), disableClearable: true, required: true },
    component: <HotelSelector />, // mandatory
    visible: true, // mandatory
    fieldMargin: 35,
  };

  const kpi = {
    name: 'kpiId',
    attrs: {
      label: getText('kpi.addKpi'),
      multiple: true,
      required: true,
    },
    component: <KpiDropdown />,
    visible: true,
    fieldMargin: 24,
  };
  const users = {
    name: 'users',
    attrs: {
      label: getText('dashboard.usersToNotify'),
      placeholder: '',
      items: state?.usersList,
    },
    component: <MultiSelectDropdown />,
    visible: true,
    fieldMargin: 32,
  };
  const datesLabel = {
    name: 'datesLabel',
    attrs: {
      label: getText('dashboard.datesInQuestion'),
      color: colors.darkBlue,
      fontSize: '12px',
      toTheRight: false,
    },
    component: <Label />,
    visible: true,
    fieldMargin: 26,
  };
  const startDate = {
    name: 'startDate',
    attrs: {
      label: getText('generic.fromDate'),
      autoClose: true,
    },
    component: <InputDate />,
    visible: true,
    singleRowElement: false,
    fieldMargin: 12,
    assignHelperTextAndError: true,
  };
  const endDate = {
    name: 'endDate',
    attrs: {
      label: getText('generic.toDate'),
      autoClose: true,
    },
    component: <InputDate />,
    visible: true,
    singleRowElement: false,
    fieldMargin: 12,
    assignHelperTextAndError: true,
  };
  const message = {
    name: 'message',
    attrs: {
      label: 'Add Comment',
      multiline: true,
      rows: 3,
      maxRows: 3,
      variant: 'outlined',
      required: true,
      fontSize: 14,
      maxNoOfChars: 500,
    },
    component: <InputField />,
    visible: true,
    fieldMargin: 32,
  };

  // todo implement linkAction as in ViewDashboardComment here
  // pass in onHandleViewAllComments for onClick
  const viewAllCommentsLabel = {
    name: 'viewAllCommentsLabel',
    attrs: {
      label: getText('dashboard.viewAllComments'),
      color: colors.blue,
      fontSize: '12px',
      toTheRight: false,
      fontWeight: 'bold',
    },
    component: <Label />,
    visible: false,
    fieldMargin: 42,
  };

  const items = [property, kpi, users, datesLabel, startDate, endDate, message, viewAllCommentsLabel];

  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
      onErrorHandle,
    },
  };
};

export const CUSTOM_COLUMN_MODE = {
  ADD: 'ADD',
  EDIT: 'EDIT',
};

export const amountTypes = [
  getText('dataTypes.ACTUAL'),
  getText('dataTypes.BUDGET'),
  getText('dataTypes.FORECAST'),
  // once in db use DictionaryDropdown with type value-data-type
  //  getText('dataTypes.BOB'),
];

export const toggleTypes = [getText('toggleTypes.On'), getText('toggleTypes.Off')];

export const months = {
  JAN: { label: getText('months.January'), value: 0 },
  FEB: { label: getText('months.February'), value: 1 },
  MAR: { label: getText('months.March'), value: 2 },
  APR: { label: getText('months.April'), value: 3 },
  MAY: { label: getText('months.May'), value: 4 },
  JUN: { label: getText('months.June'), value: 5 },
  JUL: { label: getText('months.July'), value: 6 },
  AUG: { label: getText('months.August'), value: 7 },
  SEP: { label: getText('months.September'), value: 8 },
  OCT: { label: getText('months.October'), value: 9 },
  NOV: { label: getText('months.November'), value: 10 },
  DEC: { label: getText('months.December'), value: 11 },
};

export const inputTypeId = {
  0: 'None',
  1: 'Hotel Selector',
  2: 'Hotel Group Selector',
  kpiId: 3, // rev, prop
  mdoGlCode: 4, // rev, prop
  period: 5, // rev
  valueDataType: 6, // rev, prop
  valueDateOffsetType: 7, // rev
  aggregator: 8, //      prop
  formula: 9, // rev, prop
  10: 'Interval',
  valueTypeId: 11, // this is not in original set, adding this one for EDIT
};

export const decimalOverrideValues = [getText('generic.off'), 0, 1, 2, 3, 4];

export const addEditColumnFormConfig = (onHandleCancel, onHandleSubmit, mode, state) => {
  const buttons = [
    {
      clickId: 'cancel',
      text: getText('generic.cancel'),
      variant: 'default',
      onHandleClick: onHandleCancel,
      dataEl: 'buttonCancel',
    },
    {
      clickId: 'submit',
      text: mode === CUSTOM_COLUMN_MODE.EDIT ? getText('generic.save') : getText('generic.add'),
      variant: 'success',
      onHandleClick: onHandleSubmit,
      dataEl: 'buttonSave',

      submitButton: true,
      isDisabled: { dependencies: state?.customTableTypeId === 1 ? ['name', 'kpiId'] : ['name', 'period'] },
    },
  ];

  const displayConfig = {
    formTitle: mode === CUSTOM_COLUMN_MODE.EDIT ? getText('dashboard.editColumn') : getText('dashboard.addColumn'),
    formPlacement: placements.center,
    buttonsPlacement: placements.left,
    fieldMargin: 16,
    width: 380,
    buttonsSize: 'default',
    titleFont: 20,
    topSpacing: 20,
    aroundSpacing: 32,
  };

  const name = {
    name: 'name', // mandatory
    attrs: {
      // all field attrivbutes including lable
      label: getText('generic.name'),
      required: true,
    },
    component: <InputField />, // mandatory
    visible: true, // mandatory
  };

  const kpi = {
    name: 'kpiId',
    attrs: {
      label: getText('kpi.addKpi'),
      required: true,
    },
    component: <KpiDropdown />,
    //visible: addEditConfig?.includes(inputTypeId.kpiId) ?? false,
    visible: true,
    fieldMargin: 10,
  };

  const brandDescription = {
    name: 'brandDescription', // mandatory
    attrs: {
      // all field attrivbutes including lable
      label: getText('gss.brandDescription'),
      items: [
        { label: getText('gss.brand'), value: 'Brand' },
        { label: getText('gss.description'), value: 'Description' },
      ],
    },
    component: <GenericSelector />,
    visible: {
      dependants: ['kpiId'],
      calc: (value) => KPI_GSS_VALUE.includes(value),
    },
  };

  const brands = {
    name: 'brandId', // mandatory
    attrs: {
      // all field attrivbutes including lable
      label: getText('gss.brands'),
    },
    component: <BrandsDropdown />,
    visible: {
      dependants: ['brandDescription'],
      calc: (value) => value === 'Brand',
    },
  };

  const gssPriorities = {
    name: 'priority', // mandatory
    attrs: {
      // all field attrivbutes including lable
      label: getText('gss.gssPriorities'),
    },
    component: <GssAssignedPrioritiesDropdown />,
    visible: {
      dependants: ['brandDescription'],
      calc: (value) => value === 'Brand',
    },
  };

  const gssDescription = {
    name: 'description', // mandatory
    attrs: {
      // all field attrivbutes including lable
      label: getText('gss.gssDescription'),
    },
    component: <GssDescriptionDropdown />,
    visible: {
      dependants: ['brandDescription'],
      calc: (value) => value === 'Description',
    },
  };

  const timePeriods = [
    getText('selectors.periods.Current'),
    getText('selectors.periods.WTD'),
    getText('selectors.periods.WEEK'),
    getText('selectors.periods.MTD'),
    getText('selectors.periods.MONTH'),
    getText('selectors.periods.QTD'),
    getText('selectors.periods.QUARTER'),
    getText('selectors.periods.YTD'),
    getText('selectors.periods.YEAR'),
    getText('selectors.periods.TTM'),
  ];

  const overrideDefaultPeriod = {
    name: 'overrideDefaultPeriod',
    attrs: {
      label: getText('dashboard.overridePeriodSetting'),
      labelFontSize: 12,
      labelMarginLeft: -16,
      labelPlacement: 'start',
    },
    component: <Switch />,
    visible: true,
    fieldMargin: 10,
  };

  const period = {
    name: 'period',
    attrs: {
      label: state?.widgetId === WIDGET_ID.BY_REVENUE ? `${getText('generic.period')} *` : getText('generic.period'),
      // cannot use widgetsPeriods because it has date_range. Hardcoded for now, but once
      // we implement date range then we will use is togethere with PeriodSelector
      // which using proper selection inside (... getText(`selectors.periods.${period}`),
      // and not GenericSelector
      selection: timePeriods,
      required: true,
      autoSelectOnNoValue: state?.widgetId === WIDGET_ID.BY_REVENUE,
    },
    component: <GenericSelector />,
    visible:
      state?.widgetId === WIDGET_ID.BY_REVENUE
        ? true // always visible on By Revenue
        : {
            dependants: ['overrideDefaultPeriod'],
            calc: (value) => value === true,
          },
    fieldMargin: 6,
  };

  const overrideDecimalMaster = {
    name: 'overrideDecimalMaster',
    attrs: {
      label: getText('dashboard.overrideDecimalMaster'),
      labelFontSize: 12,
      labelMarginLeft: -16,
      labelPlacement: 'start',
    },
    component: <Switch />,
    visible: true,
    fieldMargin: 10,
  };

  const decimalSelector = {
    name: 'valueDecimals',
    attrs: {
      label: getText('dashboard.selectDecimal'),
      selection: MASTER_DECIMAL_VALUES,
    },
    component: <GenericSelector />,
    visible: {
      dependants: ['overrideDecimalMaster'],
      calc: (value) => value === true,
    },
    fieldMargin: 6,
  };

  const performanceIndicatorMasterOverride = {
    name: 'performanceIndicatorMasterOverride',
    attrs: {
      label: getText('dashboard.performanceIndicatorMasterOverride'),
      // dictionaryType: 'custom-table-row-column-value-data-type',
      selection: toggleTypes,
    },
    component: <GenericSelector />, // <DictionaryDropdown />,
    // if visible is different than true or false, both fields are mandatory
    //visible: addEditConfig?.includes(inputTypeId.valueDataType) ?? false,
    visible: true,
  };

  const amountType = {
    name: 'valueDataType',
    attrs: {
      label: getText('dashboard.amountType'),
      // dictionaryType: 'custom-table-row-column-value-data-type',
      selection: amountTypes,
    },
    component: <GenericSelector />, // <DictionaryDropdown />,
    // if visible is different than true or false, both fields are mandatory
    //visible: addEditConfig?.includes(inputTypeId.valueDataType) ?? false,
    visible: true,
  };

  const periodComparison = {
    name: 'valueDateOffsetType',
    attrs: {
      label: getText('dashboard.periodComparison'),
      items: valueDateOffsetTypes,
      autoSelectOnNoValue: true,
    },
    component: <GenericSelector />,
    //visible: addEditConfig?.includes(inputTypeId.valueDateOffsetType) ?? false,
    visible: true,
  };

  const month = {
    name: 'month',
    attrs: {
      label: getText('generic.month'),
      items: months,
    },
    component: <GenericSelector />,
    visible: {
      dependants: ['valueDateOffsetType'],
      calc: (value) => value === WIDGET_VALUE_DATE_OFFSET_TYPE.CUSTOM_MONTH,
    },
  };

  const year = {
    name: 'year',
    attrs: {
      label: getText('generic.year'),
    },
    component: <YearSelector />,
    visible: {
      dependants: ['valueDateOffsetType'],
      calc: (value) => {
        return (
          value === WIDGET_VALUE_DATE_OFFSET_TYPE.CUSTOM_MONTH || value === WIDGET_VALUE_DATE_OFFSET_TYPE.CUSTOM_YEAR
        );
      },
    },
  };

  // not used currently TODO address later.
  // TODO implement when ready from BE
  // {
  //   name: 'aggregator',
  //   attrs: {
  //     label: 'Aggregator',
  //   },
  //   component: <KpiAggregatorDropdown />,
  //   visible: addEditConfig?.includes(inputTypeId.aggregator) ?? false,
  // },
  // TODO tbd when we figure out how to use it in formulas
  // {
  //   name: 'mdoGlCode',
  //   attrs: {
  //     label: 'MDO GL Code',
  //   },
  //   component: <MdoGlCodeSelector />,
  //   visible: addEditConfig?.includes(inputTypeId.mdoGlCode) ?? false,
  // },
  // TODO tbd when we figure out how to deal with fomula
  // {
  //   name: 'formula',
  //   attrs: {
  //     label: 'Formula',
  //   },
  //   component: <InputField />,
  //   visible: addEditConfig?.includes(inputTypeId.formula) ?? false,
  // },

  // {
  //   name: 'valueTypeId',
  //   attrs: {
  //     label: 'Value Type',
  //     items: valueTypes,
  //     autoSelectOnNoValue: true,
  //   },
  //   component: <GenericSelector />,
  //   visible: addEditConfig?.includes(inputTypeId.valueTypeId) ?? false,
  // },

  const items =
    state?.customTableTypeId === 1 // 1 by property, 2 by revenue
      ? [
          name,
          overrideDefaultPeriod,
          period,
          kpi,
          brandDescription,
          brands,
          gssPriorities,
          gssDescription,
          amountType,
          periodComparison,
          month,
          year,
          overrideDecimalMaster,
          decimalSelector,
          performanceIndicatorMasterOverride,
        ]
      : [
          name,
          brandDescription,
          brands,
          gssPriorities,
          gssDescription,
          period,
          amountType,
          periodComparison,
          month,
          year,
          overrideDecimalMaster,
          decimalSelector,
          performanceIndicatorMasterOverride,
        ];
  return {
    formConfig: {
      buttons,
      displayConfig,
      items,
    },
  };
};

export const REPORTS = {
  BY_PROPERTY: 'DASHBOARD-BY-PROPERTY-TABLE',
};

export const REVENUE_TYPES = ['ALLFNBREV', 'OTDREV', 'RMREV90'];
export const REVENUE_TYPES_LABEL = {
  ALLFNBREV: getText('revenueType.fAndBRevenue'),
  OTDREV: getText('revenueType.otherRevenue'),
  RMREV90: getText('revenueType.roomRevenue'),
};

export const missingDateColumns = [
  {
    'Property ID': '',
    'Property Name': '',
    Date: '',
    'Missing Room Revenue': '',
    'Missing F&B Revenue': '',
    'Missing Other Revenue': '',
  },
];
