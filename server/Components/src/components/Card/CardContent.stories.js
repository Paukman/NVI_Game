import React from 'react';
import CardContent from './CardContent';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 90vh;
`;

export const CardContentComponent = (args) => {
  return (
    <Container>
      <CardContent {...args}>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
        <h1>Mock Components</h1>
      </CardContent>
    </Container>
  );
};

export default {
  title: 'Components/CardContent',
  component: CardContent,
};
