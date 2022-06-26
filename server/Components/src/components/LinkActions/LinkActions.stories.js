import React from 'react';
import { action } from '@storybook/addon-actions';
import { LinkActions } from './LinkActions';
import { colors } from '../../theme/colors';

const items = [
  {
    text: 'Edit',
    iconName: 'calendar',
    color: 'blue',
    textDecoration: 'underline',
    iconAlign: 'left',
  },
  {
    text: 'Delete',
    iconName: 'ArrowDropDown',
    iconAlign: 'right',
    color: 'blue',
    textDecoration: 'underline',
  },
  {
    clickId: 'remove',
    text: '',
    variant: 'tertiary',
    iconName: 'Delete',
    iconColor: colors.iconGrey,
  },
];

export const LinkActionsComponent = (args) => {
  return (
    <>
      <LinkActions {...args} items={items} onClick={action('LinkActions Clicked')} />
      <div style={{ marginTop: '20px' }} />
      <LinkActions
        hasFont
        items={[
          {
            text: 'This is a custom styling LinkAction',
            color: args.color,
            textDecoration: args.textDecoration,
            fontSize: args.fontSize,
            lineHeight: args.lineHeight,
            fontWeight: args.fontWeight,
            iconAlign: args.iconAlign,
            iconName: args.addIcon ? 'Delete' : '',
            iconSize: args.iconSize,
            iconColor: args.iconColor,
          },
        ]}
        onClick={action('LinkActions Clicked')}
      />
    </>
  );
};

export default {
  title: 'Components/LinkActions',
  component: LinkActions,
  argTypes: {
    addIcon: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    iconSize: {
      control: {
        type: 'number',
      },
      defaultValue: 12,
    },
    iconColor: {
      control: {
        type: 'color',
      },
      defaultValue: colors.grey,
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    hasFont: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    color: {
      control: {
        type: 'color',
      },
      defaultValue: colors.black,
    },
    textDecoration: {
      control: {
        type: 'text',
      },
      defaultValue: 'none',
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
      defaultValue: 20,
    },
    fontWeight: {
      control: {
        type: 'text',
      },
      defaultValue: 'normal',
    },
    iconAlign: {
      control: {
        type: 'select',
        options: ['left', 'right'],
      },
      defaultValue: 'left',
    },
  },
};
