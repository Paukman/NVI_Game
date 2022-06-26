import React from 'react';
import { action } from '@storybook/addon-actions';
import { DialogClose } from './DialogClose';

export const DialogCloseComponent = (args) => {
  return (
    <DialogClose
      iconColor='red'
      onClose={args.hasOnClose ? action('Close Icon Clicked') : undefined}
      title={args.title}
    />
  );
};

export default {
  title: 'Components/Dialog/DialogClose',
  component: DialogClose,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is dialog title',
    },
    hasOnClose: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Close',
    },
    onClose: {
      control: {
        disable: true,
      },
    },
  },
};
