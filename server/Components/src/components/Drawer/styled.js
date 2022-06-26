import { makeStyles } from '@material-ui/core/styles';

export const useDrawerStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const { common } = palette || {};

  return {
    paper: {
      backgroundColor: common.white,
      color: common.black,
    },
    root: {
      '& .MuiBackdrop-root': {
        opacity: '0.15 !important',
      },
    },
  };
});
