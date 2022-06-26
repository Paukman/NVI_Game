import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const useStyles = makeStyles((theme) => {
  const { typography, palette } = theme || {};

  return {
    root: (props) => ({
      fontSize: `${props.dropdownFontSize ? props.dropdownFontSize : '14px'}`,
      fontWeight: 'normal',
      width: '100%',
      '& .MuiFormLabel-root.Mui-focused': {
        color: palette.common.blue,
      },
      '& .MuiChip-root': {
        fontSize: `${props.dropdownFontSize ? props.dropdownFontSize : '14px'}`,
        border: `${props.border || `1px solid ${colors.grey}`}`,
        backgroundColor: `${props.backgroundColor || colors.lightGray}`,
        height: `${props.height || '26px'}`,
      },
      '& .MuiFormLabel-root': {
        color: `${props.labelColor || colors.grey}`,
      },
    }),
    inputRoot: {
      '&.MuiInput-underline:after,&.MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: palette.common.blue,
      },
    },
  };
});
export const StyledLink = styled.div`
  margin-left: -12px;
`;
export const StyledLabel = styled.span`
  color: ${colors.grey};
`;
export { useStyles };
