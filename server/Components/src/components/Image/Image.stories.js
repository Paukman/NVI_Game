import React from 'react';

import Image from './Image';
import testImage from '../../../assets/Images/img.jpeg';

export const ImageComponent = (args) => <Image {...args} />;

export default {
  title: 'Components/Image',
  component: Image,
  argTypes: {
    src: {
      control: {
        type: 'text',
      },
      defaultValue: testImage,
    },
    alt: {
      control: {
        type: 'text',
      },
      defaultValue: 'image',
    },
    width: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    height: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
  },
};
