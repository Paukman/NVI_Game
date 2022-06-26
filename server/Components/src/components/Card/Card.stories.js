import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 90vh;
`;

export const CardComponent = (args) => {
  return (
    <Container>
      <Card {...args}>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
      </Card>
    </Container>
  );
};

export const CardHalfHeightComponent = (args) => {
  return (
    <Container>
      <h1>Mock Components</h1>
      <h1>Mock Components</h1>
      <h1>Mock Components</h1>
      <Card {...args}>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
      </Card>
    </Container>
  );
};

export const CardContentExtendMaxHeightComponent = (args) => {
  return (
    <Container>
      <Card {...args}>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
      </Card>
    </Container>
  );
};

export const CardContentExtendMaxWidthComponent = (args) => {
  return (
    <Container>
      <Card {...args}>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
        <h1>Mock Components Mock Components Mock Components Mock Components Mock Components Mock Components</h1>
      </Card>
    </Container>
  );
};

export default {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    noPadding: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    noTopPadding: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    scrollableY: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
    scrollableX: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
};
