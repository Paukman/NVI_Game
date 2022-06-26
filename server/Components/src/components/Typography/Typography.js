import React, { memo } from 'react';
import Typo from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import useStyles from './styled';

const Typography = memo((props) => {
  const classes = useStyles();
  const attrs = {};

  if (props.paragraph) {
    attrs['variant'] = 'body1';
  }

  return (
    <Typo {...props} classes={classes} {...attrs}>
      {props.children}
    </Typo>
  );
});
Typography.variants = ['h1', 'h2', 'h3', 'h4', 'h5'];

Typography.displayName = 'Typography Component';

Typography.propTypes = {
  variant: PropTypes.oneOf(Typography.variants),
  children: PropTypes.node,
  paragraph: PropTypes.bool,
};

export { Typography };
