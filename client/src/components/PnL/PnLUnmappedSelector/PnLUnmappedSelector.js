import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { PNL_UNMAPPED_SELECTORS } from 'config/constants';

const items = () => {
  const items = [];
  for (const [key, keyValuePair] of Object.entries(PNL_UNMAPPED_SELECTORS)) {
    items.push({
      label: keyValuePair.label,
      value: keyValuePair.value,
    });
  }
  return items;
};

const PnLUnmappedSelector = memo((props) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    onChange,
    disabled,
    dataEl,
    helperText,
    error,
    useInitialState = false,
  } = props;
  const [initialState, _] = useState(items()[0].value);

  return (
    <Dropdown
      label={label}
      value={value || (useInitialState && initialState)}
      id={id}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      items={items()}
      disabled={disabled}
      dataEl={dataEl ?? 'dropdownPnLUnmappedSelector'}
      helperText={helperText}
      error={error}
    />
  );
});

PnLUnmappedSelector.displayName = 'PnLUnmappedSelector';

PnLUnmappedSelector.propTypes = {
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
  useInitialState: PropTypes.bool,
};

export { PnLUnmappedSelector };
