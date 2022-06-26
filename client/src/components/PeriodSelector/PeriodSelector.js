import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';

// can transform either array of objects or object
const periodItems = (selection) => {
  if (Array.isArray(selection)) {
    return selection;
  }
  const items = [];
  for (const [key, keyValuePair] of Object.entries(selection)) {
    items.push({
      label: keyValuePair.label,
      value: keyValuePair.value,
    });
  }
  return items;
};

const PeriodSelector = memo((props) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    periods,
    onChange,
    disabled,
    autoSelectOnNoValue,
    items = null, // items will be label-value pairs. It will take presedence of periods (only values)
    dataEl,
    selectFontSize,
  } = props;

  let periods2use = Array.isArray(periods) ? periods : null;

  if (!periods2use) {
    periods2use = (periods || '').split(',');
  }

  if (autoSelectOnNoValue && !value && periods2use.length > 0 && !items) {
    if (typeof onChange === 'function') {
      onChange(name || id, periods2use[0]);
    }
  }

  return (
    <Dropdown
      label={label}
      value={value}
      id={id}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      items={
        items
          ? periodItems(items)
          : periods2use.map((period) => {
              return {
                label: getText(`selectors.periods.${period}`),
                value: period,
              };
            })
      }
      disabled={disabled}
      dataEl={dataEl ?? 'dropdownPeriodSelector'}
      selectFontSize={selectFontSize}
    />
  );
});

PeriodSelector.displayName = 'PeriodSelector';

PeriodSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  periods: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  autoSelectOnNoValue: PropTypes.bool,
  dataEl: PropTypes.string,
};

export { PeriodSelector };
