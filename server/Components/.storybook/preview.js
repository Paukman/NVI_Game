import React from 'react';
import styled from 'styled-components';
import customViewports from './customViewports';
import { GlobalThemeProvider } from '../src/components/GlobalThemeProvider';
import { addLicense} from '../src/utils/licenseHelpers'

const StoryWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
`;

const StoryBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: { viewports: customViewports },
  license: addLicense('ch-custom-attribution')
};

export const decorators = [
  (Story) => (
    <StoryWrapper>
      <StoryBody>
        <GlobalThemeProvider>
          <Story />
        </GlobalThemeProvider>
      </StoryBody>
    </StoryWrapper>
  ),
];
