import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';

const items = [
  {
    label: 'NO KPI',
    value: 'NO_KPI',
  },
  {
    label: 'POR ($)',
    value: 'POR',
  },
  {
    label: 'PAR ($)',
    value: 'PAR',
  },
  {
    label: 'REV (%)',
    value: 'REV_PERCENTAGE',
  },
];

const PnLKpiSelector = memo((props) => {
  const { label, placeholder, value, id, name, disabled, onChange, dataEl } = props;
  return (
    <Dropdown
      label={label}
      value={value}
      id={id}
      name={name}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      items={items}
      dataEl={dataEl ?? 'dropdownPnLKpiSelector'}
    />
  );
});

PnLKpiSelector.displayName = 'PnLKpiSelector';

PnLKpiSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  dataEl: PropTypes.string,
};

PnLKpiSelector.defaultProps = {
  label: 'KPI',
};

export { PnLKpiSelector };
