import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { InputAlert } from './InputAlert';
import { action } from '@storybook/addon-actions';

export const InputAlertComponent = (args) => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Alert' variant='primary' />
      <InputAlert
        {...args}
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={(newValue) => {
          action('User entered:')({ newValue });
          setOpen(false);
        }}
      />
    </Fragment>
  );
};

export default {
  title: 'Components/Alert/InputAlert',
  component: InputAlert,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Duplicate KPI?',
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'KPI Name',
    },
    open: {
      control: {
        disable: true,
      },
    },
    errorMsg: {
      control: {
        type: 'text',
      },
      defaultValue: 'Required',
    },
  },
};
