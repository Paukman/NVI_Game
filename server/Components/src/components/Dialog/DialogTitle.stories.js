import React from 'react';
import { action } from '@storybook/addon-actions';
import { DialogTitle } from './DialogTitle';

export const DialogTitleComponent = (args) => {
  return (
    <DialogTitle onClose={args.hasOnClose ? action('Close Icon Clicked') : undefined} title={args.title}>
      {args.text}
    </DialogTitle>
  );
};

export default {
  title: 'Components/Dialog/DialogTitle',
  component: DialogTitle,
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
    children: {
      control: {
        disable: true,
      },
    },
  },
};
