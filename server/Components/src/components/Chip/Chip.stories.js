import React from 'react';
import { Chip } from './Chip';
import { action } from '@storybook/addon-actions';

export const ChipComponent = (args) => {
  return <Chip {...args} onDelete={action('Chip delete icon clicked')} onClick={action('Chip clicked')} />;
};

export default {
  title: 'Components/Chip',
  component: Chip,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'chip',
    },
    clickable: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'chip',
    },
    color: {
      options: Chip.colors,
      control: {
        type: 'select',
      },
      defaultValue: Chip.colors[0],
    },
    variant: {
      options: Chip.variants,
      control: {
        type: 'select',
      },
      defaultValue: Chip.variants[0],
    },
    size: {
      options: Chip.sizes,
      control: {
        type: 'select',
      },
      defaultValue: Chip.sizes[0],
    },
  },
};
