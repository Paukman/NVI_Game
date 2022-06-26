import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Modal as MaterialModal } from '@material-ui/core/';
import Backdrop from '@material-ui/core/Backdrop';

import { useStyles } from './styled';

const Modal = memo((props) => {
  const classes = useStyles();
  const { onClose, open, children } = props;

  return (
    <MaterialModal classes={classes} open={open} onClose={onClose} closeAfterTransition BackdropComponent={Backdrop}>
      <React.Fragment>{children}</React.Fragment>
    </MaterialModal>
  );
});

Modal.displayName = 'Modal';

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
};

Modal.defaultProps = {
  open: false,
  onClose: () => {},
};

export default Modal;
