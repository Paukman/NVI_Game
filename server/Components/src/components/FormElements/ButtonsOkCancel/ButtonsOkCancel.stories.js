import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonsOkCancel } from './ButtonsOkCancel';

export const ButtonsConfirmCancelComponent = (args) => {
  return <ButtonsOkCancel {...args} onOk={action('OK')} onCancel={action('Cancel')} />;
};

export default {
  title: 'Components/FormElements/ButtonsOkCancel',
  component: ButtonsOkCancel,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['small', 'large'],
      },
      defaultValue: 'small',
    },
    direction: {
      control: {
        type: 'select',
        options: ['horizontal', 'vertical'],
      },
      defaultValue: 'horizontal',
    },
  },
};
