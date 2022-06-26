import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { Toast } from 'mdo-react-components';
import useShowToast from './useShowToast';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  ToastProvider.propTypes = {
    children: PropTypes.node,
  };
  const { showToast, closeToast, toastState } = useShowToast();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        severity={toastState.severity}
        message={toastState.message}
        variant={toastState.variant}
        elevation={toastState.elevation}
        vertical={toastState.vertical}
        horizontal={toastState.horizontal}
        open={toastState.open}
        onClose={closeToast}
        autoHideDuration={toastState.autoHideDuration}
      />
    </ToastContext.Provider>
  );
};
