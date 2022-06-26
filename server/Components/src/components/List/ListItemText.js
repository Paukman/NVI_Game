import React from 'react';
import PropTypes from 'prop-types';
import { ListItemText as MaterialUiListItemText } from '@material-ui/core';

import { useListItemTextStyles } from './styled';

const ListItemText = (props) => {
  const { children, classes, ...rest } = props;
  const localClasses = useListItemTextStyles(props);

  return (
    <MaterialUiListItemText classes={{ ...localClasses, ...(classes || {}) }} {...rest}>
      {children}
    </MaterialUiListItemText>
  );
};

ListItemText.displayName = 'ListItemText';

ListItemText.propTypes = {
  classes: PropTypes.any,
  children: PropTypes.node,
  primary: PropTypes.node,
  secondary: PropTypes.node,
  primaryTypographyProps: PropTypes.any,
  secondaryTypographyProps: PropTypes.any,
  disableTypography: PropTypes.bool,
  textBold: PropTypes.bool,
};

ListItemText.defaultProps = {
  textBold: false,
};

export { ListItemText };
