import React, { createContext } from "react";
import PropTypes from "prop-types";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import useSnackbar from "./useSnackbar";

export const SnackbarContext = createContext();

const SnackbarProvider = props => {
  const { openSnackbar, close, manualClose, snackbarState } = useSnackbar();
  SnackbarProvider.propTypes = {
    children: PropTypes.element.isRequired
  };
  const { children } = props;
  return (
    <SnackbarContext.Provider value={{ openSnackbar, manualClose }}>
      {children}
      <Snackbar
        className={`${snackbarState.className}`}
        anchorOrigin={snackbarState.anchorOrigin}
        open={snackbarState.open}
        onClose={close}
        TransitionComponent={Slide}
        message={snackbarState.message}
        autoHideDuration={snackbarState.autoHideDuration}
      />
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
