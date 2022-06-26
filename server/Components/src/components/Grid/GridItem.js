import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid as GridItemMaterialUI } from '@material-ui/core';

import useStyles from './styled';

const GridItem = memo((props) => {
  const classes = useStyles();
  const { xs, sm, md, lg, zeroMinWidth, children, ...attributes } = props;

  return (
    <GridItemMaterialUI
      item
      classes={classes}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      zeroMinWidth={zeroMinWidth}
      {...attributes}
    >
      {children}
    </GridItemMaterialUI>
  );
});
GridItem.displayName = 'GridItem';

GridItem.propTypes = {
  children: PropTypes.node,
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
  zeroMinWidth: PropTypes.bool,
};

GridItem.defaultProps = {
  zeroMinWidth: false,
};

export default GridItem;
