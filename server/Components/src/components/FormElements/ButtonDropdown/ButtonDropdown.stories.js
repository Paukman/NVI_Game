import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonDropdown } from './ButtonDropdown';
import { Button } from '../Button';

const props = {
  onClick: action('Dropdown clicked'),
  items: [
    { label: 'Email', icon: 'search' },
    { label: 'KPI Hotel Revenue Graphical Interface', icon: 'Assignment' },
  ],
};

const Icon = { names: ['', 'search', 'Assignment', 'ExpandMoreOutlined'] };
const IconColors = { colors: ['', 'lightgrey', 'red', 'blue'] };

const propsWithoutIcon = {
  onClick: action('Dropdown clicked'),
  items: [{ label: 'Email' }, { label: 'KPI Hotel Revenue Graphical Interface' }],
};

export const ButtonDropdownComponent = (args) => {
  return <ButtonDropdown {...args} {...props} />;
};

export const ButtonDropdownComponentWithoutIcon = (args) => {
  return <ButtonDropdown {...args} {...propsWithoutIcon} />;
};

export default {
  title: 'Components/FormElements/ButtonDropdown',
  component: ButtonDropdown,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
      defaultValue: 'Action',
    },
    variant: {
      control: {
        type: 'select',
        options: Button.variants,
      },
      defaultValue: Button.variants[0],
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
      defaultValue: Icon.names[0],
    },
    rightIconName: {
      control: {
        type: 'select',
        options: ['', ...Icon.names],
      },
      defaultValue: Icon.names[0],
    },
    rightIconColor: {
      control: {
        type: 'select',
        options: ['', ...IconColors.colors],
      },
      defaultValue: IconColors.colors[0],
    },
  },
};
