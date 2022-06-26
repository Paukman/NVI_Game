import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MuiAlert from '@material-ui/lab/Alert';

const ToastAlert = memo((props) => {
  const { severity, variant, elevation } = props;
  return <MuiAlert severity={severity} variant={variant} elevation={elevation} {...props} />;
});

ToastAlert.displayName = 'ToastAlert';

ToastAlert.severities = ['success', 'info', 'warning', 'error'];

ToastAlert.variants = ['filled', 'outlined'];

ToastAlert.propTypes = {
  severity: PropTypes.oneOf(ToastAlert.severities),
  variant: PropTypes.oneOf(ToastAlert.variants),
  elevation: PropTypes.number,
};

export { ToastAlert };
