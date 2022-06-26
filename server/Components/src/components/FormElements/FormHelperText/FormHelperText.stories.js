import React from 'react';
import { FormHelperText } from './FormHelperText';

export const FormHelperTextComponent = (args) => {
  return <FormHelperText {...args} />;
};

export default {
  title: 'Components/FormElements/FormHelperText',
  component: FormHelperText,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
      defaultValue: 'This is Form Helper Text Component',
    },
    error: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    filled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    focused: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    required: {
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
    variant: {
      options: FormHelperText.variants,
      control: {
        type: 'select',
      },
      defaultValue: FormHelperText.variants[0],
    },
  },
};
