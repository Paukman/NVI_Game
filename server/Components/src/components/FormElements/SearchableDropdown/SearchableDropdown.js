import React, { memo, useMemo, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import { useStyles, StyledLink, StyledLabel } from './styled';
import Progress from '../../Progresses/Progress';
import { handleInputChange, createInputStandardAttrs } from '../../../utils/formHelpers';
import { mapArrayBy } from '../../../utils/formatters';
import { LinkActions } from '../../LinkActions';
import { localization } from '../../../locales/en';
import { getSizeInPx } from '../../../utils/propHelpers';
import SearchIcon from '@material-ui/icons/Search';

const SearchableDropdown = memo((props) => {
  const {
    label,
    items,
    itemName,
    onChange,
    inProgress,
    disabled,
    value,
    valueName,
    useSimpleValue,
    id,
    name,
    disableClearable,
    required,
    error,
    helperText,
    tableDropDownFontSize,
    canLoadMore,
    onLoadMore,
    page,
    pageSize,
    onSearch,
    timeOfTyping,
    setSearchIcon,
  } = props;

  // adding possibility for actual font size while keeping bool for
  // exisiting hardcoded approach (true:12px, false:16px)
  let dropdownFontSize = '16px'; // default
  if (typeof tableDropDownFontSize === 'boolean') {
    dropdownFontSize = tableDropDownFontSize ? '12px' : '16px'; // keep exisiting functionality
  } else {
    dropdownFontSize = getSizeInPx(tableDropDownFontSize) || '16px';
  }

  const attrs = createInputStandardAttrs(props);
  const classes = useStyles({ ...props, dropdownFontSize });
  const [open, setOpen] = useState(false);
  const [type, setType] = useState({ name: '', typing: false, typingTimeout: 0 });

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

  if (!foundItem && value != null && !pageSize) {
    items2use = [
      {
        [itemName]: `${value}`,
        [valueName]: value,
        disabled: true,
      },
      ...items,
    ];
  }

  const itemsMap = useMemo(() => {
    return mapArrayBy(items2use, valueName);
  }, [items2use, valueName]);

  const formHelperText = helperText || null;

  return (
    <Autocomplete
      onInputChange={(event, newInputValue, reason) => {
        if (type?.typingTimeout) {
          clearTimeout(type?.typingTimeout);
        }
        if (typeof onSearch === 'function') {
          setType({
            ...type,
            name: event?.target?.value,
            typing: false,
            typingTimeout: setTimeout(function () {
              onSearch(event?.target?.value, event);
            }, timeOfTyping),
          });
        }

        if (reason === 'clear') {
          handleInputChange(props)({ target: { value: (name || id, '') } });
        }
      }}
      onChange={(event, value) => {
        if (typeof onChange === 'function') {
          handleInputChange(props)({ target: { value: useSimpleValue && value ? value[valueName] : value } });
        }
      }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      options={items2use}
      getOptionLabel={(option) => {
        return useSimpleValue && itemsMap[option] ? itemsMap[option][itemName] : option[itemName] || '';
      }}
      getOptionSelected={(option, testValue) => {
        return useSimpleValue ? option[valueName] === testValue : option === testValue;
      }}
      filterOptions={
        pageSize
          ? (options) => {
              let result = [];

              result = [...options];
              if (result.length !== 0 && canLoadMore && result.length % pageSize === 0) {
                result.push({
                  label: (
                    <StyledLink>
                      <LinkActions
                        hasFont
                        items={[
                          {
                            text: localization?.loadMore || 'Load more...',
                            color: 'blue',
                            textDecoration: 'normal',
                          },
                        ]}
                        onClick={(value, e) => {
                          if (typeof onLoadMore === 'function') {
                            e.stopPropagation();
                            setOpen(true);
                            onLoadMore(page + 1);
                          }
                        }}
                      />
                    </StyledLink>
                  ),
                });
              }
              if (result.length === 0)
                result.push({ label: <StyledLabel>{`${localization?.noOption || 'No option'}`}</StyledLabel> });
              return result;
            }
          : undefined
      }
      getOptionDisabled={!pageSize ? (option) => itemsMap[option[valueName]].disabled === true : undefined}
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
          InputProps={{
            ...params.InputProps,
            style: { fontSize: 'inherit' },
            startAdornment: setSearchIcon && <SearchIcon />,
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

SearchableDropdown.displayName = 'SearchableDropdown';

SearchableDropdown.propTypes = {
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
  useSimpleValue: PropTypes.bool,
  disableClearable: PropTypes.bool,
  setSearchIcon: PropTypes.bool,
  required: PropTypes.bool,
  helperText: PropTypes.string,
  onLoadMore: PropTypes.func,
  onSearch: PropTypes.func,
  page: PropTypes.number,
  pageSize: PropTypes.number,
  localization: PropTypes.any,
  canLoadMore: PropTypes.bool,
  timeOfTyping: PropTypes.number,
  tableDropDownFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
};

SearchableDropdown.defaultProps = {
  itemName: 'label',
  valueName: 'value',
  useSimpleValue: true,
  error: false,
  inProgress: false,
  disabled: false,
  open: false,
};

export { SearchableDropdown };
