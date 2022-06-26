import React from 'react';
import styled from 'styled-components';
import { DialogContent } from './DialogContent';

const Parent = styled.div`
  background-color: #ccc;
`;

const Content = styled.div`
  background-color: #fafafa;
`;

export const DialogContentComponent = (args) => {
  return (
    <Parent>
      <DialogContent>
        <Content>
          <div>This is DialogContent component that is supposed to add padding to the Dialog component.</div>
          <div>The gray aray is the padding being added. And this text is the content.</div>
        </Content>
      </DialogContent>
    </Parent>
  );
};

export default {
  title: 'Components/Dialog/DialogContent',
  component: DialogContent,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
};
