import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { colors } from '../../../theme/colors';

export const useStyles = makeStyles((theme) => {
  return {
    root: {
      justifyContent: 'center',
      margin: '2px',
    },
    error: {
      color: colors.red,
    },
    spaceTop: {
      marginTop: '1em',
    },
  };
});

export const Container = styled.div`
  width: '100%';
`;

export const Chips = styled.div`
  padding: 0 5px;

  & > div {
    margin-right: 5px;
    margin-bottom: 5px;
  }
`;
