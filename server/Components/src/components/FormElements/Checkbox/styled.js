import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const { palette } = theme || {};
  const colors = palette.common || {};
  return {
    root: (props) => ({
      '&:hover': {
        backgroundColor: 'transparent',
      },
      transform: props.checkboxSize ? props.checkboxSize : 'scale(1)',
      marginRight: props.withRightMargin ? '0.2em' : '0',
    }),
    icon: (props) => ({
      borderRadius: 50,
      width: 16,
      height: 16,
      boxShadow: `inset 0 0 0 1px ${colors.mediumGray}, inset 0 -1px 0 ${colors.mediumGray}`,
      backgroundColor: null,
      '$root.Mui-focusVisible &': {
        outline: `2px auto rgba(${colors.blue},.6)`,
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: colors.lightGray,
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background: `rgba(${colors.grey},.5)`,
      },
    }),
    checkedIcon: (props) => ({
      backgroundColor: props.checkedColor ? props.checkedColor : ` ${colors.blue}`,
      boxShadow: props.checkedColor
        ? `inset 0 0 0 1px ${props.checkedColor}, inset 0 -1px 0 ${props.checkedColor}`
        : `inset 0 0 0 1px ${colors.blue}, inset 0 -1px 0 ${colors.blue}`,
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: props.checkedColor ? props.checkedColor : ` ${colors.blue}`,
      },
    }),
  };
});

export default useStyles;
