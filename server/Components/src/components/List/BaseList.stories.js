import React, { Fragment, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { BaseList } from './BaseList';
import { Button } from '../FormElements/Button';

const items = [
  {
    id: 1,
    label: 'Profile',
    iconName: 'Add',
  },
  {
    id: 2,
    label: 'Account Settings',
    iconName: 'calendar',
  },
  {
    id: 3,
    label: 'Notifications',
    iconName: 'Plus',
  },
  {
    id: 4,
    label: 'Billing',
    iconName: 'Plus',
    disabled: true,
  },
  {
    id: 5,
    divider: true,
  },
  {
    id: 6,
    label: 'Logout',
    iconName: '',
  },
];

export const BaseListComponent = (args) => {
  const [selectedId, setSelectedId] = useState('');
  return (
    <Fragment>
      <div>
        <p>
          This story demonstrates how <i>List</i>, <i>ListItem</i>, <i>ListItemIcon</i> are used together in{' '}
          <i>BaseList</i> component. The component takes full width of its parent.
        </p>
        <p>
          <b>NOTE:</b> The `Billing` item is disabled. `Logout` does not have an icon.
        </p>
      </div>
      <BaseList
        items={items}
        {...args}
        selectedId={selectedId}
        onClick={(value) => {
          setSelectedId(value.id);
          action('Item clicked')(value);
        }}
      />
      <Button
        text='Deselect'
        onClick={() => {
          setSelectedId('');
          action('Deselect clicked')(value);
        }}
      />
    </Fragment>
  );
};

export default {
  title: 'Components/List',
  component: BaseList,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    dense: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disablePadding: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disableGutters: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
