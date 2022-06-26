import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { COMPARE_TO } from 'config/constants';

const items = [
  {
    label: 'LAST YEAR',
    value: COMPARE_TO.LAST_YEAR,
  },
  {
    label: 'LAST 2 YEARS',
    value: COMPARE_TO.LAST_2_YEARS,
  },
  {
    label: 'LAST 3 YEARS',
    value: COMPARE_TO.LAST_3_YEARS,
  },
  {
    label: 'LAST 4 YEARS',
    value: COMPARE_TO.LAST_4_YEARS,
  },
];

const SPCompareToSelector = memo((props) => {
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

SPCompareToSelector.displayName = 'SPCompareToSelector';

SPCompareToSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  dataEl: PropTypes.string,
};

SPCompareToSelector.defaultProps = {
  dataEl: 'selectorSPCompareTo',
};

export { SPCompareToSelector };
