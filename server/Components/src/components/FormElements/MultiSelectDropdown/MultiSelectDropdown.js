import React, { memo, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import { useStyles } from './styled';
import Progress from '../../Progresses/Progress';
import { createInputStandardAttrs } from '../../../utils/formHelpers';
import { getSizeInPx } from '../../../utils/propHelpers';

const MultiSelectDropdown = memo((props) => {
  const {
    label,
    items,
    itemName,
    onChange,
    inProgress,
    disabled,
    value,
    valueName,
    id,
    name,
    disableClearable,
    required,
    error,
    helperText,
    placeholder,
    isOutlined,
    tableDropDownFontSize,
  } = props;

  const dropdownFontSize = getSizeInPx(tableDropDownFontSize) || '14px';
  const classes = useStyles({ ...props, dropdownFontSize });
  const attrs = createInputStandardAttrs(props);
  let items2use = items;

  if (!Array.isArray(items)) {
    console.error(`The 'SearchableDropdown' component expects the 'items' prop to be an array but got `, items);
    items2use = [];
  }

  let foundItem = false;

  for (let idx = 0, len = items2use.length; idx < len; ++idx) {
    if (value == items2use[idx][valueName]) {
      foundItem = true;
      break;
    }
  }

  if (!foundItem && value != null) {
    items2use = [
      {
        [itemName]: `${value}`,
        [valueName]: value,
        disabled: true,
      },
      ...items,
    ];
  }

  const fixedOptions = [];
  const [newValue, setValue] = useState(value);
  const formHelperText = helperText || null;

  return (
    <Autocomplete
      multiple
      id={id || 'multi-select-dropdown'}
      value={newValue || value}
      onChange={(event, newValue) => {
        setValue([...fixedOptions, ...newValue.filter((option) => fixedOptions.indexOf(option) === -1)]);
        onChange(name || id, newValue, event);
      }}
      required={required}
      name={name}
      className={classes.root}
      options={items}
      getOptionLabel={(option) => option.label}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            key={index}
            label={option.label}
            {...getTagProps({ index })}
            disabled={fixedOptions.indexOf(option) !== -1}
          />
        ))
      }
      classes={classes}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={formHelperText}
          label={label}
          required={required}
          name={name}
          className={classes.root}
          classes={classes}
          variant={isOutlined ? 'outlined' : 'standard'}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            style: { fontSize: 'inherit' },
            endAdornment: (
              <>
                {inProgress ? <Progress type='circularProgress' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      disableClearable={disableClearable}
      {...attrs}
    />
  );
});

MultiSelectDropdown.displayName = 'MultiSelectDropdown';

MultiSelectDropdown.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  itemName: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.bool,
  inProgress: PropTypes.bool,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  value: PropTypes.any,
  valueName: PropTypes.string,
  disableClearable: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  onLoadMore: PropTypes.func,
  onSearch: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  localization: PropTypes.any,
  canLoadMore: PropTypes.bool,
  tableDropDownFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  isOutlined: PropTypes.bool,
  placeholder: PropTypes.string,
  tableDropDownFontSize: PropTypes.number,
};

MultiSelectDropdown.defaultProps = {
  itemName: 'label',
  valueName: 'value',
  error: false,
  inProgress: false,
  disabled: false,
  open: false,
  isOutlined: false,
  placeholder: '',
};

export { MultiSelectDropdown };
