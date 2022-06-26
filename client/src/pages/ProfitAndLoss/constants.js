import React from 'react';
import { getText } from 'utils/localesHelpers';
import { PNL_UNMAPPED_VALUES } from 'config/constants';
import { SectionHeader } from './styled';
import { RenderValue, LinkActions, colors } from 'mdo-react-components';

const addButton = [
  {
    clickId: 'add',
    text: getText('generic.add'),
    variant: 'tertiary',
    color: colors.linkBlue,
  },
];
const mapButton = [
  {
    clickId: 'map',
    text: getText('generic.map'),
    variant: 'tertiary',
    color: colors.linkBlue,
  },
];

export const mapPnLUnmappedColumns = (onHandleMoreOptions, unmappedSelector) => {
  const mapping = [
    {
      field: 'description',
      headerName: 'Description',
      align: 'left',
      width: '200px',
      minWidth: '200px',
    },
    {
      field: 'hmgGlCode',
      headerName: 'GL Code',
      align: 'left',
      width: '100px',
      minWidth: '100px',
    },
  ];
  // add months to the remaining columns...
  for (let i = 0; i < 12; i++) {
    // this is our field for render
    const month = getText(`monthsShort.${i}`);
    mapping.push({
      field: month,
      headerName: month,
      align: 'right',
      width: '50px',
      minWidth: '50px',
      headerAlign: 'center',
      bgColor: i % 2 ? false : true, // ignore this if recursive table has set hasStripes
      hasBorder: false, // calculate this if needed
      onRender: ({ dataRow }) => {
        if (dataRow[month]) {
          return (
            <RenderValue
              value={dataRow[month] || ''}
              displaySize={'as-is'}
              valueTypeId={2}
              valueFormat={'0,000.00'}
            ></RenderValue>
          );
        }
      },
    });
  }

  if (unmappedSelector !== PNL_UNMAPPED_VALUES.MISSING_PROPERTY_GL) {
    mapping.push({
      field: 'action',
      headerName: '',
      width: 60,
      bgColor: true,
      onRender: ({ dataRow }) => {
        const actionsButtons = unmappedSelector === PNL_UNMAPPED_VALUES.GL_NOT_IN_COA ? addButton : mapButton;
        return (
          <LinkActions hasFont items={actionsButtons} onClick={(action) => onHandleMoreOptions({ action, dataRow })} />
        );
      },
    });
  }

  return mapping;
};

export const pageState = {
  ERROR: { state: 'ERROR' },
  NO_DATA: { state: 'NO_DATA', message: getText('pnl.noPnLUnmappedFound') },
  LOADING: { state: 'LOADING' },
  DEFAULT: { state: 'DEFAULT', message: getText('generic.selectFilters') },
  NO_DATA_CALC: { state: 'NO_DATA_CALC', message: getText('pnl.noCommisions') },
  NO_DATA_VIEW: { state: 'NO_DATA_VIEW', message: getText('pnl.noViews') },
};

export const PNL_PAGES = {
  PNL_MONTLY: 'PnLMonthly',
  PNL_YEARLY: 'PnLYearly',
  PNL_COMPARISON: 'PnLComparison',
};

export const returnItems = [
  {
    id: PNL_PAGES.PNL_MONTLY,
    label: getText('pnl.pnlMontlyPage'),
  },
  {
    id: PNL_PAGES.PNL_YEARLY,
    label: getText('pnl.pnlYearlyPage'),
  },
  {
    id: PNL_PAGES.PNL_COMPARISON,
    label: getText('pnl.pnlComparisonPage'),
  },
];

const calculationFields = [
  { field: 'description', headerName: 'Description', width: '300px', align: 'left' },
  { field: 'formula', headerName: 'GL Code', width: '250px', minWidth: '250px', align: 'left' },
  { field: 'amount', headerName: 'Amount', width: '75px', align: 'right' },
  { field: 'commissionPercentage', headerName: '% Value', width: '75px', align: 'right' },
  { field: 'commissionAmount', headerName: 'Commission', width: '100px', align: 'right' },
];

export const buttonEditGrey = {
  clickId: 'edit',
  text: '',
  variant: 'tertiary',
  iconName: 'Edit',
  iconColor: colors.iconGrey,
};

export const buttonRemoveGrey = {
  clickId: 'remove',
  text: '',
  variant: 'tertiary',
  iconName: 'Delete',
  iconColor: colors.iconGrey,
};

const actionsButtonsCommissions = [buttonEditGrey, buttonRemoveGrey];

export const mapPnLCommissionsCalcColumns = (handleAction = () => {}) => {
  const mapping = calculationFields.map((item) => {
    let subHeaderColumn = {
      field: item.field,
      headerName: item.headerName,
      align: item.align,
      width: item.width,
      minWidth: item.minWidth || item.width,
      headerAlign: item.align,
    };
    if (item.field === 'amount' || item.field === 'commissionAmount') {
      subHeaderColumn.onRender = ({ dataRow }) => {
        return (
          <RenderValue
            value={dataRow[item.field] || ''}
            displaySize={'as-is'}
            valueTypeId={2} // currency
            valueFormat={'0,000.00'}
          ></RenderValue>
        );
      };
    }
    if (item.field === 'commissionPercentage') {
      subHeaderColumn.onRender = ({ dataRow }) => {
        return (
          <RenderValue
            value={dataRow[item.field] || ''}
            displaySize={'as-is'}
            valueTypeId={3} // percentage,
            valueFormat={'0.00'}
          ></RenderValue>
        );
      };
    }
    return subHeaderColumn;
  });

  mapping.push({
    field: '',
    width: '40px',
    minWidth: '40px',
    align: 'right',
    // eslint-disable-next-line
    onRender: ({ dataRow }) => {
      return <LinkActions items={actionsButtonsCommissions} onClick={(button) => handleAction(button, dataRow)} />;
    },
  });

  return mapping;
};

// replace with your items
export const PERIOD_ITEMS = {
  MTD: {
    label: 'MTD',
    value: getText('selectors.periods.MTD'),
  },
  QTD: {
    label: 'QTD',
    value: getText('selectors.periods.QTD'),
  },
  YTD: {
    label: 'YTD',
    value: getText('selectors.periods.YTD'),
  },
  MONTH: {
    label: 'MONTH',
    value: getText('selectors.periods.MONTH'),
  },
  QUARTER: {
    label: 'QUARTER',
    value: getText('selectors.periods.QUARTER'),
  },
  YEAR: {
    label: 'YEAR',
    value: getText('selectors.periods.YEAR'),
  },
};

export const staticData = [
  {
    id: 'Rooms available',
    parentId: null,
    valueType: 'NUMBER',
    name: 'Rooms available',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
  {
    id: 'Rooms sold',
    parentId: null,
    valueType: 'NUMBER',
    name: 'Rooms sold',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
  {
    id: 'Occupancy',
    parentId: null,
    valueType: 'PERCENTAGE',
    name: 'Occupancy',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
  {
    id: 'ADR',
    parentId: null,
    valueType: 'CURRENCY',
    name: 'ADR',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
  {
    id: 'REV-PAR',
    parentId: null,
    valueType: 'CURRENCY',
    name: 'REV-PAR',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
  {
    id: 'Total REV-PAR',
    parentId: null,
    valueType: 'CURRENCY',
    name: 'Total REV-PAR',
    glCode: null,
    columnsData: [
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
      {
        value: 0,
        kpiValue: 0,
      },
    ],
  },
];

export const buttonMakeDefault = [
  {
    clickId: 'setDefault',
    text: getText('pnl.setDefault'),
    variant: 'tertiary',
    color: colors.linkBlue,
    textDecoration: 'underline',
  },
];

export const OWNERS_VIEW_ID = '00000000-0000-4000-9000-000000000001';
export const ADD_CUSTOM_VIEW = 'ADD_CUSTOM_VIEW';
