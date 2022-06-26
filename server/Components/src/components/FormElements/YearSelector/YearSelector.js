import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '../Dropdown/Dropdown';
import { createInputStandardAttrs } from '../../../utils/formHelpers';

const defaultYearsQty = 10;

const YearSelector = memo((props) => {
  const { years, yearsSince, yearsTo, disabled, onChange, maxHeight, ...rest } = props;
  const attrs = createInputStandardAttrs(props);
  const items = [];

  if (!Array.isArray(years) || years.length == 0) {
    var end = yearsTo == undefined ? new Date().getFullYear() : yearsTo;
    var start = yearsSince == undefined ? end - defaultYearsQty : yearsSince;
    while (start <= end) {
      items.push({ label: start, value: start });
      start += 1;
    }
  } else {
    years.forEach((year) => {
      items.push({ label: year, value: year });
    });
  }

  items.sort((a, b) => {
    return b.label - a.label;
  });

  return <Dropdown {...attrs} {...rest} onChange={onChange} items={items} disabled={disabled} maxHeight={maxHeight} />;
});

YearSelector.displayName = 'YearSelector';

YearSelector.propTypes = {
  ...Dropdown.prototype,
  yearsSince: PropTypes.number,
  yearsTo: PropTypes.number,
  years: PropTypes.array,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export { YearSelector };
