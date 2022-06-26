import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent as MaterialUiDialogContent } from '@material-ui/core';

import { useDialogContentStyles } from './styled';

const DialogContent = (props) => {
  const { children } = props;
  const classes = useDialogContentStyles();

  return (
    <MaterialUiDialogContent classes={classes} dividers={false}>
      {children}
    </MaterialUiDialogContent>
  );
};

DialogContent.displayName = 'DialogContent';

DialogContent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
};

export { DialogContent };
