import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';

export const useDialogCardStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    paper: {
      margin: '0',
      borderRadius: '20px',
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.5)',
      border: 'none',
    },
  };
});

export const useDialogTitleStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    root: {
      position: 'relative',
      padding: '0 50px',
      boxSizing: 'border-box',
      color: colors.white,
      backgroundColor: colors.green,
      height: '55px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  };
});

export const DialogTitleText = styled.div`
  width: 100%;
  display: block;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const CloseIconContainer = styled.div`
  position: absolute;
  cursor: pointer;
  width: 50px;
  right: 0;
  top: 0;
  height: 50px;
`;

export const CloseIcon = styled.button`
  border: none;
  background-color: transparent;
  color: currentColor;
  cursor: pointer;
  display: flex;
  align-items: center;
  place-content: center;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

export const useDialogContentStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    root: {
      '&.MuiDialogContent-root': {
        padding: '32px',
        position: 'relative',
        '&:first-child': {
          padding: '32px',
        },
      },
    },
  };
});

export const useDialogActionsStyles = makeStyles((theme) => {
  return {
    root: {
      '&.MuiDialogActions-root': {
        padding: '0 32px 32px 32px',
      },
    },
  };
});

export const useSimpleDialogCardStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    paper: {
      margin: '0',
      borderRadius: '20px',
      boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.5)',
      border: 'none',
    },
  };
});

export const useSimpleDialogContentStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};

  return {
    root: {
      '&.MuiDialogContent-root': {
        padding: '0px',
        position: 'relative',
        '&:first-child': {
          padding: '0px',
        },
      },
    },
  };
});
