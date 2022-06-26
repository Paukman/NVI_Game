import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { VALUE_DATA_TYPES } from 'config/constants';

const items = [
  {
    label: 'Select data mode',
    value: '',
  },
  {
    label: 'ACTUAL',
    value: VALUE_DATA_TYPES.ACTUAL,
  },
  {
    label: 'BUDGET',
    value: VALUE_DATA_TYPES.BUDGET,
  },
  {
    label: 'FORECAST',
    value: VALUE_DATA_TYPES.FORECAST,
  },
  {
    label: 'ACTUAL/FORECAST',
    value: VALUE_DATA_TYPES.ACTUAL_FORECAST,
  },
];

const PnLDataModeSelector = memo((props) => {
  const { label, placeholder, value, id, name, disabled, onChange, allowNoSelection, dataEl, helperText, error } =
    props;

  return (
    <Dropdown
      value={value}
      id={id}
      name={name}
      disabled={disabled}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      items={allowNoSelection ? items : items.slice(1)}
      data-el={dataEl}
      helperText={helperText}
      error={error}
    />
  );
});

PnLDataModeSelector.displayName = 'PnLDataModeSelector';

PnLDataModeSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowNoSelection: PropTypes.bool,
};

PnLDataModeSelector.defaultProps = {
  label: 'Data Mode',
  allowNoSelection: true,
};

export { PnLDataModeSelector };
