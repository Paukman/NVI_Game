import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { DialogCard } from './DialogCard';
import { DialogTitle } from './DialogTitle';
import { DialogContent } from './DialogContent';
import { DialogActions } from './DialogActions';

const Dialog = memo((props) => {
  const { children, actions, title, ...rest } = props;

  return (
    <DialogCard {...rest}>
      <DialogTitle onClose={rest.onClose}>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </DialogCard>
  );
});

Dialog.displayName = 'Dialog';

Dialog.propTypes = {
  ...DialogCard.propTypes,
  title: PropTypes.string,
};

export { Dialog };
