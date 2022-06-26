import React, { memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { PmsTypeContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';

const PmsTypeSelector = memo((props) => {
  const { pmsTypes, loadingList } = useContext(PmsTypeContext);
  const {
    label,
    placeholder,
    value,
    id,
    name,
    disabled,
    onChange,
    excludeItems,
    dataEl,
    tableDropDownFontSize,
  } = props;

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

      if (Array.isArray(excludeItems)) {
        excludeItems.forEach((item) => toExcludeMap.add(item));
      }

      newItems.push(
        ...pmsTypes
          .filter((pmsType) => !toExcludeMap.has(pmsType.id) || pmsType.id === value)
          .map((pmsType) => {
            return {
              label: pmsType.pmsTypeName,
              value: pmsType.id,
              disabled: toExcludeMap.has(pmsType.id),
            };
          }),
      );
    }
    return newItems;
  }, [pmsTypes, value]);

  return (
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
      tableDropDownFontSize={tableDropDownFontSize}
    />
  );
});

PmsTypeSelector.displayName = 'PmsTypeSelector';

PmsTypeSelector.allowed = [3, 4, 5, 6, 7, 8, 9, 10];
PmsTypeSelector.notAllowedWithAll = [1, 2, 100, 101, 102];
PmsTypeSelector.notAllowed = [100, 101, 102];

PmsTypeSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  excludeItems: PropTypes.arrayOf(PropTypes.number),
  dataEl: PropTypes.string,
  tableDropDownFontSize: PropTypes.bool,
};

PmsTypeSelector.defaultProps = {
  dataEl: 'selectorPmsType',
};

export { PmsTypeSelector };
