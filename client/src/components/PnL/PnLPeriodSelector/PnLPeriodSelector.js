import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { PERIODS } from 'config/constants';

const items = [
  {
    label: 'MTD',
    value: PERIODS.MTD,
  },
  {
    label: 'QTD',
    value: PERIODS.QTD,
  },
  {
    label: 'YTD',
    value: PERIODS.YTD,
  },
  {
    label: 'MONTH',
    value: PERIODS.MONTH,
  },
  {
    label: 'QUARTER',
    value: PERIODS.QUARTER,
  },
  {
    label: 'YEAR',
    value: PERIODS.YEAR,
  },
];

const PnLPeriodSelector = memo((props) => {
  const { label, placeholder, value, id, name, onChange, disabled, dataEl, helperText, error } = props;

  return (
    <Dropdown
      label={label}
      value={value}
      id={id}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      items={items}
      disabled={disabled}
      dataEl={dataEl}
      helperText={helperText}
      error={error}
    />
  );
});

PnLPeriodSelector.displayName = 'PnLKpiSelector';

PnLPeriodSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  dataEl: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.string,
};

export { PnLPeriodSelector };
