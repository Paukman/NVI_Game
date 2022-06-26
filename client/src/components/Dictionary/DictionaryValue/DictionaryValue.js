import React, { memo, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getText } from '../../../utils/localesHelpers';
import { DictionaryContext } from '../../../contexts';

const DictionaryValue = memo((props) => {
  const { listDictionary, dictionaryLoading, dictionaryTypesNames, dictionaryTypes, errors } = useContext(
    DictionaryContext,
  );

  const { value, dictionaryType } = props;

  const type = (dictionaryType || '').toLowerCase();
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    setTimeout(() => {
      let strValue = '';
      if (dictionaryLoading) {
        strValue = getText('generic.loading');
      } else if (errors.length > 0) {
        strValue = getText('generic.loadingError');
        console.error(`The 'DictionaryDropdown' received the following errors from the server:`, errors);
      } else if (!dictionaryTypes[type]) {
        if (dictionaryTypesNames.length > 0) {
          strValue = getText('dictionary.invalidType');
          console.error(
            `The '${type}' is not supported by the 'DictionaryDropdown'. Supported values are:`,
            dictionaryTypesNames,
          );
        }
      } else {
        const item = dictionaryTypes[type].find((item) => item.value == value);
        strValue = item?.displayName ?? value;
      }
      setDisplayName(strValue);
    }, 200);
  }, [listDictionary, dictionaryLoading, dictionaryTypesNames, errors, dictionaryTypes, type, value, setDisplayName]);

  return <span>{displayName}</span>;
});

DictionaryValue.displayName = 'DictionaryValue';

DictionaryValue.propTypes = {
  dictionaryType: PropTypes.string,
  value: PropTypes.string,
};

export { DictionaryValue };
