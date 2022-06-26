import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';

const items = [
  {
    label: 'All Statuses',
    value: 'ALL',
  },
  {
    label: 'Only Active',
    value: 'ACTIVE',
  },
  {
    label: 'Only Inactive',
    value: 'INACTIVE',
  },
];

const FilterStatusActiveInactive = memo((props) => {
  const { id, name, value, onChange, disabled } = props;

  return <Dropdown id={id} name={name} value={value} onChange={onChange} disabled={disabled} items={items} />;
});

FilterStatusActiveInactive.displayName = 'FilterStatusActiveInactive';

FilterStatusActiveInactive.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export { FilterStatusActiveInactive };
