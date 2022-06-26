import React, { useState } from 'react';
import Toggle from './Toggle';
import { action } from '@storybook/addon-actions';

export const ToggleComponent = (args) => {
  return (
    <Toggle onChange={action('Toggle changed')} {...args} value={[0]}>
      <p style={{ margin: 0 }}>React</p>
      <p style={{ margin: 0 }}>Redux</p>
      <p style={{ margin: 0 }}>Node</p>
    </Toggle>
  );
};

export default {
  title: 'Components/FormElements/Toggle',
  component: Toggle,
  argTypes: {
    multiple: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    noUnselect: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    size: {
      options: ['small', 'medium', 'large'],
      control: {
        type: 'select',
      },
      defaultValue: 'small',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'toggle',
    },
  },
};
