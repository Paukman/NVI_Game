import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ButtonsGroup } from '../ButtonsGroup';
import { sizesNames, isVertical, buttonsDirection, placements } from '../Button/styled';

const CONFIRM_CANCEL_BUTTONS = [
  {
    clickId: 'cancel',
    text: 'Cancel',
    variant: 'default',
  },
  {
    clickId: 'confirm',
    text: 'Confirm',
    variant: 'success',
  },
];

const ButtonsConfirmCancel = memo((props) => {
  const { isVertical, onConfirm, onCancel, size, placement } = props;
  const onClick = (item) => {
    item.clickId === 'cancel' ? onCancel(item) : onConfirm(item);
  };
  return (
    <ButtonsGroup
      placement={placement}
      isVertical={isVertical}
      items={CONFIRM_CANCEL_BUTTONS}
      onClick={onClick}
      size={size}
    />
  );
});

ButtonsConfirmCancel.displayName = 'ButtonsConfirmCancel';

ButtonsConfirmCancel.propTypes = {
  isVertical: PropTypes.bool,
  size: PropTypes.oneOf(sizesNames),
  placement: PropTypes.oneOf(placements),
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
};

ButtonsConfirmCancel.defaultProps = {
  isVertical: false,
  size: sizesNames[0],
  placement: placements[0],
  onConfirm: () => {},
  onCancel: () => {},
};

export { ButtonsConfirmCancel };
