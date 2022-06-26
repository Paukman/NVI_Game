import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';

const itemsForMonthReport = [
  {
    label: 'MTD',
    value: 'MTD',
  },
  {
    label: 'YTD',
    value: 'YTD',
  },
  {
    label: 'Wave 1',
    value: 'WAVE1',
  },
  {
    label: 'Wave 2',
    value: 'WAVE2',
  },
  {
    label: 'Last 3 months',
    value: 'L3M',
  },
  {
    label: 'Last 6 months',
    value: 'L6M',
  },
  {
    label: 'Rolling 6 months',
    value: 'R6M',
  },
  {
    label: 'Rolling 12 months',
    value: 'R12M',
  },
  {
    label: 'Date Range',
    value: 'DATE_RANGE',
  },
];

const itemsForYearReport = [
  {
    label: 'YTM',
    value: 'YTM',
  },
  {
    label: 'Wave 1',
    value: 'WAVE1',
  },
  {
    label: 'Wave 2',
    value: 'WAVE2',
  },
  {
    label: 'Rolling 6 months',
    value: 'R6M',
  },
  {
    label: 'Rolling 12 months',
    value: 'R12M',
  },
];

const GssPeriodSelector = memo((props) => {
  const { yearPeriods, ...rest } = props;
  return <Dropdown {...rest} items={yearPeriods ? itemsForYearReport : itemsForMonthReport} />;
});

GssPeriodSelector.displayName = 'GssPeriodSelector';

GssPeriodSelector.periodsForMonthReport = itemsForMonthReport.map((item) => item.value);
GssPeriodSelector.periodsForYearReport = itemsForYearReport.map((item) => item.value);

GssPeriodSelector.propTypes = {
  ...Dropdown.propTypes,
  yearPeriods: PropTypes.bool,
};

GssPeriodSelector.defaultProps = {
  label: 'Period',
  name: 'period',
  dataEl: 'selectorGssPeriod',
  yearPeriods: false,
};

export { GssPeriodSelector };
