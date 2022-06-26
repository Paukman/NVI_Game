import { makeStyles } from '@material-ui/core';
import { getSizeInPx } from '../../../utils/propHelpers';

export const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    label: (props) => ({
      fontSize: `${props?.labelFontSize ? getSizeInPx(props?.labelFontSize) : '16px'}`,
      color: `${props?.labelColor || colors.mediumGray}`,
      fontWeight: `${props?.labelFontWeight || 'normal'}`,
      marginLeft: `${props?.labelMarginLeft ? getSizeInPx(props?.labelMarginLeft) : ''}`,
    }),
    switchBase: {
      '&$checked': {
        color: colors.green,
        '& + $track': {
          backgroundColor: colors.mediumGreen,
          opacity: 0.5,
          border: 'none',
        },
      },
    },
    track: (props) => ({
      borderRadius: '15px',
      border: 'none',
      backgroundColor: `${props?.backgroundColor ? props?.backgroundColor : colors.mediumGray}`,
      opacity: `${props?.opacity ? props.opacity : 0.38}`,
    }),
    sizeSmall: (props) => ({
      marginLeft: `${props?.leftMarginSizeSmall ? getSizeInPx(props.leftMarginSizeSmall) : '10px'}`,
      marginRight: `${props?.rightMarginSizeSmall ? getSizeInPx(props.rightMarginSizeSmall) : '10px'}`,
    }),
    checked: {},
  };
});
