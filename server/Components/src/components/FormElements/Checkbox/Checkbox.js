import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Checkbox as MaterialUiCheckbox } from '@material-ui/core';
import useStyles from './styled';
import { handleInputChange } from '../../../utils/formHelpers';
import { Label } from '../Label/Label';
import { SyncDisabled } from '@material-ui/icons';

const Checkbox = (props) => {
  const classes = useStyles(props);
  const { label, toTheRight, checkedColor, checkboxSize, withRightMargin, disabled, ...rest } = props;
  const checkbox = (
    <MaterialUiCheckbox
      {...rest}
      className={classes.root}
      disableRipple
      color='default'
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      onChange={handleInputChange(props)}
      disabled={disabled}
    />
  );

  return (
    <Fragment>
      {label && (
        <Label label={label} toTheRight={toTheRight}>
          {checkbox}
        </Label>
      )}
      {!label && checkbox}
    </Fragment>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string,
  toTheRight: PropTypes.bool,
  checkedColor: PropTypes.string,
  checkboxSize: PropTypes.string,
  withRightMargin: PropTypes.bool,
  disabled: PropTypes.bool,
  disableRipple: PropTypes.bool,
};

export { Checkbox };
