import React, { memo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Switch as MaterialSwitch } from '@material-ui/core/';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useStyles } from './styled';
import { handleInputChange, createInputStandardAttrs } from '../../../utils/formHelpers';

const Switch = memo(
  forwardRef((props, ref) => {
    const { disabled, name, value, dataEl, label, labelPlacement, size = 'small' } = props;
    const classes = useStyles(props);
    const attrs = createInputStandardAttrs(props);

    return (
      <FormControlLabel
        control={
          <MaterialSwitch
            {...attrs}
            classes={classes}
            name={name}
            checked={value}
            disabled={disabled}
            onChange={handleInputChange(props)}
            data-el={dataEl ?? 'switch'}
            inputRef={ref}
            size={size}
          />
        }
        label={label}
        classes={classes}
        labelPlacement={labelPlacement}
        data-el={dataEl ? `label${dataEl}` : 'labelSwitch'}
      />
    );
  }),
);

Switch.displayName = 'Switch';
Switch.labelPlacements = ['bottom', 'end', 'start', 'top'];

Switch.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  dataEl: PropTypes.string,
  label: PropTypes.string,
  labelPlacement: PropTypes.oneOf(Switch.labelPlacements),
  size: PropTypes.oneOf(['small', 'medium']),
};

Switch.defaultProps = {
  disabled: false,
};

export { Switch };
