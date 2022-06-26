import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    root: {
      '& .MuiPaginationItem-rounded , & .MuiPaginationItem-ellipsis': {
        width: '45px',
        height: '32px',
        padding: '6px 11px 7px 11px',
        border: `1px solid ${colors.grey}`,
        backgroundColor: colors.white,
        margin: '0',
        borderRadius: '0',
        color: colors.blue,
      },
      '& .MuiPaginationItem-actions': {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'capitalize',
      },
      '& li': {
        '&:first-child button': {
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          fontWeight: '600',
        },
        '&:last-child button': {
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          fontWeight: '600',
        },
      },
      '& .Mui-selected, & .MuiPaginationItem-rounded:hover': {
        backgroundColor: colors.blue,
        color: colors.white,
        borderColor: colors.blue,
      },
      '& .MuiPaginationItem-ellipsis': {
        width: '45px',
        height: '32px',
        padding: '6px 11px 7px 11px',
      },
      '& .Mui-disabled': {
        color: colors.grey,
        border: `1px solid ${colors.grey}`,
      },
    },
  };
});

export default useStyles;
