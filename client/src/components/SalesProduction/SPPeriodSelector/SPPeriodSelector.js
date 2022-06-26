import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { PERIODS } from 'config/constants';

const items = [
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
  {
    label: 'CUSTOM',
    value: PERIODS.CUSTOM,
  },
];

const SPPeriodSelector = memo((props) => {
  const { label, placeholder, value, id, name, onChange, disabled, dataEl } = props;
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
    />
  );
});

SPPeriodSelector.displayName = 'SPPeriodSelector';

SPPeriodSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  dataEl: PropTypes.string,
};

SPPeriodSelector.defaultProps = {
  dataEl: 'selectorSPPeriod',
};

export { SPPeriodSelector };
