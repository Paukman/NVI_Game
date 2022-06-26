import React from 'react';
import { NoDataToShow } from './NoDataToShow';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: top;
  width: 100%;
  height: 100vh;
  background-color: #fafafa;
`;

export const NoDataToShowComponent = (args) => {
  return <NoDataToShow {...args} />;
};

export const NoDataToShowComponentInsideFlexContainer = (args) => {
  return (
    <Container>
      <NoDataToShow {...args} />
    </Container>
  );
};

export default {
  title: 'Components/NoDataToShow',
  component: NoDataToShow,
  argTypes: {
    message: {
      control: {
        type: 'text',
      },
      defaultValue: 'No Data To Show',
    },
  },
};
