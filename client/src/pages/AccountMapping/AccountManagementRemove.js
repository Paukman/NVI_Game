import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, RemoveConfirmationDialog } from 'mdo-react-components';
import { getText } from '../../utils/localesHelpers';

const AccountManagementRemove = memo((props) => {
  const { accountName, onRemove, onCancel, open } = props;

  const Actions = () => {
    return (
      <Fragment>
        <Button onClick={onCancel} iconName='Block' text={getText('generic.cancel')} variant='default' />
        <Button onClick={onRemove} iconName='DeleteOutline' text={getText('generic.confirm')} variant='alert' />
      </Fragment>
    );
  };

  return (
    <RemoveConfirmationDialog
      open={open}
      title={getText('accountmanagement.modals.remove.title')}
      description={getText('accountmanagement.modals.remove.text', { code: (accountName || {}).accountName })}
      onCancel={onCancel}
      onClose={onCancel}
      onConfirm={onRemove}
      deleteText={getText('generic.confirm')}
      cancelText={getText('generic.cancel')}
    />
  );
});

AccountManagementRemove.displayName = 'AccountManagementRemove';

AccountManagementRemove.propTypes = {
  accountName: PropTypes.any,
  onRemove: PropTypes.func,
  onCancel: PropTypes.func,
  open: PropTypes.bool,
};

export { AccountManagementRemove };
