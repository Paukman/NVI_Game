import React from 'react';
import PropTypes from 'prop-types';
import { FormHelperText as MuiFormHelperText } from '@material-ui/core';

const FormHelperText = (props) => {
  return <MuiFormHelperText {...props} />;
};

FormHelperText.displayName = 'FormHelperText';

FormHelperText.variants = ['filled', 'outlined', 'standard'];

FormHelperText.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.any,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  filled: PropTypes.bool,
  focused: PropTypes.bool,
  margin: PropTypes.string,
  required: PropTypes.bool,
  variant: PropTypes.oneOf(FormHelperText.variants),
  component: PropTypes.elementType,
};

export { FormHelperText };
