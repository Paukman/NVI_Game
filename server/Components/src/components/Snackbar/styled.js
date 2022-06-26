import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
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

export { useStyles };
