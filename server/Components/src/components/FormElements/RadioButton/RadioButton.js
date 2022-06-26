import React, { memo } from 'react';
import clsx from 'clsx';
import { Radio as MaterialUiRadio } from '@material-ui/core';
import { createInputStandardAttrs, handleInputChange } from '../../../utils/formHelpers';
import PropTypes from 'prop-types';

import { useStyles } from './styled';

const RadioButton = memo((props) => {
  const { value, checked, disabled } = props;
  const classes = useStyles();
  const attrs = createInputStandardAttrs(props);

  return (
    <MaterialUiRadio
      className={classes.root}
      disableRipple
      color='default'
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      onChange={handleInputChange(props)}
      value={value}
      checked={checked}
      disabled={disabled}
      {...attrs}
    />
  );
});

RadioButton.displayName = 'RadioButton';

RadioButton.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

export { RadioButton };
