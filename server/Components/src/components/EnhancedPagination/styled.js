import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    ul: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    sizeSmall: (props) => ({
      padding: '0px',
      paddingRight: `${props?.paddingRightSizeSmall ? getSizeInPx(props.paddingRightSizeSmall) : ''}`,
    }),
  };
});

export default useStyles;
