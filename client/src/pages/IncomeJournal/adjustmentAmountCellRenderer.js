import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { InputField, Currency } from 'mdo-react-components';

const AdjustmentAmountCellRenderer = ({ value, dataRow, isIncomeJournalSummaryLockSet, onChangeAdjustmentNote }) => {
  if (isIncomeJournalSummaryLockSet || dataRow.subLevelHeaders) {
    if (dataRow.subLevelHeaders) {
      return <Currency value={dataRow.totalAdjustment} />;
    }
    return <span>{value}</span>;
  } else {
    return (
      <InputField
        name='adjustmentAmount'
        inputProps={{ style: { textAlign: 'center', fontSize: '12px', fontWeight: 300 } }}
        value={value}
        onChange={(name, value) => {
          onChangeAdjustmentNote(name, value, dataRow);
        }}
        onBlur={(e) => onChangeAdjustmentNote(name, e.target.value, dataRow, 'triggered')}
        // label={}
      />
    );
  }
};

AdjustmentAmountCellRenderer.displayName = 'AdjustmentAmountCellRenderer';

AdjustmentAmountCellRenderer.propTypes = {
  value: PropTypes.any,
  dataRow: PropTypes.any,
  isIncomeJournalSummaryLockSet: PropTypes.any,
  onChangeAdjustmentNote: PropTypes.any,
};

export { AdjustmentAmountCellRenderer };
