import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    toggleLabel: {
      color: colors.blue,
      textTransform: `capitalize`,
      paddingLeft: `1em`,
      paddingRight: `1em`,
    },
    selectedToggleLabel: {
      backgroundColor: `${colors.blue} !important`,
      '& .MuiToggleButton-label': {
        color: `${colors.white} !important`,
        textTransform: `capitalize`,
        paddingLeft: `1em`,
        paddingRight: `1em`,
      },
    },
  };
});

export default useStyles;
