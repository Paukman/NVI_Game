import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';

import { CloseIconContainer, CloseIcon } from './styled';

const DialogCloseButton = (props) => {
  const { onClick, title } = props;

  return (
    typeof onClick === 'function' && (
      <CloseIconContainer>
        <CloseIcon onClick={onClick} title={title}>
          <Icon name='Close' size={15} />
        </CloseIcon>
      </CloseIconContainer>
    )
  );
};

DialogCloseButton.displayName = 'DialogCloseButton';

DialogCloseButton.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
};

DialogCloseButton.defaultProps = {
  title: 'Close',
};

export { DialogCloseButton };
