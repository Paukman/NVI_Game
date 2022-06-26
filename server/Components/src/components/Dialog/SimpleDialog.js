import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { DialogCard } from './DialogCard';
//import { DialogTitle } from './DialogTitle';
//import { DialogContent } from './DialogContent';
//import { DialogActions } from './DialogActions';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useSimpleDialogContentStyles } from './styled';

const SimpleDialog = memo((props) => {
  const { children, actions, title, ...rest } = props;

  const classes = useSimpleDialogContentStyles();

  return (
    <DialogCard {...rest}>
      <DialogContent classes={classes}>{children}</DialogContent>
    </DialogCard>
  );
});

SimpleDialog.displayName = 'Dialog';

SimpleDialog.propTypes = {
  ...DialogCard.propTypes,
  title: PropTypes.string,
};

export { SimpleDialog };
