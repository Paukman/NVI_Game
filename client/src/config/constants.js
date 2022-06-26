import { direction } from 'utils/pageHelpers';
import { getText } from 'utils/localesHelpers';

export const USER_ROLES = {
  TEST_USER: 0,
  SUPER_ADMIN: 1,
  CORPORATE_ADMIN: 2,
};

export const VALUE_TYPES = {
  NUMBER: 'NUMBER',
  CURRENCY: 'CURRENCY',
  PERCENTAGE: 'PERCENTAGE',
};

export const valueTypes = {
  NUMBER: {
    value: 1,
    label: getText('valueTypes.NUMBER'),
  },
  CURRENCY: {
    value: 2,
    label: getText('valueTypes.CURRENCY'),
  },
  PERCENTAGE: {
    value: 3,
    label: getText('valueTypes.PERCENTAGE'),
  },
};

export const VALUE_DATA_TYPES = {
  ACTUAL: 'ACTUAL',
  BUDGET: 'BUDGET',
  FORECAST: 'FORECAST',
  ACTUAL_FORECAST: 'ACTUAL_FORECAST',
  BOB: 'BOB',
};

export const PERIODS = {
  MTD: 'MTD',
  QTD: 'QTD',
  YTD: 'YTD',
  MONTH: 'MONTH',
  QUARTER: 'QUARTER',
  YEAR: 'YEAR',
  TTM: 'TTM',
  CUSTOM: 'CUSTOM',
};

export const COMPARE_TO = {
  LAST_YEAR: 'LAST_YEAR',
  LAST_2_YEARS: 'LAST_2_YEARS',
  LAST_3_YEARS: 'LAST_3_YEARS',
  LAST_4_YEARS: 'LAST_4_YEARS',
};

export const DATA_FILTER_VALUES = {
  THIS_YEAR: 'This Year',
  LAST_YEAR: 'Last Year',
  SELECT_YEAR: 'Select a year',
  THIS_MONTH: 'This Month',
  LAST_MONTH: 'Last Month',
  MONTH_BEFORE_PM: 'Month Before PM',
  NEXT_MONTH: 'Next Month',
  MONTH_AFTER_NM: 'Month After NM',
  SELECT_MONTH: 'Select a month',
};

export const PNL_UNMAPPED_VALUES = {
  MISSING_PROPERTY_GL: 1,
  GL_NOT_IN_COA: 2,
  GL_NOT_MAPPED: 3,
};

export const PNL_UNMAPPED_SELECTORS = {
  MISSING_PROPERTY_GL: {
    label: getText('pnl.missingPropertyGL'),
    value: PNL_UNMAPPED_VALUES.MISSING_PROPERTY_GL,
  },
  GL_NOT_IN_COA: {
    label: getText('pnl.glNotInCOA'),
    value: PNL_UNMAPPED_VALUES.GL_NOT_IN_COA,
  },
  GL_NOT_MAPPED: {
    label: getText('pnl.glNotMapped'),
    value: PNL_UNMAPPED_VALUES.GL_NOT_MAPPED,
  },
};

export const PNL_REPORT_USER_SETTINGS = {
  SUPPRESS_ZEROS: 'reports:pnl:settings:suppressZeros',
};

export const USER_SETTINGS_TYPES = {
  REPORT_META_INFO: 5000,
};

export const WIDGET_VALUE_DATE_OFFSET_TYPE = {
  THIS_YEAR: 'THIS_YEAR',
  LAST_YEAR: 'LAST_YEAR',
  CUSTOM_YEAR: 'CUSTOM_YEAR',
  THIS_MONTH: 'THIS_MONTH',
  LAST_MONTH: 'LAST_MONTH',
  MONTH_BEFOR_PM: 'MONTH_BEFOR_PM',
  NEXT_MONTH: 'NEXT_MONTH',
  MONTH_AFTER_NM: 'MONTH_AFTER_NM',
  CUSTOM_MONTH: 'CUSTOM_MONTH',
};

export const KPI_GSS_VALUE = ['00000000-0000-4000-9000-000000000043', '00000000-0000-4000-9000-000000000042'];

export const valueDateOffsetTypes = {
  THIS_YEAR: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.THIS_YEAR,
    label: getText('periodComparison.THIS_YEAR'),
  },
  LAST_YEAR: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.LAST_YEAR,
    label: getText('periodComparison.LAST_YEAR'),
  },
  THIS_MONTH: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.THIS_MONTH,
    label: getText('periodComparison.THIS_MONTH'),
  },
  LAST_MONTH: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.LAST_MONTH,
    label: getText('periodComparison.LAST_MONTH'),
  },
  MONTH_BEFOR_PM: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.MONTH_BEFOR_PM,
    label: getText('periodComparison.MONTH_BEFOR_PM'),
  },
  NEXT_MONTH: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.NEXT_MONTH,
    label: getText('periodComparison.NEXT_MONTH'),
  },
  MONTH_AFTER_NM: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.MONTH_AFTER_NM,
    label: getText('periodComparison.MONTH_AFTER_NM'),
  },
  CUSTOM_MONTH: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.CUSTOM_MONTH,
    label: getText('periodComparison.CUSTOM_MONTH'),
  },
  CUSTOM_YEAR: {
    value: WIDGET_VALUE_DATE_OFFSET_TYPE.CUSTOM_YEAR,
    label: getText('periodComparison.CUSTOM_YEAR'),
  },
};

export const ACCOUNT_TYPES = {
  1: 'Revenue',
  2: 'Labor',
  3: 'Expenses',
  4: 'Statistics',
  0: 'Settlement',
};

export const Statuses = {
  ACTIVE: 100,
  DISABLED: 0,
};

export const DASHBOARD_COMMENT_SORT_ORDER = {
  DESC: { label: getText('dashboard.newToOld'), value: direction.DESC },
  ASC: { label: getText('dashboard.oldToNew'), value: direction.ASC },
};

export const DASHBOARD_COMMENT_STATUS = {
  ACTIVE: { label: getText('dashboard.activeComments'), value: 100 },
  RESOLVED: { label: getText('dashboard.resolvedComments'), value: 0 },
  ALL: { label: getText('dashboard.allComments'), value: 'ALL' },
};
