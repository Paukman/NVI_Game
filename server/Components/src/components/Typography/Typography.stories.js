import React from 'react';
import { Typography } from './Typography';

export const TypographyComponent = (args) => {
  return <Typography {...args}>Tag</Typography>;
};

export default {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {
    variant: {
      control: {
        type: 'text',
      },
      defaultValue: 'h1',
    },
    paragraph: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
};
