import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonsConfirmCancel } from './ButtonsConfirmCancel';
import { placements, sizesNames, directions } from '../Button/styled';
import { Button } from '../Button';

export const ButtonsConfirmCancelComponent = (args) => {
  return <ButtonsConfirmCancel {...args} onConfirm={action('Confirm')} onCancel={action('Cancel')} />;
};

export default {
  title: 'Components/FormElements/ButtonsConfirmCancel',
  component: ButtonsConfirmCancel,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: Button.sizes,
      },
      defaultValue: Button.sizes[0],
    },
    isVertical: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    placement: {
      control: {
        type: 'select',
        options: placements,
      },
      defaultValue: placements[0],
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
