import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '../FormElements/Button';
import { DialogActions } from './DialogActions';

export const DialogActionsComponent = (args) => {
  return (
    <Fragment>
      <p>
        Below is DialogActions container that is expected to hold buttons like Ok, Cancel, etc. Buttons are expected to
        be centered and have some distance between them.
      </p>
      <p>As soon as Button component is ready please use the component instead of regular &lt;button /&gt;</p>
      <DialogActions>
        <Button onClick={action('Cancel Clicked')} text='Cancel' variant='secondary' />
        <Button onClick={action('OK Clicked')} text='OK' variant='primary' />
      </DialogActions>
    </Fragment>
  );
};

export default {
  title: 'Components/Dialog/DialogActions',
  component: DialogActions,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
};
