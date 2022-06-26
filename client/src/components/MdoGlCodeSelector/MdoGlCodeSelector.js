import React, { memo, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown, arrayToMap } from 'mdo-react-components';
import { MdoGlCodeContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';

const MdoGlCodeSelector = memo((props) => {
  const { mdoGlCodes, mdoGlCodeNamesWithDepartments, lowestMdoGlCodes, loading, listMdoGlCodes } =
    useContext(MdoGlCodeContext);
  const {
    label,
    placeholder,
    value,
    id,
    name,
    onChange,
    skipAllParents,
    disabledItems,
    errorMsg,
    selectNone,
    disabled,
    tableDropDownFontSize,
    required,
  } = props;
  const needToLoad = mdoGlCodes.length === 0 && !loading;

  useEffect(() => {
    if (needToLoad) {
      listMdoGlCodes({});
    }
  }, [listMdoGlCodes]); // eslint-disable-line

  const items = useMemo(() => {
    const newItems = [];
    if (loading) {
      newItems.push({
        label: getText('generic.loading'),
        value: '',
        disabled: true,
      });
    } else {
      let disabledMap = {};
      let processItems = skipAllParents ? lowestMdoGlCodes : mdoGlCodes;

      if (Array.isArray(disabledItems)) {
        disabledMap = arrayToMap(disabledItems);
      }

      if (selectNone) {
        newItems.push({
          label: getText('selectors.mdoGlCode.noSelection'),
        });
      }
      newItems.push(
        ...processItems.map((mdoGlCode) => {
          return {
            label: mdoGlCodeNamesWithDepartments[mdoGlCode.id] || mdoGlCode.id,
            value: mdoGlCode.id,
            disabled: mdoGlCode.id === 'NOTFOUND' ? false : disabledMap[mdoGlCode.id] !== undefined,
          };
        }),
      );
    }
    return newItems.sort((a, b) => (b.value === 'NOTFOUND') - (a.value === 'NOTFOUND'));
  }, [mdoGlCodes, mdoGlCodeNamesWithDepartments, loading, disabledItems, lowestMdoGlCodes, selectNone, skipAllParents]);

  return loading ? null : (
    <SearchableDropdown
      key={`${id || name}-${value}`}
      value={value || ''}
      id={id}
      name={name}
      disabled={disabled}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      itemName='label'
      items={items}
      error={!!errorMsg}
      helperText={errorMsg}
      tableDropDownFontSize={tableDropDownFontSize}
      required={required}
    />
  );
});

MdoGlCodeSelector.displayName = 'MdoGlCodeSelector';

MdoGlCodeSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  skipAllParents: PropTypes.bool,
  disabledItems: PropTypes.arrayOf(PropTypes.string),
  errorMsg: PropTypes.string,
  selectNone: PropTypes.bool,
  tableDropDownFontSize: PropTypes.bool,
  required: PropTypes.bool,
};

MdoGlCodeSelector.defaultProps = {
  disabledItems: [''],
  selectNone: false,
};

export { MdoGlCodeSelector };
