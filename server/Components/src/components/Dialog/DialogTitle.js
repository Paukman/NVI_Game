import React from 'react';
import PropTypes from 'prop-types';
import { DialogTitle as MaterialUiDialogTitle } from '@material-ui/core';
import { Icon } from '../Icon';

import { DialogCloseButton } from './DialogCloseButton';

import { useDialogTitleStyles, CloseIcon, DialogTitleText } from './styled';

const DialogTitle = (props) => {
  const { children, onClose, title } = props;
  const classes = useDialogTitleStyles();

  return (
    <MaterialUiDialogTitle disableTypography classes={classes}>
      <DialogTitleText>{children}</DialogTitleText>
      <DialogCloseButton onClick={onClose} title={title} />
    </MaterialUiDialogTitle>
  );
};

DialogTitle.displayName = 'DialogTitle';

DialogTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onClose: PropTypes.func,
  title: PropTypes.string,
};

DialogTitle.defaultProps = {
  title: 'Close',
};

export { DialogTitle };
