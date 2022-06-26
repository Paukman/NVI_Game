import React, { useState } from 'react';
import { RadioButton } from './RadioButton';
import { action } from '@storybook/addon-actions';

export const RadioButtonComponent = (args) => {
  return (
    <RadioButton
      {...args}
      onChange={(name, value) => {
        action('Radio Button Selected')({ name, value });
      }}
    />
  );
};
export const RadioButtonsComponents = (args) => {
  const [selected, setSelected] = useState('');

  return (
    <div>
      {Array.from({ length: 5 }).map((chk, idx) => {
        const chkId = `radio-${idx}`;
        return (
          <RadioButton
            key={idx}
            id={args.id}
            value={chkId}
            checked={selected === chkId}
            onChange={(name, value) => {
              action('Radio Button Selected')({ name, value });
              setSelected(value);
            }}
          />
        );
      })}
    </div>
  );
};

export default {
  title: 'Components/FormElements/RadioButton',
  component: RadioButton,
  argTypes: {
    id: {
      control: {
        type: 'text',
      },
      defaultValue: 'radiobutton',
    },
    value: {
      control: {
        type: 'text',
      },
      defaultValue: 'some-value',
    },
    checked: {
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
  },
};
