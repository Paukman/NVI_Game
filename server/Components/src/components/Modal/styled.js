import styled from 'styled-components';
import { makeStyles } from '@material-ui/core';

export const Container = styled.div.attrs((props) => {
  const { width, height } = props;
  return {
    style: {
      width: width || '400px',
      height: height || '100px',
    },
  };
})``;

export const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: {
      background: colors.lightGray,
      '&.MuiBackdrop-root': { backgroundColor: colors.lightGray },
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: colors.grey,
      border: `2px solid ${colors.blue}`,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    title: {
      color: colors.blue,
    },
  };
});
