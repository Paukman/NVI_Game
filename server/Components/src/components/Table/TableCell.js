import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { TableCell as TableCellMaterialUI } from '@material-ui/core';

const TableCell = memo((props) => {
  const { children, ...attributes } = props;
  return <TableCellMaterialUI {...attributes}>{children}</TableCellMaterialUI>;
});
TableCell.displayName = 'TableCell';

TableCell.propTypes = {
  children: PropTypes.node,
};

export default TableCell;
