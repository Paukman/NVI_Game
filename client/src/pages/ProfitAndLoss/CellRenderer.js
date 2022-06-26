import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import { Currency } from 'mdo-react-components';
import { StyledCellRenderer } from './styled';
import { VALUE_TYPES } from 'config/constants';

const CellRenderer = (props) => {
  const { value, dataRow, isRev, column } = props;

  if (
    (dataRow.valueType === VALUE_TYPES.CURRENCY || column.valueType === VALUE_TYPES.CURRENCY) &&
    value != null &&
    value !== '' &&
    !isRev
  ) {
    const amount = (
      <StyledCellRenderer
        location={column.location}
        topLevelHeaders={dataRow.topLevelHeaders}
        subLevelHeaders={dataRow.subLevelHeaders}
        bold={dataRow.header || dataRow.footer}
      >
        <Currency value={Number(value)} />
      </StyledCellRenderer>
    );
    return amount;
  } else if (isRev || (dataRow.valueType === VALUE_TYPES.PERCENTAGE && value != null && value !== '')) {
    const amount =
      value != null && value !== ''
        ? `${(Number(value) * 100).toFixed(2)}%`
        : column?.location == 'PnL comparison' && (dataRow?.parentId === null || dataRow?.hasHorizontalBottomBorder)
        ? 'N/A'
        : '';
    return (
      <StyledCellRenderer
        location={column.location}
        topLevelHeaders={dataRow.topLevelHeaders}
        subLevelHeaders={dataRow.subLevelHeaders}
        bold={dataRow.header || dataRow.footer}
      >
        {amount}
      </StyledCellRenderer>
    );
  } else {
    const isNumber = !isNaN(value) && value != null && value !== '';
    const value2render = isNumber
      ? numeral(value).format('0,00')
      : value && value === 0
      ? value
      : column?.location == 'PnL comparison' && (dataRow?.parentId === null || dataRow?.hasHorizontalBottomBorder)
      ? 'N/A'
      : '';
    return (
      <StyledCellRenderer
        location={column.location}
        topLevelHeaders={dataRow.topLevelHeaders}
        subLevelHeaders={dataRow.subLevelHeaders}
        bold={dataRow.header || dataRow.footer}
      >
        {value2render}
      </StyledCellRenderer>
    );
  }
};

CellRenderer.displayName = 'CellRenderer';

CellRenderer.propTypes = {
  column: PropTypes.any,
  value: PropTypes.any,
  dataRow: PropTypes.any,
  isRev: PropTypes.any,
};

export { CellRenderer };
