import React from 'react';
import { InputDate, InputField, RadioGroup } from 'mdo-react-components';
import { PnLPeriodSelector } from 'components';
import { getText } from 'utils/localesHelpers';

/***
 * This file is an example of configuration
 */

export const placements = {
  right: 'right',
  left: 'left',
  center: 'center',
};

const onSubmit = (data) => {};
const onCancel = (data) => {};

export const buttons = [
  {
    clickId: 'cancel', // this is mandatory for cancel button
    text: 'Cancel',
    variant: 'default',
    onHandleClick: onSubmit,
  },
  {
    clickId: 'submit', // this is mandatory for submit buttons
    text: 'Save',
    variant: 'success',
    onHandleClick: onCancel,
  },
];

export const data = {
  name: 'Name',
  columnFilter: 'YTD',
  amountTypeKPI: 'kpi',
  amountType: 'Actuals',
  kpi: 'Chosen KPI',
  dataFilter: 'Select A Month',
  month: 'July',
  year: '2021',
  fromDate: new Date(),
  date: new Date(),
};

export const errors = {
  name: 'This field is required',
  columnFilter: 'Filter must be present',
  kpi: 'KPI must be present',
};

export const formConfig = {
  displayConfig: {
    formTitle: 'Some Title',
    formPlacement: placements.center, // where form is placed
    buttonsPlacement: placements.center, // where buttons are places compared to the form
    fieldMargin: 10, // space between fields
    width: 400, //form width (default is 380)
    onXCancelButton: onCancel,
  },
  buttons: buttons,
  items: [
    {
      name: 'name', // mandatory
      attrs: {
        // all field attrivbutes including lable
        label: 'Name',
        required: true,
      },
      component: <InputField />, // mandatory
      visible: true, // mandatory
      helperText: getText('po.required'),
    },
    {
      name: 'columnFilter',
      attrs: {
        label: 'Column Filter',
      },
      component: <PnLPeriodSelector />,
      visible: true,
    },
    {
      name: 'amountTypeKPI',
      attrs: {
        row: true,
        buttonsCfg: [
          { value: 'amountType', label: 'Amount Type' },
          { value: 'kpi', label: 'KPI' },
        ],
      },
      component: <RadioGroup />,
      visible: true,
    },

    {
      name: 'amountType',
      attrs: {
        label: 'Amount Type',
      },
      component: <InputField />,
      // if visible is different than true or false, both fields are mandatory
      visible: {
        dependants: ['amountTypeKPI'],
        calc: (value) => value === 'amountType',
      },
    },

    {
      name: 'kpi',
      attrs: {
        label: 'KPI',
      },
      component: <InputField />,
      visible: {
        dependants: ['amountTypeKPI'],
        calc: (value) => value === 'kpi',
      },
      helperText: getText('po.required'),
    },

    {
      name: 'dataFilter',
      attrs: {
        label: 'Data Filter',
      },
      component: <InputField />,
      visible: {
        dependants: ['amountTypeKPI'],
        calc: (value) => value === 'amountType' || value === 'kpi',
      },
    },

    {
      name: 'month',
      attrs: {
        label: 'Month',
      },
      component: <InputField />,
      visible: {
        dependants: ['dataFilter'],
        calc: (value) => value === 'Select A Month',
      },
    },

    {
      name: 'year',
      attrs: {
        label: 'Year',
      },
      component: <InputField />,
      visible: {
        dependants: ['dataFilter'],
        calc: (value) => value === 'Select A Year' || value === 'Select A Month',
      },
    },

    {
      name: 'date',
      attrs: {
        label: 'Date',
      },
      component: <InputDate />,
      visible: true,
    },
    {
      name: 'fromDate',
      attrs: {
        label: 'From Date',
      },
      component: <InputDate />,
      visible: true,
    },
  ],
};
