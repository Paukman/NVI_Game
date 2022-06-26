import { makeStyles } from '@material-ui/core';

const useFormControlStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: (props) => ({
      minWidth: 'inherit',
      fontSize: `${props.selectedFontSize ? props.selectedFontSize : 'inherit'}`,
      '& > .MuiInput-root': {
        fontSize: `${props.selectedFontSize ? props.selectedFontSize : 'inherit'}`,
      },
      '& .MuiFormLabel-root': {
        color: `${props.labelColor || colors.grey}`,
      },
    }),
  };
});

const useInputLabelStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: (props) => ({
      fontSize: `${props.selectedFontSize ? props.selectedFontSize : 'inherit'}`,
      '& .MuiFormLabel-root': {
        color: `${props.labelColor || colors.grey}`,
      },
    }),
  };
});

const useSelectStyles = makeStyles((theme) => {
  return {
    root: (props) => ({
      fontSize: `${props.selectedFontSize ? props.selectedFontSize : 'inherit'}`,
    }),
    nativeInput: (props) => ({
      fontSize: `${props.selectedFontSize ? props.selectedFontSize : 'inherit'}`,
    }),
    menuPaper: (props) => ({
      maxHeight: `${props.maxHeight ? props.maxHeight : ''}`,
    }),
  };
});

export { useFormControlStyles, useInputLabelStyles, useSelectStyles };
