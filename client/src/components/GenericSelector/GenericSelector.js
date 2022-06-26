import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'mdo-react-components';
import { getText } from 'utils/localesHelpers';
import { Container, GenericItem } from './styled';

// can transform either array of objects or object
const genericItems = (selection) => {
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

const GenericSelector = memo((props) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    selection,
    onChange,
    disabled,
    autoSelectOnNoValue,
    tableDropDownFontSize,
    items = null, // items will be label-value pairs (array or object). It will take presedence of selection (only values)
    error,
    helperText,
    dataEl = 'dropdownGenericSelector',
    width,
    required,
    selectFontSize,
  } = props;

  let usedValue = value;

  let selection2use = Array.isArray(selection) ? selection : null;

  if (!selection2use) {
    selection2use = (selection || '').split(',');
  }

  if (autoSelectOnNoValue && !value && selection2use.length > 0 && !items) {
    if (typeof onChange === 'function') {
      onChange(name || id, selection2use[0]);
    }
  }

  return (
    <Container>
      <GenericItem width={width}>
        <Dropdown
          label={label}
          value={usedValue}
          id={id}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          items={
            items
              ? genericItems(items)
              : selection2use.map((selector) => {
                  const localSelector = getText(`selectors.generic.${selector}`);
                  return {
                    label: localSelector === `selectors.generic.${selector}` ? selector : localSelector,
                    value: selector,
                  };
                })
          }
          disabled={disabled}
          tableDropDownFontSize={tableDropDownFontSize}
          error={error}
          helperText={helperText}
          dataEl={dataEl}
          required={required}
          selectFontSize={selectFontSize}
        />
      </GenericItem>
    </Container>
  );
});

GenericSelector.displayName = 'GenericSelector';

GenericSelector.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  selection: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  autoSelectOnNoValue: PropTypes.bool,
  items: PropTypes.oneOfType([
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.any,
      }),
    ),
  ]),
  tableDropDownFontSize: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
  selectFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { GenericSelector };
