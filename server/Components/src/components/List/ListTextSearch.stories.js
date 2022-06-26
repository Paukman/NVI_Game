import React, { useState } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';
import { ListTextSearch } from './ListTextSearch';

import { listTextSearchItems } from './data';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

export const ListTextSearchComponent = (args) => {
  const [selectedId, setSelectedId] = useState('');

  return (
    <Wrapper>
      <ListTextSearch
        {...args}
        items={listTextSearchItems}
        selectedId={selectedId}
        onClick={(value) => {
          setSelectedId(value.id);
          action('Item selected')({ value });
        }}
        height='100%'
      />
    </Wrapper>
  );
};

export default {
  title: 'Components/List',
  component: ListTextSearch,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Search',
    },
    textBold: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    timeoutMs: {
      control: {
        type: 'number',
      },
      defaultValue: 500,
    },
  },
};
