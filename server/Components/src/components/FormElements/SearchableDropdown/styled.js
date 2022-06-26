import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

const useStyles = makeStyles((theme) => {
  const { typography, palette } = theme || {};

  return {
    root: (props) => ({
      fontSize: `${props.dropdownFontSize ? props.dropdownFontSize : '16px'}`,
      fontWeight: 'normal',
      width: '100%',
      '& .MuiFormLabel-root.Mui-focused': {
        color: palette.common.blue,
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
    option: (props) => ({
      '&.MuiAutocomplete-option': {
        fontSize: `${props.dropdownFontSize ? props.dropdownFontSize : '16px'}`,
      },
    }),
  };
});
export const StyledLink = styled.div`
  margin-left: -12px;
`;
export const StyledLabel = styled.span`
  color: ${colors.grey};
`;
export { useStyles };
