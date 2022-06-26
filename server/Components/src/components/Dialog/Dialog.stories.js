import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { Dialog } from './Dialog';

export const DialogTitleComponent = (args) => {
  const [open, setOpen] = useState(false);

  const Actions = () => {
    return (
      <Fragment>
        <Button onClick={() => setOpen(false)} text='Cancel' variant='secondary' />
        <Button onClick={() => setOpen(false)} text='OK' variant='primary' />
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Dialog' variant='primary' />
      <Dialog {...args} open={open} onClose={() => setOpen(false)} title={args.title} actions={<Actions />}>
        This is a dialog with title, content (this text) and actions (buttons below)
      </Dialog>
    </Fragment>
  );
};

export default {
  title: 'Components/Dialog/Dialog',
  component: Dialog,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is dialog title',
    },
    disableBackdropClick: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disableEscapeKeyDown: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    fullScreen: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    maxWidth: {
      control: {
        type: 'text',
      },
      defaultValue: 'lg',
    },
    open: {
      control: {
        disable: true,
      },
    },
    onClose: {
      control: {
        disabled: true,
      },
    },
    children: {
      control: {
        disable: true,
      },
    },
  },
};
