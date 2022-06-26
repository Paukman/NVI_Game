import { makeStyles } from '@material-ui/core';

export const useListItemStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    // styles applied to List
    root: {
      backgroundColor: colors.darkBlue,
      color: colors.white,
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: colors.blue,
        color: colors.white,
      },
      '&.Mui-disabled': {
        backgroundColor: colors.darkBlue,
        color: colors.lightGray,
      },
      '& .MuiSvgIcon-root': {
        color: colors.white,
      },
    },
    // styles applied when dense=true
    dense: {},
    // styles applied for disabled
    disabled: {},
    // styles applied for divider
    divider: {
      height: '2px',
      overflow: 'hidden',
      padding: '0',
    },
    // styles applied for gutters
    gutters: {},
    // styles applied for button
    button: {},
    // styles applied for selected
    selected: {},
  };
});

export const useDrawerStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    // styles applied to List
    paper: {
      backgroundColor: colors.darkBlue,
      color: colors.white,
    },
  };
});
