import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const Container = styled.div.attrs((props) => {
  const { width, height } = props;
  return {
    style: {
      width: width || '100%',
      height: height || '100%',
      padding: 0,
    },
  };
})``;

export const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: {
      '& .dataTableHeader': {
        color: colors.blue,
      },
      '& .firstColumn': {
        color: colors.blue,
      },
      '& .evenColumn': {
        backgroundColor: colors.lightGray,
      },
      backgroundColor: colors.white,
      width: '100%',
    },
  };
});
