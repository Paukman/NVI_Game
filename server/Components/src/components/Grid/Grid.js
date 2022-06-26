import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Grid as GridMaterialUI } from '@material-ui/core';

import useStyles from './styled';

const Grid = memo((props) => {
  const classes = useStyles();
  const { wrap, spacing, alignContent, alignItems, direction, justify, children } = props;

  return (
    <GridMaterialUI
      className={classes.root}
      container
      spacing={spacing}
      justify={justify}
      direction={direction}
      alignItems={alignItems}
      alignContent={alignContent}
      wrap={wrap}
    >
      {children}
    </GridMaterialUI>
  );
});

Grid.displayName = 'Grid';

Grid.propTypes = {
  wrap: PropTypes.string,
  spacing: PropTypes.number,
  alignContent: PropTypes.string,
  alignItems: PropTypes.string,
  direction: PropTypes.string,
  justify: PropTypes.string,
  children: PropTypes.node,
};

Grid.defaultProps = {
  wrap: 'wrap',
  spacing: 0,
  alignContent: 'stretch',
  alignItems: 'stretch',
  direction: 'row',
  justify: 'flex-start',
  children: undefined,
};

export default Grid;
