import React, { forwardRef } from 'react';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { handleInputChange, isNumberKey } from '../../../utils/formHelpers';
import useStyles from './styled';
import { colors } from '../../../theme/colors';

const InputField = forwardRef((props, ref) => {
  const { dataEl, inputProps, type, InputProps, maxNoOfChars, onEnter = () => {}, ...rest } = props;
  const classes = useStyles(props);
  const type2use = type === 'number' ? 'text' : type;

  const inputPropsToUpdate = maxNoOfChars > 0 ? { ...inputProps, maxlength: maxNoOfChars } : inputProps;
  return (
    <TextField
      {...rest}
      type={type2use}
      inputProps={{
        classes: classes.notchedOutine,
        ...inputPropsToUpdate,
      }}
      onChange={handleInputChange(props)}
      onKeyDown={(event) => {
        if (type === 'number' && !isNumberKey(event)) {
          event.preventDefault();
        }
      }}
      className={classes.root}
      data-el={dataEl}
      inputRef={ref}
      InputProps={{
        className: classes.root,
        ...InputProps,
      }}
      helperText={maxNoOfChars > 0 ? `${props.value?.length}/${maxNoOfChars}` : props.helperText}
      onKeyPress={(data) => {
        if (data.key === 'Enter') {
          onEnter();
        }
      }}
    />
  );
});

InputField.variants = ['standard', 'outlined', 'filled'];

InputField.displayName = 'InputField';

InputField.types = [
  'text',
  'password',
  'button',
  'checkbox',
  'color',
  'date',
  'datetime-local',
  'email',
  'file',
  'hidden',
  'image',
  'month',
  'number',
  'radio',
  'range',
  'reset',
  'search',
  'submit',
  'tel',
  'time',
  'url',
  'week',
];

InputField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(InputField.types),
  variant: PropTypes.oneOf(InputField.variants),
  onChange: PropTypes.func,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  multiline: PropTypes.bool,
  title: PropTypes.string,
  dataEl: PropTypes.string,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  labelColor: PropTypes.string,
  fontSizeLabel: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxNoOfChars: PropTypes.number,
  value: PropTypes.any,
  onEnter: PropTypes.func,
};

InputField.defaultProps = {
  variant: 'standard',
};

export { InputField };
