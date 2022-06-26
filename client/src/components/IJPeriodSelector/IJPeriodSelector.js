import React, { memo } from 'react';
import { Dropdown } from 'mdo-react-components';

const items = [
  {
    label: 'Current',
    value: 'CURRENT',
  },
  {
    label: 'MTD',
    value: 'MTD',
  },
  {
    label: 'YTD',
    value: 'YTD',
  },
  {
    label: 'TTM',
    value: 'TTM',
  },
];

const IJPeriodSelector = memo((props) => {
  return <Dropdown {...props} items={items} />;
});

IJPeriodSelector.displayName = 'IJPeriodSelector';

IJPeriodSelector.propTypes = {
  ...Dropdown.propTypes,
};

IJPeriodSelector.defaultProps = {
  dataEl: 'selectorIJPeriod',
};

export { IJPeriodSelector };
