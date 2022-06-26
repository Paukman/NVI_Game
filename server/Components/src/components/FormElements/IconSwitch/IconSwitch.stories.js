import React from 'react';
import { action } from '@storybook/addon-actions';
import { IconSwitch } from './IconSwitch';

export const IconSwitchComponent = () => {
  return <IconSwitch onChange={action('IconSwitch  Clicked')} />;
};

export default {
  title: 'Components/FormElements/IconSwitch',
  component: IconSwitch,
  argTypes: {},
};
