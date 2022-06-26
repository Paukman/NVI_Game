import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  width: 100%;
  flex-wrap: wrap;

  & > * {
    margin: 15px;
  }
`;

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  box-sizing: border-box;

  & > label {
    max-width: 100%;
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const IconComponent = (args) => <Icon {...args} />;

export const LocalIcons = (args) => {
  return (
    <Container>
      {Icon.localNames.map((icon) => {
        return (
          <IconBox key={icon}>
            <Icon {...args} name={icon} />
            <label>{icon}</label>
          </IconBox>
        );
      })}
    </Container>
  );
};

export const MaterialUiIcons = (args) => {
  return (
    <Container>
      {Icon.materialUiNames
        .filter((icon) => icon.search(/outlined/i) !== -1)
        .map((icon) => {
          return (
            <IconBox key={icon}>
              <Icon {...args} name={icon} />
              <label title={icon}>{icon}</label>
            </IconBox>
          );
        })}
    </Container>
  );
};

export default {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: Icon.names,
      },
      defaultValue: Icon.names[0],
    },
    size: {
      control: {
        type: 'number',
      },
      defaultValue: 32,
    },
    color: {
      control: {
        type: 'color',
      },
      defaultValue: '#333',
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
  },
};
