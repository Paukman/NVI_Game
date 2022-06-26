import React, { memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { getText, search } from '../../utils/localesHelpers';
import { SalesManagerContext } from '../../contexts';
import { DropdownWrapper } from './styled';

const SalesManagerDropdown = memo((props) => {
  const { salesManagers, loadingList } = useContext(SalesManagerContext);
  const { label, placeholder, value, id, name, disabled, onChange, dataEl, disabledItems } = props;

  const items = useMemo(() => {
    const newItems = [];
    if (loadingList) {
      newItems.push({
        label: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else {
      const toExcludeMap = new Set();

      if (Array.isArray(disabledItems)) {
        disabledItems.forEach((item) => toExcludeMap.add(item));
      }

      newItems.push(
        ...salesManagers.data
          .filter((sm) => !toExcludeMap.has(sm.id) || sm.id === value)
          .map((sm) => {
            return {
              label: sm.displayName,
              value: sm.id,
              disabled: toExcludeMap.has(sm.id),
            };
          }),
      );
    }
    return newItems;
  }, [salesManagers, value]);

  return (
    <DropdownWrapper>
      <Dropdown
        label={label}
        value={value}
        id={id}
        name={name}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        items={items}
        dataEl={dataEl}
      />
    </DropdownWrapper>
  );
});

SalesManagerDropdown.displayName = 'SalesManagerDropdown';

SalesManagerDropdown.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  disabledItems: PropTypes.arrayOf(PropTypes.number),
  dataEl: PropTypes.string,
  showMapSales: PropTypes.bool,
};

SalesManagerDropdown.defaultProps = {
  dataEl: 'SalesManagerDropdown',
};

export { SalesManagerDropdown };
