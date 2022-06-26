import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Snackbar as SnackbarMaterialUi } from '@material-ui/core';
import { useStyles } from './styled';

const Snackbar = memo((props) => {
  const classes = useStyles();
  const { vertical, horizontal, open, onClose, autoHideDuration, children } = props;

  return (
    <div className={classes.root}>
      <SnackbarMaterialUi
        anchorOrigin={{
          vertical: vertical,
          horizontal: horizontal,
        }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
      >
        {children}
      </SnackbarMaterialUi>
    </div>
  );
});

Snackbar.displayName = 'Snackbar';

Snackbar.verticals = ['top', 'bottom'];

Snackbar.horizontals = ['center', 'left', 'right'];

Snackbar.propTypes = {
  vertical: PropTypes.oneOf(Snackbar.verticals),
  horizontal: PropTypes.oneOf(Snackbar.horizontals),
  autoHideDuration: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.node,
};

export { Snackbar };
