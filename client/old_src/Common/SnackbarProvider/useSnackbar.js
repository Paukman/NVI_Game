import { useState, useCallback } from "react";
import useIsMounted from "utils/hooks/useIsMounted";
/**
 * states
 * open: Boolean close or open the modal
 * message: Any - String or React component
 * className: String - css classes to custom style the Snackbar
 * onClose: Function - a callback function that can be passed by the client
 * autoHideDuration: Number - after this timeout the close function will be called
 * anchorOrigin: Object - where the component will be mounted
 */
const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    className: "",
    onClose: () => null,
    autoHideDuration: 5000,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left"
    }
  });
  const isMounted = useIsMounted();

  const openSnackbar = useCallback(
    ({
      message,
      className = "",
      onClose = () => null,
      autoHideDuration = 5000,
      anchorOrigin = {
        vertical: "bottom",
        horizontal: "left"
      }
    }) => {
      if (isMounted()) {
        setSnackbarState({
          open: true,
          message,
          className,
          onClose,
          autoHideDuration,
          anchorOrigin
        });
      }
    },
    [isMounted]
  );

  const close = (_, reason) => {
    if (isMounted() && reason === "timeout") {
      snackbarState.onClose();
      setSnackbarState(state => {
        return {
          ...state,
          open: false
        };
      });
    }
  };

  const manualClose = () => {
    if (isMounted()) {
      snackbarState.onClose();
      setSnackbarState(state => {
        return {
          ...state,
          open: false
        };
      });
    }
  };

  return {
    openSnackbar,
    close,
    manualClose,
    snackbarState
  };
};

export default useSnackbar;
