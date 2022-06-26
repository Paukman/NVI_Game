import React, { memo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, SearchableDropdown } from 'mdo-react-components';
import { getText } from '../../../utils/localesHelpers';
import { DictionaryContext } from '../../../contexts';

const DictionaryDropdown = memo((props) => {
  const { listDictionary, dictionaryLoading, dictionaryTypesNames, dictionaryTypes, errors } = useContext(
    DictionaryContext,
  );
  const {
    dictionaryType,
    label,
    placeholder,
    value,
    id,
    name,
    alt,
    disabled,
    onChange,
    startWithItems,
    disableClearable,
    searchable,
    error,
    helperText,
    dataEl,
  } = props;

  const type = (dictionaryType || '').toLowerCase();
  const items = [];

  useEffect(() => {
    setTimeout(() => {
      if (!dictionaryLoading && dictionaryTypesNames.length === 0 && errors.length === 0) {
        listDictionary({});
      }
    }, 200);
  }, [listDictionary, dictionaryLoading, dictionaryTypesNames, errors]);

  if (dictionaryLoading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else if (errors.length > 0) {
    console.error(`The 'DictionaryDropdown' received the following errors from the server:`, errors);
  } else if (!dictionaryTypes[type]) {
    if (dictionaryTypesNames.length > 0) {
      console.error(
        `The '${dictionaryType}' is not supported by the 'DictionaryDropdown'. Supported values are:`,
        dictionaryTypesNames,
      );
    }
  } else {
    items.push(
      ...dictionaryTypes[type].map((item) => {
        return {
          label: item.displayName,
          value: item.value,
        };
      }),
    );
  }

  const items2use = Array.isArray(startWithItems) && startWithItems.length > 0 ? [...startWithItems, ...items] : items;

  return searchable ? (
    <SearchableDropdown
      label={label}
      value={value}
      id={id}
      name={name}
      alt={alt}
      disabled={disabled}
      onChange={onChange}
      itemName='label'
      valueName='value'
      items={items2use}
      disableClearable={disableClearable}
      error={error}
      helperText={helperText}
      dataEl={dataEl}
    />
  ) : (
    <Dropdown
      label={label}
      value={value}
      id={id}
      name={name}
      alt={alt}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      items={items2use}
      error={error}
      helperText={helperText}
      dataEl={dataEl}
    />
  );
});

DictionaryDropdown.displayName = 'DictionaryDropdown';

DictionaryDropdown.propTypes = {
  dictionaryType: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  alt: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  startWithItems: PropTypes.arrayOf(PropTypes.shape({})),
  disableClearable: PropTypes.bool,
  searchable: PropTypes.bool,
};

export { DictionaryDropdown };
