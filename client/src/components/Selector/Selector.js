import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Dropdown } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

const Selector = memo((props) => {
  const { label, placeholder, value, id, name, disabled, onChange, options } = props;

  let items = options;

  if (typeof items === 'string') {
    const parts = items.split(',');
    items = parts.reduce((acc, part) => {
      const [label, value] = part.split('=');
      acc.push({
        label: label,
        value: value != undefined ? value : label,
      });

      return acc;
    }, []);
  }

  return (
    <Dropdown
      label={label || getText('generic.status')}
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

Selector.displayName = 'Selector';

Selector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.any,
};

export { Selector };
