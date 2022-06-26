import React from 'react';
import { Header, HeaderItem } from './index';
import theme from '../../theme/theme';

const { palette } = theme || {};
const colors = palette.common || {};

export const HeaderComponent = (args) => {
  return (
    <Header {...args}>
      <HeaderItem>
        <h4>Button should be here</h4>
      </HeaderItem>
      <HeaderItem>
        <h4>First item</h4>
      </HeaderItem>
      <HeaderItem toTheRight={true}>
        <h4>Right aligned item</h4>
      </HeaderItem>
    </Header>
  );
};

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    bgColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.white,
    },
    color: {
      control: {
        type: 'color',
      },
      defaultValue: colors.black,
    },
  },
};
