import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { Alert } from './Alert';
export const AlertComponent = (args) => {
  const [open, setOpen] = useState(false);

  const Actions = () => {
    return (
      <Fragment>
        <Button onClick={() => setOpen(false)} text='Cancel' variant='default' size='default' />
        <Button onClick={() => setOpen(false)} text='Ok' variant='alert' size='default' />
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Alert' variant='primary' />
      <Alert {...args} open={open} onClose={() => setOpen(false)} iconColor='red'>
        {args.description}
      </Alert>
    </Fragment>
  );
};

export default {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Delete Rows',
    },
    closeIconTitle: {
      control: {
        type: 'text',
      },
      defaultValue: 'close',
    },
    description: {
      control: {
        type: 'text',
      },
      defaultValue: 'Do you want to delete the selected rows?',
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
    buttons: {
      control: {
        disable: true,
      },
    },
    titleSize: {
      control: {
        type: 'select',
        options: Alert.titleSize,
      },
      defaultValue: Alert.titleSize[0],
    },
  },
};
