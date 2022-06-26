import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => {
  return {
    list: {
      width: '100%',
    },
    fullList: {
      width: 'auto',
    },
  };
});

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 450px;
  max-width: 100%;
  height: 100%;
  padding: 20px;
`;

export const ListtextSearchWrapper = styled.div`
  width: 100%;
  flex: 1 1;
  overflow: hidden;
`;
