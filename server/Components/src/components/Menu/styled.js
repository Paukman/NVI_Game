import { makeStyles } from '@material-ui/core/styles';

const useMenuStyle = makeStyles((theme) => {
  const { palette } = theme || {};
  const { common } = palette || {};

  return {
    paper: {
      border: `1px solid ${common.grey}`,
      marginTop: 5,
      boxShadow: '0px 0px 7px -1px rgba(102,102,102,0.75)',
    },
  };
});

const useMenuItemStyle = makeStyles((theme) => {
  const { palette } = theme || {};
  const { common } = palette || {};

  return {
    root: (props) => ({
      fontSize: `${props.dropdownFontSize ? props.dropdownFontSize : '16px'}`,
      '&:focus': {
        backgroundColor: theme.palette.common.blue,
        color: theme.palette.common.white,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
          fontWeight: 'normal',
        },
      },
      '& span.MuiTypography-root.MuiListItemText-primary.MuiTypography-body1.MuiTypography-displayBlock': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: 'auto',
        whiteSpace: 'nowrap',
        fontWeight: 'normal',
      },
      '& .MuiListItemIcon-root': {
        minWidth: 40,
      },
    }),
  };
});

export { useMenuStyle, useMenuItemStyle };
