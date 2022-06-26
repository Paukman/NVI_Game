import { useCallback, useState } from 'react';
import useIsMounted from '../../hooks/useIsMounted';

const useShowToast = () => {
  const [toastState, setToastState] = useState({
    variant: 'filled',
    elevation: 6,
    vertical: 'top',
    horizontal: 'center',
    autoHideDuration: 4000,
    // can use success, info, warning, error
    severity: 'success',
    message: '',
    onClose: () => null,
    open: false,
  });

  const isMounted = useIsMounted();

  const showToast = useCallback(
    ({
      variant = 'filled',
      elevation = 6,
      vertical = 'top',
      horizontal = 'center',
      autoHideDuration = 4000,
      severity = 'success',
      message = null,
      onClose = () => null,
    }) => {
      if (isMounted()) {
        setToastState({
          open: true,
          variant,
          elevation,
          vertical,
          horizontal,
          autoHideDuration,
          severity,
          message,
          onClose,
        });
      }
    },
    [isMounted],
  );

  const closeToast = (_, reason) => {
    if (isMounted()) {
      toastState.onClose();
      setToastState((state) => {
        return {
          ...state,
          open: false,
        };
      });
    }
  };

  return { showToast, closeToast, toastState };
};

export default useShowToast;
