import React, { Fragment, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { range } from 'lodash';
import { DragDropList } from './DragDropList';
import { colors } from '../../theme/colors';

const items = [
  {
    id: 1,
    label: 'Not top chart 1',
    iconName: 'Add',
  },
  {
    id: 2,
    label: 'Not top chart 2',
    iconName: 'calendar',
  },
  {
    id: 3,
    label: 'Not top chart 3',
    iconName: 'Plus',
  },
  {
    id: 4,
    label: 'Not top chart 4',
    disabled: true,
  },
  {
    id: 5,
    label: 'Not top chart 5',
    iconName: '',
  },
  ...range(6, 10).map((item) => ({
    id: item,
    label: `Top chart ${item}`,
    alwaysTop: true,
  })),
];

export const DragDropListComponent = (args) => {
  // it gives selected item id
  const [selectedId, setSelectedId] = useState('');
  // it gives ordered list
  const [orderedList, setOrderedList] = useState([]);

  return (
    <Fragment>
      <DragDropList
        {...args}
        itemsData={items}
        onChange={setOrderedList}
        selectedId={selectedId}
        backgrounds={{
          background: colors.lightOrange,
          draggingBackground: colors.blue,
          draggingOverBackground: colors.grey,
        }}
        onClick={(value) => {
          setSelectedId(value.id);
          action('Item clicked')(value);
        }}
      />
      <div>{`Order List: ${orderedList.map((item) => item.id)}`}</div>
    </Fragment>
  );
};

export default {
  title: 'Components/List',
  component: DragDropList,
  argTypes: {
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
    width: {
      control: {
        type: 'number',
      },
      defaultValue: 250,
    },
  },
};
