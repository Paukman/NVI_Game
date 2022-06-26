import React from 'react';
import { action } from '@storybook/addon-actions';
import SimpleFormDemo from './SimpleFormDemo';

export const SimpleFormDemoComponent = (args) => {
  return <SimpleFormDemo onClick={action('Button Clicked')} />;
};

export default {
  title: 'Demo/inputs/SimpleFormDemo',
  component: SimpleFormDemo,
};
