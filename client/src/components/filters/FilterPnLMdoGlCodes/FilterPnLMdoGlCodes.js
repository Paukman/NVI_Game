import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';

const items = [
  {
    label: 'All MDO Codes',
    value: 'ALLMDOCODES',
  },
  {
    label: 'Mapped',
    value: 'MAPPED',
  },
  {
    label: 'Unmapped',
    value: 'UNMAPPED',
  },
  {
    label: 'Not Found',
    value: 'NOTFOUND',
  },
];

const FilterPnLMdoGlCodes = memo((props) => {
  const { id, name, value, onChange, disabled } = props;
  return <Dropdown id={id} name={name} value={value} onChange={onChange} disabled={disabled} items={items} />;
});

FilterPnLMdoGlCodes.displayName = 'FilterPnLMdoGlCodes';

FilterPnLMdoGlCodes.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export { FilterPnLMdoGlCodes };
