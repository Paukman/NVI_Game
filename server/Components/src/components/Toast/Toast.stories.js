import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { Toast } from './index';

export const ToastComponent = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Toast' variant='primary' />
      <Toast open={open} onClose={() => setOpen(false)} {...args} />
    </Fragment>
  );
};

export default {
  title: 'Components/Toast',
  component: Toast,
  argTypes: {
    message: {
      control: {
        type: 'text',
      },
      defaultValue: 'Successful',
    },
    severity: {
      options: Toast.severities,
      control: {
        type: 'radio',
      },
      defaultValue: Toast.severities[0],
    },
    variant: {
      options: Toast.variants,
      control: {
        type: 'radio',
      },
      defaultValue: Toast.variants[0],
    },
    elevation: {
      control: {
        type: 'number',
      },
      defaultValue: 6,
    },
    vertical: {
      options: Toast.verticals,
      control: {
        type: 'radio',
      },
      defaultValue: Toast.verticals[0],
    },
    horizontal: {
      options: Toast.horizontals,
      control: {
        type: 'radio',
      },
      defaultValue: Toast.horizontals[0],
    },
    autoHideDuration: {
      control: {
        type: 'number',
      },
      defaultValue: 4000,
    },
  },
};
