import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { DialogCard } from '../Dialog/DialogCard';
import { DialogContent } from '../Dialog/DialogContent';
import { DialogActions } from '../Dialog/DialogActions';
import { DialogCloseButton } from '../Dialog/DialogCloseButton';
import { Description, Header } from './styled';

const Alert = memo((props) => {
  const { iconColor, closeIconTitle, open, onClose, description, buttons, title, ...rest } = props;
  return (
    <DialogCard {...rest} onClose={onClose} open={open}>
      <DialogContent>
        <DialogCloseButton onClick={onClose} title={closeIconTitle} iconColor={iconColor} />
        <Header>{title}</Header>
        {description && <Description>{description}</Description>}
      </DialogContent>
      <DialogActions>{buttons}</DialogActions>
    </DialogCard>
  );
});

Alert.displayName = 'Alert';
Alert.titleSize = ['h4', 'h5'];

Alert.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  buttons: PropTypes.node,
  closeIconTitle: PropTypes.string,
  iconColor: PropTypes.string,
};

export { Alert };
