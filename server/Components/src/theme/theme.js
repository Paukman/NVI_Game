import { createMuiTheme } from '@material-ui/core';

import { colors } from './colors';

const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 640,
      sm: 768,
      md: 1024,
      lg: 1500,
    },
  },
  palette: {
    common: colors,
  },
  typography: {
    fontFamily: ['Open Sans'],
    smallFontSize: '14px',
    formElementsFontSize: '16px',
  },
  overrides: {
    MuiPickersCalendarHeader: {
      dayLabel: {
        color: colors.blue,
        fontWeight: 'bolder',
      },
    },
    MuiTypography: {
      body1: {
        fontWeight: 'bolder',
      },
      body2: {
        fontWeight: 'bold',
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: colors.blue,
      },
    },
  },
});

export default theme;
