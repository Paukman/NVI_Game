import React from 'react';
import { action } from '@storybook/addon-actions';
import { ButtonsGroup } from './ButtonsGroup';
import { Button } from '../Button';
import { placements } from '../Button/styled';

const props = {
  onClick: action('Dropdown clicked'),
  items: [
    {
      clickId: 1,
      text: 'Follow',
      iconName: 'Search',
      variant: 'alert',
      width: '200px',
      dataEl: 'follow',
    },
    {
      clickId: 2,
      text: 'Timer',
      iconName: 'Timer',
      variant: 'secondary',
      width: '200px',
      dataEl: 'timer',
    },
    {
      clickId: 3,
      text: 'Cancel',
      variant: 'default',
      onClick: action('Cancel button pressed'),
      dataEl: 'cancel',
    },
    {
      clickId: 4,
      text: 'Save',
      variant: 'success',
      onClick: action('Save button pressed'),
      dataEl: 'save',
    },
  ],
};

export const ButtonsGroupComponent = (args) => {
  return <ButtonsGroup {...args} {...props} />;
};

export default {
  title: 'Components/FormElements/ButtonsGroup',
  component: ButtonsGroup,
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
  },
};
