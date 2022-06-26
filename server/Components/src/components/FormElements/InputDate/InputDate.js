import 'date-fns';
import React, { memo, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import theme from '../../../theme/theme';
import { colors } from '../../../theme/colors';
import { createInputStandardAttrs, handleInputChange } from '../../../utils/formHelpers';
import Icon from '@material-ui/core/Icon';
import EventIcon from '@material-ui/icons/Event';
import { getSizeInPx } from '../../../utils/propHelpers';

const InputDate = memo((props) => {
  const {
    value,
    dataEl,
    maxDate,
    minDate,
    autoClose,
    width,
    height,
    fontSize,
    fontWeight,
    fontColor,
    labelSize,
    labelWeight,
    labelColor,
    iconSize,
    iconPadding,
    ...rest
  } = props;
  const attrs = createInputStandardAttrs(props);

  let dateIconPadding = iconPadding;
  if (iconPadding === 0) {
    dateIconPadding = '0px';
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} theme={theme}>
      <KeyboardDatePicker
        {...rest}
        data-el={dataEl}
        margin='none'
        value={value}
        onChange={handleInputChange(props)}
        leftArrowButtonProps={{
          color: 'primary',
        }}
        rightArrowButtonProps={{
          color: 'primary',
        }}
        {...attrs}
        fullWidth
        maxDate={maxDate}
        minDate={minDate}
        autoOk={autoClose}
        InputProps={{
          style: {
            fontSize: getSizeInPx(fontSize) || '',
            fontWeight: fontWeight || 'normal',
            color: fontColor || '',
          },
        }}
        style={{ width: getSizeInPx(width) || '', height: getSizeInPx(height) || '' }}
        InputLabelProps={{
          style: {
            fontSize: getSizeInPx(labelSize) || '',
            fontWeight: labelWeight || 'normal',
            color: labelColor || colors.grey,
          },
        }}
        keyboardIcon={<EventIcon style={{ fontSize: getSizeInPx(iconSize) || '24px' }} />}
        KeyboardButtonProps={{
          style: {
            padding: getSizeInPx(dateIconPadding) || '12px',
          },
        }}
      />
    </MuiPickersUtilsProvider>
  );
});

InputDate.variants = ['dialog', 'inline', 'static'];

InputDate.displayName = 'InputDate';

InputDate.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(InputDate.variants),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  dataEl: PropTypes.string,
  autoClose: PropTypes.bool,
  width: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  fontWeight: PropTypes.string,
  fontColor: PropTypes.string,
  labelSize: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  labelWeight: PropTypes.string,
  labelColor: PropTypes.string,
  iconSize: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  iconPadding: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
};

InputDate.defaultProps = {
  format: 'MM/dd/yyyy',
  margin: 'normal',
  variant: 'inline',
  autoClose: true,
};

export { InputDate };
