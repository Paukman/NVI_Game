import React, { memo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ButtonDropdown } from 'mdo-react-components';
import { getText } from '../../../utils/localesHelpers';
import { DictionaryContext } from '../../../contexts';

const DictionaryButtonDropdown = memo((props) => {
  const { listDictionary, dictionaryLoading, dictionaryTypesNames, dictionaryTypes, errors } = useContext(
    DictionaryContext,
  );
  const { dictionaryType, startWithItems, ...rest } = props;

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
    console.error(`The 'DictionaryButtonDropdown' received the following errors from the server:`, errors);
  } else if (!dictionaryTypes[type]) {
    if (dictionaryTypesNames.length > 0) {
      console.error(
        `The '${dictionaryType}' is not supported by the 'DictionaryButtonDropdown'. Supported values are:`,
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

  return <ButtonDropdown {...rest} items={items2use} />;
});

DictionaryButtonDropdown.displayName = 'DictionaryButtonDropdown';

DictionaryButtonDropdown.propTypes = {
  dictionaryType: PropTypes.string,
  startWithItems: PropTypes.arrayOf(PropTypes.shape({})),
  ...ButtonDropdown.propTypes,
};

export { DictionaryButtonDropdown };
