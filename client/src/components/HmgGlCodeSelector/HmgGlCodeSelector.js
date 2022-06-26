import React, { memo, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SearchableDropdown } from 'mdo-react-components';
import { HmgGlCodeContext } from '../../contexts';
import { getText } from '../../utils/localesHelpers';

const HmgGlCodeSelector = memo((props) => {
  const { listHmgGlCodes, hmgGlCodes, loading } = useContext(HmgGlCodeContext);
  const {
    label,
    placeholder,
    value,
    id,
    name,
    onChange,
    required,
    hotelId,
    hideDescription,
    disabled,
    tableDropDownFontSize,
    dataEl,
    ...rest
  } = props;

  useEffect(() => {
    setTimeout(() => {
      if (hmgGlCodes.length === 0 && !loading) {
        listHmgGlCodes({
          params: {
            hotelId,
          },
        });
      }
    }, 200);
  }, []);

  const items = [];

  if (loading) {
    items.push({
      label: getText('generic.loading'),
      value: '',
      disabled: true,
    });
  } else {
    if (!required) {
      items.push({
        label: getText('selectors.hmgGlCode.noSelection'),
        value: '',
      });
    }

    let hasValue = false;

    for (let idx = 0; idx < hmgGlCodes.length; idx++) {
      if (hmgGlCodes[idx].hmgGlCode === value) {
        hasValue = true;
        break;
      }
    }

    if (!hasValue) {
      items.push({
        label: value,
        value: value,
        disabled: true,
      });
    }

    items.push(
      ...hmgGlCodes.map((hmgGlCode) => {
        return {
          label: hideDescription ? hmgGlCode.hmgGlCode : `${hmgGlCode.hmgGlCode} - ${hmgGlCode.displayName}`,
          value: hmgGlCode.hmgGlCode,
        };
      }),
    );
  }

  return (
    <SearchableDropdown
      value={value}
      id={id}
      name={name}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      itemName='label'
      valueName='value'
      items={items.filter(
        (element, index, array) =>
          index === array.findIndex((value) => value.label === element.label && value.value === element.value),
      )}
      disabled={disabled}
      tableDropDownFontSize={tableDropDownFontSize}
      dataEl={dataEl ?? 'searchableDropdownHmgGlCodeSelector'}
      {...rest}
    />
  );
});

HmgGlCodeSelector.displayName = 'HmgGlCodeSelector';

HmgGlCodeSelector.propTypes = {
  hotelId: PropTypes.number,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  hideDescription: PropTypes.bool,
  disabled: PropTypes.bool,
  tableDropDownFontSize: PropTypes.bool,
  dataEl: PropTypes.string,
};

export { HmgGlCodeSelector };
