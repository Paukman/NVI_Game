import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '../Snackbar';
import { ToastAlert } from '../ToastAlert';

const Toast = memo((props) => {
  const { severity, message, variant, elevation, vertical, horizontal, open, onClose, autoHideDuration } = props;
  return (
    <div>
      <Snackbar
        vertical={vertical}
        horizontal={horizontal}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
      >
        <ToastAlert onClose={onClose} severity={severity} variant={variant} elevation={elevation}>
          {message}
        </ToastAlert>
      </Snackbar>
    </div>
  );
});

Toast.displayName = 'Toast';

Toast.severities = ToastAlert.severities;

Toast.variants = ToastAlert.variants;

Toast.verticals = Snackbar.verticals;

Toast.horizontals = Snackbar.horizontals;

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(Toast.severities),
  variant: PropTypes.oneOf(Toast.variants),
  elevation: PropTypes.number,
  vertical: PropTypes.oneOf(Toast.verticals),
  horizontal: PropTypes.oneOf(Toast.horizontals),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number,
};

Toast.defaultProps = {
  variant: 'filled',
  elevation: 6,
  vertical: 'bottom',
  horizontal: 'center',
  autoHideDuration: 4000,
};

export { Toast };
