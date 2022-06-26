import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Drawer as MaterialUiDrawer } from '@material-ui/core';

import { useDrawerStyles } from './styled';

const Drawer = memo((props) => {
  const { children, anchor, elevation, onClose, open, variant, classes } = props;
  const localClasses = useDrawerStyles();

  return (
    <MaterialUiDrawer
      classes={{ ...localClasses, ...(classes || {}) }}
      anchor={anchor}
      elevation={elevation}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      {children}
    </MaterialUiDrawer>
  );
});

Drawer.displayName = 'Drawer';

Drawer.anchors = ['left', 'top', 'right', 'bottom'];
Drawer.variants = ['permanent', 'persistent', 'temporary'];

Drawer.propTypes = {
  children: PropTypes.node,
  anchor: PropTypes.oneOf(Drawer.anchors),
  elevation: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  variant: PropTypes.oneOf(Drawer.variants),
  classes: PropTypes.any,
};

export { Drawer };
