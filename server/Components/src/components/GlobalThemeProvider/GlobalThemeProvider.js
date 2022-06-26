import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import DefaultTheme from '../../theme/theme';
import { GlobalStyles } from '../GlobalStyles';
import { ThemeProvider } from '@material-ui/core';

const GlobalThemeProvider = (props) => {
  const { theme, children } = props;
  const themeToUse = theme || DefaultTheme;

  return (
    <StyledThemeProvider theme={themeToUse}>
      <ThemeProvider theme={themeToUse}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledThemeProvider>
  );
};

GlobalThemeProvider.propTypes = {
  theme: PropTypes.any,
  children: PropTypes.node,
};

export default GlobalThemeProvider;
