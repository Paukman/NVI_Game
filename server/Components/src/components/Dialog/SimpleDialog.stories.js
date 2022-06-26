import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { SimpleDialog } from './SimpleDialog';

export const DialogTitleComponent = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Dialog' variant='primary' />
      <SimpleDialog {...args} open={open} onClose={() => setOpen(false)} title={args.title}>
        This is a dialog with title, content (this text) and actions (buttons below)
      </SimpleDialog>
    </Fragment>
  );
};

export default {
  title: 'Components/Dialog/SimpleDialog',
  component: SimpleDialog,
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
