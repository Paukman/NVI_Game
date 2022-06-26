import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from './Button';
import { Icon } from '../../Icon';

export const ButtonComponent = (args) => {
  return <Button {...args} onClick={action('Button Clicked')} />;
};

export default {
  title: 'Components/FormElements/Button',
  component: Button,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'Button',
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Button',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'Button',
    },
    width: {
      control: {
        type: 'text',
      },
      defaultValue: 'auto',
    },
    size: {
      control: {
        type: 'select',
        options: Button.sizes,
      },
      defaultValue: Button.sizes[0],
    },
    variant: {
      control: {
        type: 'select',
        options: Button.variants,
      },
      defaultValue: Button.variants[0],
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    iconName: {
      control: {
        type: 'select',
        options: ['', ...Icon.names],
      },
      defaultValue: 'Search',
    },
    fontSize: {
      control: {
        type: 'text',
      },
      defaultValue: '14',
    },
  },
};
