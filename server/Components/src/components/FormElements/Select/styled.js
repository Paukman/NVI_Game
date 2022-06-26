import { makeStyles } from '@material-ui/core';
import styled from 'styled-components';
import { calcCssSize } from '../../../utils/propHelpers';

export const LabelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Container = styled.div`
  width: 100%;

  & > * {
    width: 100%;
  }

  & .MuiInput-underline:before {
    display: none;
  }
`;

export const useStyles = makeStyles((theme, opt) => {
  return {
    select: {
      '&.MuiSelect-select[multiple]': {
        height: '100%',
      },
    },
  };
});
