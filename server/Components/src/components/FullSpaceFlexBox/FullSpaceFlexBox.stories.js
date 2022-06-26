import React from 'react';
import { FullSpaceFlexBox } from './FullSpaceFlexBox';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: top;
  width: 100%;
  height: 50vh;
  background-color: #fafafa;
`;

export const FullSpaceFlexBoxComponent = (args) => {
  return (
    <FullSpaceFlexBox {...args}>
      <div>Full Space FlexBox</div>
    </FullSpaceFlexBox>
  );
};

export const FullSpaceFlexBoxComponentInsideFlexContainer = (args) => {
  return (
    <Container>
      <FullSpaceFlexBox {...args}>
        <div>Full Space Flex Box</div>
      </FullSpaceFlexBox>
    </Container>
  );
};

export default {
  title: 'Components/FullSpaceFlexBox',
  component: FullSpaceFlexBox,
};
