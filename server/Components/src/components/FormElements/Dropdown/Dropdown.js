import React, { memo } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
//import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import { MenuItem } from '../../Menu';
import { useFormControlStyles, useInputLabelStyles, useSelectStyles } from './styled';
import { handleInputChange, createInputStandardAttrs } from '../../../utils/formHelpers';
import { colors } from '../../../theme/colors';
import { getSizeInPx } from '../../../utils/propHelpers';

const Dropdown = memo((props) => {
  const {
    label,
    value,
    items,
    disabled,
    title,
    helperText,
    error,
    placeholder,
    tableDropDownFontSize,
    selectFontSize, //if you don't want to inherit fontSize
  } = props;

  // adding possibility for actual font size while keeping bool for
  // exisiting hardcoded approach (true:12px, false:16px)
  let dropdownFontSize = '16px'; // default
  let selectedFontSize = 'inherit';
  if (tableDropDownFontSize && typeof tableDropDownFontSize === 'boolean') {
    dropdownFontSize = tableDropDownFontSize ? '12px' : '16px'; // keep exisiting functionality
  } else if (tableDropDownFontSize) {
    dropdownFontSize = getSizeInPx(tableDropDownFontSize) || '16px';
  }

  if (tableDropDownFontSize) {
    selectedFontSize = dropdownFontSize;
  } else if (!tableDropDownFontSize && selectFontSize) {
    selectedFontSize = getSizeInPx(selectFontSize);
  }

  const attrs = createInputStandardAttrs(props);
  const formControlClasses = useFormControlStyles({ selectedFontSize });
  const inputLabelClasses = useInputLabelStyles({ selectedFontSize });
  const { menuPaper, ...forClassesProp } = useSelectStyles({ maxHeight: props, selectedFontSize });

  let items2use = items;

  if (!Array.isArray(items)) {
    console.error(`The 'Dropdown' component expects the 'items' prop to be an array but got `, items);
    items2use = [];
  }

  let foundItem = false;
  for (let idx = 0, len = items2use.length; idx < len; ++idx) {
    if (value == items2use[idx].value) {
      foundItem = true;
      break;
    }
  }

  if (!foundItem) {
    items2use = [
      {
        label: value ?? placeholder,
        value: value ?? placeholder,
        disabled: true,
      },
      ...items,
    ];
  }

  const formHelperText = helperText || null;

  return (
    <FormControl classes={formControlClasses} fullWidth>
      {label && <InputLabel classes={inputLabelClasses}>{label}</InputLabel>}
      <Select
        {...attrs}
        value={value ?? placeholder}
        onChange={handleInputChange(props)}
        label={label}
        disabled={disabled}
        title={title}
        classes={forClassesProp}
        MenuProps={{ classes: { paper: menuPaper } }}
      >
        {Array.isArray(items) &&
          items2use.map((item) => {
            const { value, label, disabled } = item;
            return (
              <MenuItem key={value} value={value} disabled={disabled} dropdownFontSize={dropdownFontSize}>
                {label}
              </MenuItem>
            );
          })}
      </Select>
      <FormHelperText style={{ color: error ? colors.validationErrorColor : '' }}>{formHelperText}</FormHelperText>
    </FormControl>
  );
});

Dropdown.displayName = 'Dropdown';

Dropdown.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disbaled: PropTypes.bool,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  id: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  placeholder: PropTypes.string,
  tableDropDownFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  selectFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { Dropdown };
