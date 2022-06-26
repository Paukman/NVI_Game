import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Currency } from 'mdo-react-components';

const TotalAmountCellRenderer = ({ value, dataRow }, type = null) => {
  // if (dataRow.subLevelHeaders) {
  return (
    <span>
      <Currency
        value={dataRow.subLevelHeaders && !dataRow?.isIJHeader && !type ? dataRow.totalAmount : value}
        style={{
          fontWeight: dataRow.topLevelHeaders || dataRow?.isIJHeader ? 700 : dataRow.subLevelHeaders ? 500 : 300,
        }}
      />
    </span>
  );
  // }
  // return <span>{value}</span>;
};

TotalAmountCellRenderer.displayName = 'TotalAmountCellRenderer';

TotalAmountCellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
};

export { TotalAmountCellRenderer };
