import React, { useState } from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

import { TagsSelector } from './TagsSelector';
import { Button } from '../Button';
import { Content } from '../Content';
import { Typography } from '../../Typography';
import { Fragment } from 'react';

import { allTags, selectedTags } from './data';

const Wrapper = styled.div`
  width: 300px;
`;

export const TagsSelectorComponent = (args) => {
  const [tags, setTags] = useState(selectedTags);

  return (
    <Fragment>
      <Typography paragraph>
        Click on the remove icons of tags to see the component in action. Click on the button to reset tags
      </Typography>
      <Wrapper>
        <Content mb={10}>
          <Button
            text='Reset to initial state'
            onClick={() => {
              setTags(selectedTags);
            }}
          />
        </Content>
        <TagsSelector
          value={tags}
          items={allTags}
          onChange={(name, value) => {
            action('A tag removed')({ name, value });
            setTags(value);
          }}
          onClick={(tag) => {
            action('A tag clicked')({ tag });
          }}
          {...args}
        />
      </Wrapper>
    </Fragment>
  );
};

export default {
  title: 'Components/FormElements/TagsSelector',
  component: TagsSelector,
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Copy To',
    },
    name: {
      control: {
        type: 'text',
      },
      defaultValue: 'copyTo',
    },
    errorMsg: {
      control: {
        type: 'text',
      },
      defaultValue: '',
    },
    dataEl: {
      control: {
        type: 'text',
      },
      defaultValue: 'TagsSelector',
    },
    itemLabelName: {
      control: {
        type: 'text',
      },
      defaultValue: 'label',
    },
    itemValueName: {
      control: {
        type: 'text',
      },
      defaultValue: 'value',
    },
  },
};
