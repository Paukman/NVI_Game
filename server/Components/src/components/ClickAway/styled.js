import { makeStyles } from '@material-ui/core/styles';

export const useClickAwayStyles = makeStyles((theme) => {
  return {
    root: {
      position: 'relative',
    },
    dropdown: {
      position: 'absolute',
      top: 28,
      right: 0,
      left: 0,
      zIndex: 1,
      border: '1px solid',
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper,
    },
  };
});
