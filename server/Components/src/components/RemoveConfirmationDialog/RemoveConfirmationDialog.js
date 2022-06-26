import PropTypes from 'prop-types';
import React, { Fragment, memo } from 'react';
import theme from '../../theme/theme';
import { Alert } from '../Alert';
import { Button } from '../FormElements/Button';

const RemoveConfirmationDialog = memo((props) => {
  const { cancelText, description, deleteText, onClose, onCancel, onConfirm, open, title } = props;

  const Actions = () => {
    return (
      <Fragment>
        <Button onClick={onCancel} text={cancelText} variant='default' />
        <Button onClick={onConfirm} text={deleteText} variant='alert' />
      </Fragment>
    );
  };

  return (
    <Alert
      title={title}
      onClose={onClose}
      iconColor={theme.palette.common.blue}
      description={description}
      buttons={<Actions />}
      open={open}
    />
  );
});

RemoveConfirmationDialog.displayName = 'RemoveConfirmationDialog';

RemoveConfirmationDialog.propTypes = {
  title: PropTypes.string.isRequired,
  cancelText: PropTypes.string,
  description: PropTypes.string,
  deleteText: PropTypes.string,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  deleteText: PropTypes.string,
  open: PropTypes.bool,
};

export { RemoveConfirmationDialog };
