import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { GridOverlay, DataGrid } from '@material-ui/data-grid';
import { Container, useStyles } from './styled';
const DataTable = memo((props) => {
  const classes = useStyles();
  const { rows, columns, pageSize, checkboxSelection, height, emptyTextMsg } = props;
  let rowsToUse = rows;
  let columnToUse = columns;
  if (!Array.isArray(rows)) {
    console.error('The "rows" prop of the DataTable component is expected to be an array but got:', rows);
    rowsToUse = [];
  }
  if (!Array.isArray(columns)) {
    console.error('The "columns" prop of the DataTable component is expected to be an array but got:', columns);
    columnToUse = [];
  }
  function CustomNoRowsOverlay() {
    return <GridOverlay>{emptyTextMsg}</GridOverlay>;
  }
  return (
    <Container>
      <DataGrid
        rows={rowsToUse}
        columns={columnToUse}
        pageSize={pageSize}
        checkboxSelection={checkboxSelection}
        hideFooterSelectedRowCount
        hideFooterPagination
        hideFooter
        autoHeight
        height={height}
        disableColumnMenu
        className={classes.root}
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </Container>
  );
});

DataTable.displayName = 'DataTable';

DataTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any).isRequired,
  columns: PropTypes.arrayOf(PropTypes.any).isRequired,
  pageSize: PropTypes.number,
  checkboxSelection: PropTypes.bool,
  height: PropTypes.string,
  NoRowsOverlay: PropTypes.element,
  emptyTextMsg: PropTypes.string,
};

DataTable.defaultProps = {
  pageSize: 100,
  checkboxSelection: false,
  height: '100%',
  emptyTextMsg: 'No rows',
};

export { DataTable };
