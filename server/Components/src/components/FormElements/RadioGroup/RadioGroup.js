import React, { memo } from 'react';
import Radio from '@material-ui/core/Radio';
import { RadioGroup as MaterialUiRadioGroup } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';

import { createInputStandardAttrs, handleInputChange } from '../../../utils/formHelpers';

import { useStyles, RadioText } from './styled';

const RadioGroup = memo((props) => {
  const { isVertical, name, buttonsCfg, formLabel, defaultValue, disableRipple, dataEl, ...rest } = props;
  const classes = useStyles();
  const attrs = createInputStandardAttrs(props);

  return (
    <FormControl>
      <FormLabel>{formLabel}</FormLabel>
      <MaterialUiRadioGroup
        {...rest}
        row={!isVertical}
        name={name}
        defaultValue={defaultValue}
        onChange={handleInputChange(props)}
        {...attrs}
      >
        {buttonsCfg?.map((radioButton, index) => {
          return (
            <FormControlLabel
              key={index}
              value={radioButton.value}
              control={
                <Radio
                  data-el={`${dataEl || 'radiobutton'}-${radioButton.label}`}
                  disableRipple={disableRipple}
                  classes={{ root: classes.radio, checked: classes.checked }}
                />
              }
              label={<RadioText>{radioButton.label}</RadioText>}
            />
          );
        })}
      </MaterialUiRadioGroup>
    </FormControl>
  );
});

RadioGroup.displayName = 'RadioGroup';

RadioGroup.propTypes = {
  isVertical: PropTypes.bool,
  name: PropTypes.string,
  buttonsCfg: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  formLabel: PropTypes.string,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
  dataEl: PropTypes.string,
  disableRipple: PropTypes.bool,
};

RadioGroup.defaultProps = {
  isVertical: false,
};

export { RadioGroup };
