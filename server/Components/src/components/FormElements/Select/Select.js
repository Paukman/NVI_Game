import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Select as MuiSelect } from '@material-ui/core';
import { FormHelperText } from '../FormHelperText';
import { Label } from '../Label';
import { Button } from '../Button';
import { createInputStandardAttrs, handleInputChange } from '../../../utils/formHelpers';
import { useStyles, LabelWrapper, Container } from './styled';
import { calcCssSize } from '../../../utils/propHelpers';

const Select = memo((props) => {
  const {
    items,
    value,
    labelText,
    variant,
    selectAllLabel,
    buttonVariant,
    errorMsg,
    canSelectAll,
    disabled,
    itemLabelName,
    itemValueName,
    multiple,
    native,
    height,
  } = props;

  const classes = useStyles({ props });
  const attrs = createInputStandardAttrs(props);
  const fnChange = handleInputChange(props);

  const handleChange = (event) => {
    const newValue = event.target.value;
    let updValue = [];

    if (!Array.isArray(value)) {
      fnChange({ target: { value: newValue } });
      return;
    }

    if (value.findIndex((item) => item == newValue) !== -1) {
      updValue = [...value.filter((item) => item != newValue)];
    } else {
      updValue = [...value, newValue];
    }

    fnChange({ target: { value: updValue } });
  };

  const handleClickSelectAll = () => {
    fnChange({ target: { value: items.map((item) => item[itemValueName]) } });
  };

  return (
    <Container>
      <LabelWrapper>
        {labelText && <Label label={labelText} />}
        {canSelectAll && multiple && (
          <Button text={selectAllLabel} variant={buttonVariant} onClick={handleClickSelectAll} />
        )}
      </LabelWrapper>
      <MuiSelect
        label={labelText}
        {...attrs}
        classes={classes}
        style={{ height: calcCssSize(height) }}
        disabled={disabled}
        multiple={multiple}
        native={native}
        value={value}
        variant={variant}
        onChange={handleChange}
      >
        {Array.isArray(items) &&
          items.map((item) => {
            return (
              <option key={item[itemValueName]} value={item[itemValueName]} disabled={item['disabled']}>
                {item[itemLabelName]}
              </option>
            );
          })}
      </MuiSelect>
      {errorMsg && <FormHelperText error>{errorMsg}</FormHelperText>}
    </Container>
  );
});

Select.displayName = 'Select';

Select.variants = ['standard', 'filled', 'outlined'];

Select.propTypes = {
  ...MuiSelect.propTypes,
  items: PropTypes.array,
  name: PropTypes.string,
  labelText: PropTypes.node,
  itemLabelName: PropTypes.string,
  itemValueName: PropTypes.string,
  canSelectAll: PropTypes.bool,
  selectAllLabel: PropTypes.string,
  disabled: PropTypes.bool,
  errorMsg: PropTypes.string,
  buttonVariant: PropTypes.string,
  id: PropTypes.string,
  multiple: PropTypes.bool,
  native: PropTypes.bool,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(Select.variants),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dataEl: PropTypes.string,
};

Select.defaultProps = {
  labelText: 'Select Properties',
  itemLabelName: 'label',
  itemValueName: 'value',
  canSelectAll: true,
  selectAllLabel: 'Select All',
  disabled: false,
  buttonVariant: 'tertiary',
  multiple: false,
  native: true,
  variant: Select.variants[0],
  height: 'auto',
};

export { Select };
