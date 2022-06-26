import React from 'react';
import PropTypes from 'prop-types';
import { ListSubheader as MaterialUiListSubheader } from '@material-ui/core';

import { useListSubheaderStyles } from './styled';

const ListSubheader = (props) => {
  const { children, classes, disableGutters, disableSticky, component } = props;
  const localClasses = useListSubheaderStyles();

  return (
    <MaterialUiListSubheader
      classes={{
        ...localClasses,
        ...(classes || {}),
      }}
      disableGutters={disableGutters}
      disableSticky={disableSticky}
      component={component}
    >
      {children}
    </MaterialUiListSubheader>
  );
};

ListSubheader.displayName = 'ListSubheader';

ListSubheader.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.any,
  disableGutters: PropTypes.bool,
  disableSticky: PropTypes.bool,
  component: PropTypes.elementType,
};

ListSubheader.defaultProps = {
  component: 'li',
  disableGutters: false,
  disableSticky: false,
};

export { ListSubheader };
