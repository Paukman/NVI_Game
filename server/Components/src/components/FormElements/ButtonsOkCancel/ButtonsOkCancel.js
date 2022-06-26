import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonsGroup } from '../ButtonsGroup';

const OK_CANCEL_BUTTONS = [
  {
    clickId: 'cancel',
    text: 'Cancel',
    iconName: 'Cancel',
    variant: 'default',
  },
  {
    clickId: 'confirm',
    text: 'OK',
    iconName: 'Check',
    variant: 'primary',
  },
];

const ButtonsOkCancel = memo((props) => {
  const { direction, onOk, onCancel, size } = props;
  const onClick = (item) => {
    item.clickId === 'cancel' ? onCancel(item) : onOk(item);
  };

  return <ButtonsGroup direction={direction} items={OK_CANCEL_BUTTONS} onClick={onClick} size={size} />;
});

ButtonsOkCancel.displayName = 'ButtonsOkCancel';

ButtonsOkCancel.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['small', 'large']),
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export { ButtonsOkCancel };
