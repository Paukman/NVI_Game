import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { InputField } from './InputField';
import { colors } from '../../../theme/colors';

export const InputFieldComponent = (args) => {
  const [value, setValue] = useState('');
  return (
    <InputField
      {...args}
      value={value}
      onChange={(name, value) => {
        action('InputField changed')({ name, value });
        setValue(value);
      }}
      onEnter={() => {
        action('onEnter action')({ value });
        setValue(value);
      }}
    />
  );
};

export default {
  title: 'Components/FormElements/InputField',
  component: InputField,
  argTypes: {
    maxNoOfChars: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
    fontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 16,
    },
    labelColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },
    variant: {
      options: InputField.variants,
      control: {
        type: 'select',
      },
      defaultValue: InputField.variants[0],
    },
    type: {
      options: InputField.types,
      control: {
        type: 'select',
      },
      defaultValue: InputField.types[0],
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Enter some text here',
    },
    multiline: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    helperText: {
      control: {
        type: 'text',
      },
      defaultValue: 'HelperText/Hint',
    },
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Input Field',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'Input Field',
    },
  },
};
