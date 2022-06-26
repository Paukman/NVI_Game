import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { DATA_FILTER_VALUES } from 'config/constants';

const items = () => {
  const items = [];
  for (const [key, value] of Object.entries(DATA_FILTER_VALUES)) {
    items.push({
      label: value,
      value: value,
    });
  }
  return items;
};

const DataFilterSelector = memo((props) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    disabled,
    onChange,
    allowNoSelection,
    dataEl,
    halperText,
    error,
  } = props;

  return (
    <Dropdown
      value={value}
      id={id}
      name={name}
      disabled={disabled}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      items={allowNoSelection ? items() : items().slice(1)}
      dataEl={dataEl}
      halperText={halperText}
      error={error}
    />
  );
});

DataFilterSelector.displayName = 'DataFilterSelector';

DataFilterSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  allowNoSelection: PropTypes.bool,
  dataEl: PropTypes.string,
  halperText: PropTypes.string,
  error: PropTypes.bool,
};

DataFilterSelector.defaultProps = {
  label: 'Data Filter',
  allowNoSelection: true,
};

export { DataFilterSelector };
