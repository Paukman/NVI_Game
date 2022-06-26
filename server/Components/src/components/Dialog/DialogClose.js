import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import { CloseIcon } from './styled';

const DialogClose = (props) => {
  const { iconColor, onClose, title } = props;

  return (
    <CloseIcon onClick={onClose} title={title}>
      <Icon name='Close' size={15} color={iconColor} />
    </CloseIcon>
  );
};

DialogClose.displayName = 'DialogClose';

DialogClose.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  iconColor: PropTypes.string,
};

DialogClose.defaultProps = {
  title: 'Close',
};

export { DialogClose };
