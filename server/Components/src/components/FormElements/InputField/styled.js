import { makeStyles } from '@material-ui/core';
import { getSizeInPx } from '../../../utils/propHelpers';

const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    root: (props) => ({
      width: '100%',
      fontSize: `${props.fontSize ? getSizeInPx(props.fontSize) : '16px'}`,
      '& .MuiOutlinedInput-root.Mui-focused': {
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.blue,
        },
      },
      '& .MuiInput-underline:after': {
        borderColor: colors.blue,
      },
      '& .MuiFormLabel-root': {
        color: `${props.labelColor || colors.grey}`,
        fontSize: `${props.fontSize ? getSizeInPx(props.fontSize) : '16px'}`,
      },
      '& MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: `translate(14px, -6px) scale(0.75)`,
      },
      '& .MuiFormLabel-root.Mui-focused': {
        color: colors.blue,
      },
      '& .MuiFormHelperText-contained': {
        marginLeft: `${props.maxNoOfChars > 0 ? '0px' : '14px'}`,
      },
    }),
  };
});
1;

export default useStyles;
