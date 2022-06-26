import React from 'react';
import PropTypes from 'prop-types';
import { Currency } from 'mdo-react-components';
import { DeltaField } from './styled';

const currencyNumbers = [
  'column_0_1',
  'column_0_2',
  'column_2_0',
  'column_2_1',
  'column_2_2',
  'column_2_3',
  'column_2_4',
];

const deltaNumbers = [
  'column_1_2',
  'column_1_3',
  'column_1_4',
  'column_1_5',
  'column_2_0',
  'column_2_1',
  'column_2_2',
  'column_2_3',
  'column_2_4',
  'column_2_5',
  'column_3_1',
  'column_3_2',
  'column_3_3',
  'column_3_4',
  'column_4_1',
  'column_4_2',
  'column_4_3',
  'column_4_4',
  'column_5_1',
  'column_5_2',
  'column_5_3',
  'column_5_4',
];

const CellRenderer = ({ value, dataRow, column }) => {
  if (column.field === 'title') {
    if (dataRow.header === true || dataRow.total === true) {
      return <b style={{ textTransform: 'uppercase' }}>{value}</b>;
    } else {
      return <span>{value}</span>;
    }
  } else if (dataRow.header === true) {
    return '';
  } else if (deltaNumbers.indexOf(column.field) !== -1) {
    const value2render = dataRow.total ? <b>{value}</b> : value;
    return (
      <DeltaField negative={value < 0} positive={value > 0}>
        {value2render}
      </DeltaField>
    );
  } else if (currencyNumbers.indexOf(column.field) !== -1) {
    const value2render = <Currency value={value} />;
    return dataRow.total === true ? <b>{value2render}</b> : value2render;
  } else {
    return dataRow.total === true ? <b>{value}</b> : <span>{value}</span>;
  }
};

CellRenderer.displayName = 'CellRenderer';

CellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
  column: PropTypes.any,
};

export { CellRenderer };
