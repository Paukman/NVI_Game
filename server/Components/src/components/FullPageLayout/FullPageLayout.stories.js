import React from 'react';
import FullPageLayout from './FullPageLayout';
import { Image } from '../Image';

export const FullPageLayoutComponent = (args) => {
  return (
    <FullPageLayout {...args}>
      <div>Full Page Layout Component</div>
    </FullPageLayout>
  );
};

export default {
  title: 'Components/Layouts/FullPageLayout',
  component: FullPageLayout,
  argTypes: {
    bgColor: {
      control: {
        type: 'text',
      },
      defaultValue: 'green',
    },
    bgImage: {
      control: {
        type: 'text',
      },
      defaultValue: 'https://images.pexels.com/photos/3890376/pexels-photo-3890376.jpeg',
    },
  },
};
