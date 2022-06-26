import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { RemoveConfirmationDialog } from './RemoveConfirmationDialog';

export const RemoveConfirmationDialogComponent = (args) => {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Dialog' variant='primary' />
      <RemoveConfirmationDialog
        {...args}
        title='Remove Item'
        onCancel={() => {
          setConfirm(false);
          setOpen(false);
        }}
        onConfirm={() => {
          setConfirm(true);
          setOpen(false);
        }}
        deleteText='Delete'
        cancelText='Cancel'
        description='This place is for description of removing item'
        open={open}
        onClose={() => setOpen(false)}
      />
      {confirm && <div>confirmed</div>}
    </Fragment>
  );
};

export default {
  title: 'Components/RemoveConfirmationDialog',
  component: RemoveConfirmationDialog,
};
