import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { DialogCard } from '../Dialog/DialogCard';
import { DialogContent } from '../Dialog/DialogContent';
import { DialogActions } from '../Dialog/DialogActions';
import { InputField } from '../FormElements/InputField';
import { ButtonsGroup } from '../FormElements/ButtonsGroup';
import { Header } from './styled';

const InputAlert = memo((props) => {
  const {
    cancelText,
    cancelIconName,
    confirmText,
    confirmIconName,
    confirmVariant,
    cancelVariant,
    onClose,
    onConfirm,
    label,
    open,
    title,
    value,
    required,
    errorMsg,
  } = props;

  const [state, setState] = useState(value);

  const items = [
    {
      clickId: 'cancel',
      text: cancelText,
      iconName: cancelIconName,
      variant: cancelVariant,
    },
    {
      clickId: 'confirm',
      text: confirmText,
      iconName: confirmIconName,
      variant: confirmVariant,
      disabled: required && !state,
    },
  ];

  const handleClick = (event) => {
    switch (event.clickId) {
      case 'cancel':
        if (typeof onConfirm === 'function') {
          onClose();
        }
        break;

      case 'confirm':
        if (typeof onConfirm === 'function') {
          onConfirm(state);
        }
        break;
    }
  };

  const handleChange = (name, value) => {
    setState(value);
  };

  return (
    <DialogCard onClose={handleClick} open={open}>
      <DialogContent>
        <Header>{title}</Header>
        <InputField
          label={label}
          onChange={handleChange}
          helperText={errorMsg}
          error={!!errorMsg}
          required={required}
          value={state}
        />
      </DialogContent>
      <DialogActions>
        <ButtonsGroup onClick={handleClick} items={items} />
      </DialogActions>
    </DialogCard>
  );
});

InputAlert.displayName = 'InputAlert';

InputAlert.propTypes = {
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  label: PropTypes.string,
  confirmVariant: PropTypes.string,
  confirmIconName: PropTypes.string,
  confirmText: PropTypes.string,
  cancelIconName: PropTypes.string,
  cancelText: PropTypes.string,
  cancelVariant: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  errorMsg: PropTypes.string,
};

InputAlert.defaultProps = {
  confirmVariant: 'success',
  confirmText: 'OK',
  cancelText: 'Cancel',
  cancelVariant: 'default',
  required: true,
};

export { InputAlert };
