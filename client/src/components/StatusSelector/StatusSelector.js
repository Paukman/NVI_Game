import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

const items = [
  {
    label: getText('selectors.status.active'),
    value: 100,
  },
  {
    label: getText('selectors.status.disabled'),
    value: 0,
  },
];

const StatusSelector = memo((props) => {
  const { label, placeholder, value, id, name, disabled, onChange } = props;

  return (
    <Dropdown
      labelName={label || getText('generic.status')}
      value={value}
      id={id}
      name={name}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      items={items}
    />
  );
});

StatusSelector.displayName = 'StatusSelector';

StatusSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export { StatusSelector };
