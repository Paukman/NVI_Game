import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

export const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    radio: {
      color: colors.blue,
      '&$checked': {
        color: colors.blue,
      },
    },
    checked: {},
  };
});

export const RadioText = styled.div`
  font-weight: normal;
`;
