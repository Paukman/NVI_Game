import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { DialogCard } from './DialogCard';
import { DialogContent } from './DialogContent';

export const DialogCardComponent = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      {/* When Button is ready use it instead */}
      <Button onClick={() => setOpen(true)} text='Open Dialog' variant='primary' />
      <DialogCard {...args} open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <p>This is the DialogCard component which is basically a container for title, content, actions</p>
          <p>You can use the following components as its children:</p>
          <ul>
            <li>DialogTitle</li>
            <li>DialogContent</li>
            <li>DialogActions</li>
          </ul>
        </DialogContent>
      </DialogCard>
    </Fragment>
  );
};

export default {
  title: 'Components/Dialog/DialogCard',
  component: DialogCard,
  argTypes: {
    simpleDialog: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
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
