import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TableRow as TableRowMaterialUI } from '@material-ui/core';

const TableRow = memo((props) => {
  const { children, ...attributes } = props;
  return <TableRowMaterialUI {...attributes}>{children}</TableRowMaterialUI>;
});
TableRow.displayName = 'TableRow';

TableRow.propTypes = {
  children: PropTypes.node,
};

export default TableRow;
