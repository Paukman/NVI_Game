import React, { Fragment, useState } from 'react';
import { Button } from '../FormElements/Button';
import { Snackbar } from './index';

export const SnackbarComponent = (args) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Button onClick={() => setOpen(true)} text='Open Snackbar' variant='primary' />
      <Snackbar open={open} onClose={() => setOpen(false)} {...args} />
    </Fragment>
  );
};

export default {
  title: 'Components/Snackbar',
  component: Snackbar,
  argTypes: {
    vertical: {
      options: Snackbar.verticals,
      control: {
        type: 'radio',
      },
      defaultValue: Snackbar.horizontals[1],
    },
    horizontal: {
      options: Snackbar.horizontals,
      control: {
        type: 'radio',
      },
      defaultValue: Snackbar.horizontals[0],
    },
    autoHideDuration: {
      control: {
        type: 'number',
      },
      defaultValue: 4000,
    },
  },
};
