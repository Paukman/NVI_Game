import React from 'react';
import { Label } from './Label';
import { colors } from '../../../theme/colors';

export const LabelComponent = (args) => {
  return (
    <div style={{ width: '300px', border: '1px solid grey' }}>
      <Label {...args} />
    </div>
  );
};

export default {
  title: 'Components/FormElements/Label',
  component: Label,
  argTypes: {
    toTheRight: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Label',
    },
    fontSize: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
    },
    lineHeight: {
      control: {
        type: 'number',
      },
      defaultValue: 1.5,
    },
    color: {
      control: {
        type: 'color',
      },
      defaultValue: colors.black,
    },
    fontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
  },
};
