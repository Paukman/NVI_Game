import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    h1: {
      '&.MuiTypography-h1': {
        fontSize: '60px',
        fontWeight: 'normal',
      },
    },
    h2: {
      '&.MuiTypography-h2': {
        fontSize: '48px',
        fontWeight: 'normal',
      },
    },
    h3: {
      '&.MuiTypography-h3': {
        fontSize: '34px',
        fontWeight: 'normal',
      },
    },
    h4: {
      '&.MuiTypography-h4': {
        fontSize: '24px',
        fontWeight: 'normal',
      },
    },
    h5: {
      '&.MuiTypography-h5': {
        fontSize: '20px',
        fontWeight: 'normal',
      },
    },
  };
});

export default useStyles;
