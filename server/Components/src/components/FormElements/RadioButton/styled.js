import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    icon: {
      borderRadius: '50%',
      width: 16,
      height: 16,
      boxShadow: `inset 0 0 0 1px ${colors.mediumGray}, inset 0 -1px 0 ${colors.mediumGray}`,
      backgroundColor: colors.lightGrayishBlue,
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '$root.Mui-focusVisible &': {
        outline: `2px auto ${colors.blue}`,
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: colors.lightGray,
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        backgroundColor: colors.grey,
        opacity: 0.5,
      },
    },
    checkedIcon: {
      backgroundColor: colors.blue,
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage: `radial-gradient(${colors.white},${colors.white} 28%,transparent 32%)`,
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: colors.blue,
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        backgroundColor: colors.grey,
        opacity: 0.5,
      },
    },
  };
});
