import React from 'react';
import PropTypes from 'prop-types';
import { DialogActions as MaterialUiDialogActions } from '@material-ui/core';

import { useDialogActionsStyles } from './styled';

const DialogActions = (props) => {
  const { children } = props;
  const classes = useDialogActionsStyles();

  return <MaterialUiDialogActions classes={classes}>{children}</MaterialUiDialogActions>;
};

DialogActions.displayName = 'DialogActions';

DialogActions.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export { DialogActions };
