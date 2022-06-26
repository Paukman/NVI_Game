import React from 'react';
import PropTypes from 'prop-types';
import { Currency } from 'mdo-react-components';

const AmountCellRenderer = ({ value, dataRow }) =>
  ['Stats', 'Stat'].indexOf(dataRow.pmsTypeName) == -1 ? (
    <Currency value={Number(value)} style={{ fontWeight: dataRow.subLevelHeaders ? 500 : 300 }} />
  ) : (
    Number(value)
  );

AmountCellRenderer.displayName = 'AmountCellRenderer';

AmountCellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
};

export { AmountCellRenderer };
